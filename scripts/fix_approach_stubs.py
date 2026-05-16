#!/usr/bin/env python3
"""Wire approach stub files into their MDX pages.

For each approach*.py / approach*.go that exists on disk but isn't wired into
a REPL tab in its MDX:
  1. Add the ?raw import if not already present
  2. Insert the REPL <TabItem> in the correct "Try this approach" Tabs block
     - Python: BEFORE the TypeScript tab
     - Go: AFTER the TypeScript tab

Handles the re-run case: if the import was added but the tab wasn't (previous
partial run), step 1 is skipped and only step 2 is attempted.
"""

import os
import re
from pathlib import Path

ROOT = Path("src/content/docs/topics/cs/coding-problems")
LANG_COMPONENT = {"py": "PythonRepl", "ts": "TypeScriptRepl", "go": "GoRepl"}
LANG_LABEL = {"py": "Python", "ts": "TypeScript", "go": "Go"}
LANG_VAR_SFX = {"py": "Py", "ts": "Ts", "go": "Go"}


def approach_var(approach: str, lang: str) -> str:
    return f"{approach}{LANG_VAR_SFX[lang]}Code"


def code_attr(var: str) -> str:
    """Return 'code={varName}' without f-string brace-escaping problems."""
    return "code={" + var + "}"


def extract_approach(stub_name: str, stem: str) -> str:
    """'stem-approach2.py' → 'approach2'"""
    rest = stub_name[len(stem) + 1:]
    return rest.rsplit(".", 1)[0]


def repl_tag(component: str, var: str, repl_id: str) -> str:
    return f'    <{component} {code_attr(var)} id="{repl_id}" />'


def build_tab(label: str, component: str, var: str, repl_id: str) -> str:
    return (
        f'  <TabItem label="{label}">\n'
        + repl_tag(component, var, repl_id)
        + "\n"
        + "  </TabItem>\n"
    )


def fix_file(mdx: Path) -> list[str]:
    text = mdx.read_text(encoding="utf-8")
    orig = text
    fixed = []
    stem = mdx.stem

    for lang in ("py", "go"):
        for stub in sorted(mdx.parent.glob(f"{stem}-approach*.{lang}")):
            approach = extract_approach(stub.name, stem)
            var = approach_var(approach, lang)
            ts_var = approach_var(approach, "ts")
            component = LANG_COMPONENT[lang]
            label = LANG_LABEL[lang]

            # ── Check if REPL tab already wired ───────────────────────────
            # Look for <Component code={var} anywhere in the file
            tab_marker = f"<{component} {code_attr(var)}"
            if tab_marker in text:
                continue  # tab already present

            # ── 1. Add import if missing ───────────────────────────────────
            import_marker = f"import {var} from"
            import_line = f"import {var} from './{stub.name}?raw';"
            ts_import_line = f"import {ts_var} from './{stem}-{approach}.ts?raw';"

            if import_marker not in text:
                if ts_import_line in text:
                    if lang == "py":
                        text = text.replace(ts_import_line, f"{import_line}\n{ts_import_line}")
                    else:
                        text = text.replace(ts_import_line, f"{ts_import_line}\n{import_line}")
                else:
                    # Fallback: insert before first ## heading
                    text = re.sub(r"\n(## )", f"\n{import_line}\n\n\\1", text, count=1)

            # ── 2. Add REPL tab ────────────────────────────────────────────
            # Derive id from the existing TypeScript REPL for this approach
            ts_repl_marker = f"<TypeScriptRepl {code_attr(ts_var)}"
            id_match = re.search(
                re.escape(ts_repl_marker) + r'\s+id="([^"]+)"',
                text,
            )
            if id_match:
                ts_id = id_match.group(1)
                new_id = re.sub(r"-ts$", f"-{lang}", ts_id)
            else:
                new_id = f"{stem[:40]}-{approach}-{lang}"

            new_tab = build_tab(label, component, var, new_id)

            if lang == "py":
                # Insert before the TypeScript TabItem for this approach
                ts_tab_anchor = (
                    '  <TabItem label="TypeScript">\n'
                    + "    " + ts_repl_marker
                )
                if ts_tab_anchor in text:
                    text = text.replace(ts_tab_anchor, new_tab + "  " + ts_tab_anchor[2:])
                    fixed.append(stub.name)
                else:
                    print(f"  WARNING: no TS tab anchor for {stub.name}")

            elif lang == "go":
                # Insert after the closing </TabItem> of the TypeScript block
                ts_block_pattern = re.compile(
                    r"(  <TabItem label=\"TypeScript\">\n"
                    + "    "
                    + re.escape(ts_repl_marker)
                    + r"[^\n]*/>\n"
                    + r"  </TabItem>)"
                )
                ts_match = ts_block_pattern.search(text)
                if ts_match:
                    text = text.replace(
                        ts_match.group(1),
                        ts_match.group(1) + "\n" + new_tab,
                    )
                    fixed.append(stub.name)
                else:
                    print(f"  WARNING: no TS block pattern for {stub.name}")

    if text != orig:
        mdx.write_text(text, encoding="utf-8")

    return fixed


def main() -> None:
    total: list[str] = []
    for mdx in sorted(ROOT.rglob("*.mdx")):
        fixed = fix_file(mdx)
        if fixed:
            print(f"{mdx.relative_to(ROOT)}: {fixed}")
            total.extend(fixed)
    print(f"\nFixed {len(total)} stub(s)")


if __name__ == "__main__":
    os.chdir(Path(__file__).parent.parent)
    main()
