export function extractSwiftExampleSource(source, removableBlocks = []) {
  let example = source.replaceAll("\r\n", "\n");

  example = example.replace(/^\/\/ LEETCODE_TYPE: [A-Za-z_][A-Za-z0-9_]*\s*\n+/m, "");

  for (const block of removableBlocks) {
    const normalizedBlock = block.replaceAll("\r\n", "\n").trim();
    if (normalizedBlock) example = example.replaceAll(normalizedBlock, "");
  }

  const testsStart = example.search(/^func runTests\(\)\s*\{/m);
  if (testsStart >= 0) example = example.slice(0, testsStart);

  const result = example.trim();
  if (!result) throw new Error("Swift catalog source does not contain a displayable example.");
  return result;
}
