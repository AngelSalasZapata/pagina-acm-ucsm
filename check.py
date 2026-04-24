import os
import sys
import re

def find_issues(path):
    issues = []
    with open(path, 'rb') as f:
        content = f.read()
    # Buscar backticks no emparejados
    if content.count(b'`') % 2 != 0:
        issues.append(f"Unpaired backticks: {content.count(b'`')}")
    # Buscar comillas simples no emparejadas dentro de strings JS
    # Patrón simple: cualquier línea que tenga un número impar de comillas simples
    lines = content.split(b'\n')
    for i, line in enumerate(lines):
        if line.count(b"'") % 2 != 0:
            issues.append(f"Line {i+1} has odd single quotes: {line[:50]}")
    return issues

if __name__ == "__main__":
    for root, dirs, files in os.walk(sys.argv[1]):
        for f in files:
            if f.endswith('.astro'):
                path = os.path.join(root, f)
                issues = find_issues(path)
                if issues:
                    print(f"\n{path}:")
                    for issue in issues:
                        print(f"  {issue}")