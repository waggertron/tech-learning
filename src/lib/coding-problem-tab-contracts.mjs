function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

export function validateCodingProblemTabContracts(source, filePath = "coding-problem.mdx") {
  const errors = [];

  for (const tabsMatch of source.matchAll(/<Tabs(?:\s[^>]*)?>([\s\S]*?)<\/Tabs>/g)) {
    const labels = [
      ...tabsMatch[1].matchAll(/<TabItem\s+label=["']([^"']+)["'][^>]*>/g),
    ].map((match) => match[1]);
    const seenLabels = new Set();
    const repeatedLabels = new Set();

    for (const label of labels) {
      if (seenLabels.has(label)) repeatedLabels.add(label);
      seenLabels.add(label);
    }

    for (const label of repeatedLabels) {
      errors.push(
        filePath +
          ":" +
          lineNumber(source, tabsMatch.index) +
          ": <Tabs> repeats the " +
          label +
          " language tab",
      );
    }
  }

  const runnerIds = new Map();
  for (const runnerMatch of source.matchAll(
    /<(?:Python|TypeScript|Go|Swift)Repl\b[^>]*\bid=["']([^"']+)["'][^>]*\/?\s*>/g,
  )) {
    const id = runnerMatch[1];
    const currentLine = lineNumber(source, runnerMatch.index);
    if (runnerIds.has(id)) {
      errors.push(
        filePath +
          ":" +
          currentLine +
          ': runner id "' +
          id +
          '" duplicates line ' +
          runnerIds.get(id),
      );
    } else {
      runnerIds.set(id, currentLine);
    }
  }

  const levelTwoHeadings = [...source.matchAll(/^##\s+[^\n]+$/gm)];
  for (const heading of levelTwoHeadings.filter((match) => /^## Approach\b/.test(match[0]))) {
    const start = heading.index;
    const nextHeading = levelTwoHeadings.find((match) => match.index > start);
    const end = nextHeading?.index ?? source.length;
    const section = source.slice(start, end);

    for (const starterMatch of section.matchAll(
      /<(?:Python|TypeScript|Go|Swift)Repl\b[^>]*\bcode=\{practiceCode(?:Ts|Go|Swift)?\}[^>]*\/?\s*>/g,
    )) {
      errors.push(
        filePath +
          ":" +
          lineNumber(source, start + starterMatch.index) +
          ": completed approach section loads generic starter code",
      );
    }
  }

  return errors;
}
