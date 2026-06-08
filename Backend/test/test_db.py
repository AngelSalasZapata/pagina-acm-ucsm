import importlib
from pathlib import Path

import os


def ok_requeriments() -> bool:
    req_file = Path(__file__).resolve().parent.parent / "App" / "requirements.txt"

    if not req_file.exists():
        return False

    with open(req_file) as f:
        packages = []
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                pkg = line.split("[")[0].split(">=")[0].split("==")[0].strip()
                packages.append(pkg)

    name_map = {
        "strawberry-graphql": "strawberry",
        "python-dotenv": "dotenv",
    }

    all_ok = True
    for pkg in packages:
        mod = name_map.get(pkg, pkg.replace("-", "_"))
        try:
            importlib.import_module(mod)
        except ImportError:
            all_ok = False

    return all_ok


def ok_server() -> bool:
    env_file = Path(__file__).resolve().parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())

    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    dbname = os.getenv("DB_NAME")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")

    if not all([host, port, dbname, user, password]):
        print("  missing env vars")
        return False

    try:
        from sqlalchemy import create_engine, text

        # try sync drivers first
        for mod in ("psycopg2",):
            try:
                importlib.import_module(mod)
                url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
                engine = create_engine(url, connect_args={"connect_timeout": 3})
                with engine.connect() as conn:
                    conn.execute(text("SELECT 1"))
                return True
            except ImportError:
                continue

        # fallback to async driver
        try:
            importlib.import_module("asyncpg")
            from sqlalchemy.ext.asyncio import create_async_engine
            import asyncio

            url = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{dbname}"
            engine = create_async_engine(url, connect_args={"timeout": 3})

            async def check():
                async with engine.connect() as conn:
                    await conn.execute(text("SELECT 1"))

            asyncio.run(check())
            return True
        except ImportError:
            print("  no pg driver (psycopg2/asyncpg)")
            return False
        except Exception as e:
            print(f"  asyncpg error: {e}")
            return False
    except Exception as e:
        print(f"  error: {e}")
        return False


if __name__ == "__main__":
    req = ok_requeriments()
    print(f"ok_requeriments: {req}")
    srv = ok_server()
    print(f"ok_server:       {srv}")
