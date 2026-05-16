#!/usr/bin/env python3
"""
Build verification tests for the Here Be Dragons tech-learning site.

Run from the project root:
    python3 scripts/test_build.py

Checks:
  1. dist/ exists with enough HTML pages
  2. Coding problem pages have REPL components with non-empty stub code
  3. Run buttons (pyrepl, tsrepl, gorepl) are present on every REPL page
  4. KaTeX math renders on math-heavy pages (MathML tags + .katex spans)
  5. KaTeX CSS is bundled in dist/_astro/ (not dependent on CDN)
  6. No malformed math exponents (^{() patterns in rendered HTML
  7. Math notation ($O() not injected into fenced code blocks
  8. Spot checks: specific pages have expected content
"""

import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

DIST = Path("dist")

GREEN = "\033[32m"
RED = "\033[31m"
RESET = "\033[0m"
BOLD = "\033[1m"

failures: list[str] = []
passes = 0


def check(name: str, condition: bool, detail: str = "") -> None:
    global passes
    if condition:
        print(f"  {GREEN}PASS{RESET}  {name}")
        passes += 1
    else:
        msg = f"  {RED}FAIL{RESET}  {name}"
        if detail:
            msg += f"\n         {detail}"
        print(msg)
        failures.append(name)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


# ── HTML parser ───────────────────────────────────────────────────────────────


class TagCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.tags: list[tuple[str, dict[str, str]]] = []

    def handle_starttag(self, tag: str, attrs: list) -> None:
        self.tags.append((tag, dict(attrs)))


def extract_tags(html: str) -> list[tuple[str, dict[str, str]]]:
    p = TagCollector()
    p.feed(html)
    return p.tags


def get_data_originals(html: str) -> list[str]:
    return [attrs["data-original"] for _, attrs in extract_tags(html) if "data-original" in attrs]


def count_class(html: str, cls: str) -> int:
    return sum(
        1 for _, attrs in extract_tags(html)
        if cls in (attrs.get("class") or "").split()
    )


def strip_code_elements(html: str) -> str:
    """Remove <code>...</code> and <pre>...</pre> blocks to avoid false positives."""
    html = re.sub(r"<code[^>]*>.*?</code>", "", html, flags=re.DOTALL)
    html = re.sub(r"<pre[^>]*>.*?</pre>", "", html, flags=re.DOTALL)
    return html


def strip_data_attrs(html: str) -> str:
    """Remove data-* attribute values to avoid testing stub code content."""
    return re.sub(r'\bdata-[a-z-]+=["\'][^"\']*["\']', "", html)


# ── Page lists ────────────────────────────────────────────────────────────────


def all_html_files() -> list[Path]:
    return list(DIST.rglob("*.html"))


def problem_pages() -> list[Path]:
    return list((DIST / "topics" / "cs" / "coding-problems").rglob("index.html"))


# ── Sampled pages for targeted checks ────────────────────────────────────────

SAMPLE_PROBLEMS = [
    "arrays-and-hashing/001-two-sum",
    "1d-dynamic-programming/070-climbing-stairs",
    "1d-dynamic-programming/647-palindromic-substrings",
    "sliding-window/121-best-time-to-buy-and-sell-stock",
]

RUN_BTN_CLASSES = ["pyrepl__run", "tsrepl__run", "gorepl__run"]

MATH_PAGES = [
    # Only karatsuba converted in pilot; haversine pending full migration
    ("topics/cs/named-algorithms/karatsuba", 10),
]


# ════════════════════════════════════════════════════════════════════════════
# 1. Build existence
# ════════════════════════════════════════════════════════════════════════════


def test_build_exists() -> None:
    print(f"\n{BOLD}[1] Build existence{RESET}")
    check("dist/ directory exists", DIST.exists())

    if not DIST.exists():
        return

    html_files = all_html_files()
    check(
        f"380+ HTML pages built (found {len(html_files)})",
        len(html_files) >= 380,
        f"expected ≥380, got {len(html_files)}",
    )
    check("dist/404.html present", (DIST / "404.html").exists())
    check("dist/index.html present", (DIST / "index.html").exists())
    check(
        "coding-problems directory present",
        (DIST / "topics" / "cs" / "coding-problems").is_dir(),
    )


# ════════════════════════════════════════════════════════════════════════════
# 2. REPL stub code present
# ════════════════════════════════════════════════════════════════════════════


def test_repl_code_present() -> None:
    print(f"\n{BOLD}[2] REPL stub code present (data-original non-empty){RESET}")

    problems = problem_pages()
    check(
        f"100+ problem pages exist (found {len(problems)})",
        len(problems) >= 100,
    )

    # Targeted page checks
    for slug in SAMPLE_PROBLEMS:
        path = DIST / "topics" / "cs" / "coding-problems" / slug / "index.html"
        if not path.exists():
            check(f"{slug}: page built", False, "index.html not found")
            continue

        html = read(path)
        originals = get_data_originals(html)

        check(
            f"{slug}: has REPL component(s) (found {len(originals)})",
            len(originals) > 0,
        )

        non_empty = [v for v in originals if v and len(v.strip()) > 20]
        if originals:
            check(
                f"{slug}: all stubs non-empty ({len(non_empty)}/{len(originals)})",
                len(non_empty) == len(originals),
                f"{len(originals) - len(non_empty)} stub(s) empty or too short",
            )

    # Bulk check across all problem pages
    pages_with_empty: list[str] = []
    for p in problems:
        html = read(p)
        originals = get_data_originals(html)
        if originals and any(not v or len(v.strip()) <= 20 for v in originals):
            pages_with_empty.append(str(p.relative_to(DIST)))

    check(
        f"no empty stubs across all {len(problems)} problem pages",
        len(pages_with_empty) == 0,
        f"{len(pages_with_empty)} page(s) with empty stubs: {pages_with_empty[:3]}",
    )


