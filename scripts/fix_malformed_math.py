#!/usr/bin/env python3
"""Fix malformed KaTeX exponents produced by convert_math.py.

The first-pass script's exponent fixer stopped at spaces/parens, leaving
patterns like:
  $O(2^{(m+n})$)     -> $O(2^{m+n})$
  $O(2^{(m} + n)$)   -> $O(2^{m+n})$
  $O(2^{(2n})$ · n)  -> $O(2^{2n} \cdot n)$
"""

import re
from pathlib import Path

FIXES = [
    # Type 1: base^{(EXPR})$) with no space inside braces
    # e.g. $O(2^{(m+n})$) -> $O(2^{m+n})$
    (re.compile(r'\$O\((\w+)\^\{\(([^}\s]+)\}\)\$\)'),
     lambda m: f'$O({m.group(1)}^{{{m.group(2)}}})$'),

    # Type 2: base^{(PART} REST)$) where space split the exponent
    # e.g. $O(2^{(m} + n)$) -> $O(2^{m+n})$
    # e.g. $O(2^{(m} · n)$) -> $O(2^{m·n})$
    (re.compile(r'\$O\((\w+)\^\{\(([^}]+)\}([^$\n]+?)\)\$\)'),
     lambda m: f'$O({m.group(1)}^{{{m.group(2)}{m.group(3).replace(" ", "")}}})$'),

    # Type 3: display math that leaked out, e.g. $O(2^{(2n})$ · n)
    # -> $O(2^{2n} \cdot n)$
    (re.compile(r'\$O\((\w+)\^\{\((\w+)\}\)\$\s*[·\*]\s*(\w+)\)'),
     lambda m: f'$O({m.group(1)}^{{{m.group(2)}}} \\cdot {m.group(3)})$'),

    # Type 4: $O(n^{(target} / min(candidates)$)) complex fractional exponent
    # Simplify to $O(n^{target/min})$
    (re.compile(r'\$O\(n\^\{\(target\}\s*/\s*min\(candidates\)\$\)\)'),
     lambda m: '$O(n^{target/min})$'),

    # Type 4b: $O(n^{(target/min})$) - if no-space version exists
    (re.compile(r'\$O\(n\^\{\(target/min\}\)\$\)'),
     lambda m: '$O(n^{target/min})$'),
]


def process_file(path):
    text = path.read_text(encoding='utf-8')
    new_text = text
    for pattern, replacement in FIXES:
        new_text = pattern.sub(replacement, new_text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        return True
    return False


def main():
    root = Path('src/content/docs')
    changed = []

    for pattern in ['*.md', '*.mdx']:
        for fp in sorted(root.rglob(pattern)):
            if process_file(fp):
                changed.append(str(fp.relative_to(root)))

    print(f'Fixed: {len(changed)} files')
    for f in changed:
        print(f'  {f}')


if __name__ == '__main__':
    main()
