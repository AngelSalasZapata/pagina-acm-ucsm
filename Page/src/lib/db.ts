import { Surreal } from 'surrealdb';

let db: Surreal | null = null;

export async function getDb(): Promise<Surreal> {
  if (db) return db;
  db = new Surreal();
  await db.connect("http://127.0.0.1:8000/rpc", {
    namespace: "acm_ucsm",
    database: "ACMuwu",
    authentication: {
      username: 'root',
      password: 'root',
    },
  });
  return db;
}