# ════════════════════════════════════════════════════════════════════════════
# 3. Run buttons present
# ════════════════════════════════════════════════════════════════════════════


def test_run_buttons() -> None:
    print(f"\n{BOLD}[3] Run buttons present{RESET}")

    # Targeted checks
    for slug in SAMPLE_PROBLEMS:
        path = DIST / "topics" / "cs" / "coding-problems" / slug / "index.html"
        if not path.exists():
            check(f"{slug}: run buttons", False, "page not found")
            continue

        html = read(path)
        btn_count = sum(count_class(html, cls) for cls in RUN_BTN_CLASSES)
        check(
            f"{slug}: has run button(s) (found {btn_count})",
            btn_count > 0,
        )

    # Bulk: every page with REPL must also have a run button
    # Use count_class (HTML parser) rather than raw string search -- Astro adds
    # scoped CSS hash suffixes so the class value is never a lone "pyrepl__run".
    problems = problem_pages()
    pages_missing_btns: list[str] = []
    for p in problems:
        html = read(p)
        has_repl = bool(get_data_originals(html))
        has_button = any(count_class(html, cls) > 0 for cls in RUN_BTN_CLASSES)
        if has_repl and not has_button:
            pages_missing_btns.append(str(p.relative_to(DIST)))

    check(
        f"all REPL pages have run buttons (checked {len(problems)})",
        len(pages_missing_btns) == 0,
        f"missing buttons on: {pages_missing_btns[:3]}",
    )


# ════════════════════════════════════════════════════════════════════════════
# 4. KaTeX math rendering
# ════════════════════════════════════════════════════════════════════════════


def test_katex_rendering() -> None:
    print(f"\n{BOLD}[4] KaTeX math rendering{RESET}")

    for slug, min_count in MATH_PAGES:
        path = DIST / slug / "index.html"
        if not path.exists():
            check(f"{slug}: page exists", False)
            continue

        html = read(path)
        math_tags = len(re.findall(r"<math ", html))
        katex_spans = html.count('class="katex"')

        check(
            f"{slug}: MathML <math> tags present (found {math_tags}, min {min_count})",
            math_tags >= min_count,
        )
        check(
            f"{slug}: .katex spans present (found {katex_spans}, min {min_count})",
            katex_spans >= min_count,
        )


# ════════════════════════════════════════════════════════════════════════════
# 5. KaTeX CSS bundled locally
# ════════════════════════════════════════════════════════════════════════════


def test_katex_css_bundled() -> None:
    print(f"\n{BOLD}[5] KaTeX CSS bundled in dist/_astro/{RESET}")

    astro_dir = DIST / "_astro"
    check("dist/_astro/ directory exists", astro_dir.exists())

    if not astro_dir.exists():
        return

    css_files = list(astro_dir.glob("*.css"))
    check(f"CSS files present in _astro/ (found {len(css_files)})", len(css_files) > 0)

    # At least one CSS file should contain KaTeX rules (.katex)
    # Read the full file -- the KaTeX block may be well past the first 5000 chars.
    katex_css = [f for f in css_files if ".katex" in read(f)]
    check(
        f"KaTeX CSS bundled (found in {len(katex_css)} CSS file(s))",
        len(katex_css) > 0,
        "KaTeX CSS not found in any _astro/*.css file",
    )

    # Verify no CDN link to jsdelivr katex in page heads
    index = DIST / "index.html"
    if index.exists():
        html = read(index)
        cdn_katex = "cdn.jsdelivr.net/npm/katex" in html
        check(
            "no CDN KaTeX link in page head (COEP-safe)",
            not cdn_katex,
            "found jsdelivr KaTeX CDN link -- may fail under COEP headers",
        )


# ════════════════════════════════════════════════════════════════════════════
# 6. No malformed math exponents
# ════════════════════════════════════════════════════════════════════════════


MALFORMED_EXP = re.compile(r"\^\{\(")


def test_no_malformed_math() -> None:
    print(f"\n{BOLD}[6] No malformed math exponents (^{{(){RESET}")

    all_pages = all_html_files()
    math_pages = [p for p in all_pages if 'class="katex"' in read(p)]

    malformed: list[str] = []
    for p in math_pages:
        html = read(p)
        # Strip code elements to avoid false positives from literal code examples
        cleaned = strip_code_elements(html)
        if MALFORMED_EXP.search(cleaned):
            malformed.append(str(p.relative_to(DIST)))

    check(
        f"no malformed exponents in {len(math_pages)} math page(s)",
        len(malformed) == 0,
        f"malformed in: {malformed[:5]}",
    )


