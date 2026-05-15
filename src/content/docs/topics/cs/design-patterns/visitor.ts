interface Visitor {
  visitHeading(node: Heading): void;
  visitParagraph(node: Paragraph): void;
  visitImage(node: Image): void;
}

interface Node {
  accept(visitor: Visitor): void;
}

class Heading implements Node {
  constructor(public level: number, public text: string) {}
  accept(visitor: Visitor): void {
    visitor.visitHeading(this);
  }
}

class Paragraph implements Node {
  constructor(public text: string) {}
  accept(visitor: Visitor): void {
    visitor.visitParagraph(this);
  }
}

class Image implements Node {
  constructor(public src: string, public alt: string) {}
  accept(visitor: Visitor): void {
    visitor.visitImage(this);
  }
}

class WordCountVisitor implements Visitor {
  count = 0;

  visitHeading(node: Heading): void {
    this.count += node.text.split(/\s+/).filter(Boolean).length;
  }
  visitParagraph(node: Paragraph): void {
    this.count += node.text.split(/\s+/).filter(Boolean).length;
  }
  visitImage(_node: Image): void {
    // images contribute no words
  }
}

class HTMLExportVisitor implements Visitor {
  output = '';

  visitHeading(node: Heading): void {
    this.output += `<h${node.level}>${node.text}</h${node.level}>\n`;
  }
  visitParagraph(node: Paragraph): void {
    this.output += `<p>${node.text}</p>\n`;
  }
  visitImage(node: Image): void {
    this.output += `<img src="${node.src}" alt="${node.alt}">\n`;
  }
}

const tree: Node[] = [
  new Heading(1, 'Hello World'),
  new Paragraph('The quick brown fox'),
  new Image('fox.png', 'A fox'),
  new Paragraph('jumps over the lazy dog'),
];

const counter = new WordCountVisitor();
tree.forEach(node => node.accept(counter));
console.log(counter.count); // 9

const exporter = new HTMLExportVisitor();
tree.forEach(node => node.accept(exporter));
console.log(exporter.output);
// <h1>Hello World</h1>
// <p>The quick brown fox</p>
// <img src="fox.png" alt="A fox">
// <p>jumps over the lazy dog</p>
