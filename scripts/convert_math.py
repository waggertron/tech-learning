#!/usr/bin/env python3
"""Convert O() complexity notation in markdown files to KaTeX inline math $O()$.

Skips: frontmatter, fenced code blocks, inline backtick code, existing $...$ math.
Fixes multi-char exponents: O(n^1.585) -> $O(n^{1.585})$.
"""

import re
from pathlib import Path

# Matches regions that must NOT be converted (fenced blocks, existing math, inline code)
PROTECTED = re.compile(
    r'(```[\s\S]*?```'    # fenced code ```
    r'|~~~[\s\S]*?~~~'    # fenced code ~~~
    r'|\$\$[\s\S]*?\$\$'  # display math $$...$$
    r'|\$[^\$\n]+?\$'     # inline math $...$
    r'|`[^`\n]+?`)'       # inline code `...`
)

FRONTMATTER = re.compile(r'^---\n[\s\S]*?\n---\n')


def fix_exponents(expr):
    """Add braces around multi-char exponents inside a math expression.

    n^2       -> n^2        (single char, unchanged)
    n^1.585   -> n^{1.585}  (multi-char, braced)
    2^(m+n)   -> 2^{m+n}    (parens -> braces)
    n^{k}     -> n^{k}      (already braced, unchanged)
    """
    def brace_exp(m):
        base, exp = m.group(1), m.group(2)
        if exp.startswith('{'):         # already braced
            return m.group(0)
        if len(exp) <= 1:               # single char, fine as-is
            return m.group(0)
        if exp.startswith('(') and exp.endswith(')'):
            return f'{base}^{{{exp[1:-1]}}}'
        return f'{base}^{{{exp}}}'

    return re.sub(r'(\w)\^([^{}\s,|)\n]+)', brace_exp, expr)


def convert_o_notation(text):
    """Wrap O(...) in $...$ and fix exponents inside."""
    def replace_o(m):
        inner = fix_exponents(m.group(1))
        return f'$O({inner})$'

    return re.sub(r'\bO\(([^)$\n]+)\)', replace_o, text)


def process_body(body):
    """Split on protected regions, convert only the unprotected segments."""
    parts = PROTECTED.split(body)
    result = []
    for i, part in enumerate(parts):
        if i % 2 == 1:   # protected (code/math)
            result.append(part)
        else:
            result.append(convert_o_notation(part))
    return ''.join(result)


def process_file(filepath):
    text = filepath.read_text(encoding='utf-8')

    frontmatter = ''
    body = text
    m = FRONTMATTER.match(text)
    if m:
        frontmatter = m.group(0)
        body = text[len(frontmatter):]

    new_body = process_body(body)
    new_text = frontmatter + new_body

    if new_text != text:
        filepath.write_text(new_text, encoding='utf-8')
        return True
    return False


def main():
    root = Path('src/content/docs')
    changed = []
    errors = []

    for pattern in ['*.md', '*.mdx']:
        for fp in sorted(root.rglob(pattern)):
            try:
                if process_file(fp):
                    changed.append(str(fp.relative_to(root)))
            except Exception as e:
                errors.append(f'{fp}: {e}')

    print(f'Changed: {len(changed)} files')
    if errors:
        print(f'\nErrors ({len(errors)}):')
        for e in errors:
            print(f'  {e}')
    if changed:
        print('\nFirst 30 changed files:')
        for f in changed[:30]:
            print(f'  {f}')
        if len(changed) > 30:
            print(f'  ... and {len(changed) - 30} more')


if __name__ == '__main__':
    main()