# ════════════════════════════════════════════════════════════════════════════
# 7. Math not injected into code blocks
# ════════════════════════════════════════════════════════════════════════════


MATH_DOLLAR = re.compile(r"\$O\(")


def test_no_math_in_code_blocks() -> None:
    print(f"\n{BOLD}[7] Math notation not injected into code blocks{RESET}")

    all_pages = all_html_files()
    contaminated: list[str] = []

    for p in all_pages:
        html = read(p)
        # Only look inside pre[data-language] blocks (fenced code output)
        code_blocks = re.findall(
            r'<pre[^>]+data-language[^>]*>(.*?)</pre>', html, re.DOTALL
        )
        for block in code_blocks:
            if MATH_DOLLAR.search(block):
                contaminated.append(str(p.relative_to(DIST)))
                break

    check(
        f"no $O() math inside code blocks (checked {len(all_pages)} pages)",
        len(contaminated) == 0,
        f"contaminated pages: {contaminated[:3]}",
    )


# ════════════════════════════════════════════════════════════════════════════
# 8. Spot checks
# ════════════════════════════════════════════════════════════════════════════


def test_spot_checks() -> None:
    print(f"\n{BOLD}[8] Spot checks: specific page content{RESET}")

    # karatsuba: deep math checks
    kar = DIST / "topics" / "cs" / "named-algorithms" / "karatsuba" / "index.html"
    if kar.exists():
        html = read(kar)
        check("karatsuba: page loads (non-empty HTML)", len(html) > 5000)
        check("karatsuba: KaTeX formulas rendered", html.count('class="katex"') >= 10)
        check("karatsuba: MathML present for accessibility", "<math " in html)

        # Recurrence T(n) should be inside a math element, not raw text
        cleaned = strip_code_elements(strip_data_attrs(html))
        raw_recurrence = re.search(r"T\(n\)\s*=\s*3\s*[·*]\s*T\(n/2\)", cleaned)
        check(
            "karatsuba: recurrence rendered as math (not raw ASCII)",
            raw_recurrence is None,
            "found raw T(n) = 3·T(n/2) outside code/math elements",
        )
    else:
        check("karatsuba: page built", False)

    # Climbing stairs: 3 REPL types (Python, TypeScript, Go)
    cs_path = (
        DIST
        / "topics" / "cs" / "coding-problems"
        / "1d-dynamic-programming" / "070-climbing-stairs"
        / "index.html"
    )
    if cs_path.exists():
        html = read(cs_path)
        originals = get_data_originals(html)

        py_btns = html.count("pyrepl__run")
        ts_btns = html.count("tsrepl__run")
        go_btns = html.count("gorepl__run")

        check(f"climbing-stairs: Python run buttons (found {py_btns})", py_btns > 0)
        check(f"climbing-stairs: TypeScript run buttons (found {ts_btns})", ts_btns > 0)
        check(f"climbing-stairs: Go run buttons (found {go_btns})", go_btns > 0)
        check(
            f"climbing-stairs: 9+ REPL instances (found {len(originals)})",
            len(originals) >= 9,
            "expected 3 languages × 3+ approaches",
        )

        # All stubs should contain recognizable Python/TS/Go content
        non_trivial = [v for v in originals if len(v.strip()) > 20]
        check(
            f"climbing-stairs: all {len(originals)} stubs non-trivial",
            len(non_trivial) == len(originals),
        )
    else:
        check("climbing-stairs: page built", False)

    # Two sum: basic sanity
    ts_path = (
        DIST
        / "topics" / "cs" / "coding-problems"
        / "arrays-and-hashing" / "001-two-sum"
        / "index.html"
    )
    if ts_path.exists():
        html = read(ts_path)
        check("two-sum: page loads", len(html) > 3000)
        check("two-sum: has run buttons", any(count_class(html, cls) > 0 for cls in RUN_BTN_CLASSES))
        originals = get_data_originals(html)
        check(f"two-sum: has REPL stubs (found {len(originals)})", len(originals) > 0)
    else:
        check("two-sum: page built", False)


# ════════════════════════════════════════════════════════════════════════════
# Runner
# ════════════════════════════════════════════════════════════════════════════


def main() -> None:
    print("=" * 62)
    print(f"{BOLD}Here Be Dragons -- build verification{RESET}")
    print("=" * 62)

    test_build_exists()
    test_repl_code_present()
    test_run_buttons()
    test_katex_rendering()
    test_katex_css_bundled()
    test_no_malformed_math()
    test_no_math_in_code_blocks()
    test_spot_checks()

    total = passes + len(failures)
    print("\n" + "=" * 62)
    if failures:
        print(f"{RED}{BOLD}FAILED{RESET}: {len(failures)}/{total} check(s)")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    else:
        print(f"{GREEN}{BOLD}ALL {total} CHECKS PASSED{RESET}")
    print("=" * 62)


if __name__ == "__main__":
    root = Path(__file__).parent.parent
    os.chdir(root)
    main()
