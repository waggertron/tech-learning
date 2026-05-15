abstract class ReportGenerator {
  // Template method: defines the invariant sequence.
  generateReport(): void {
    const raw = this.fetchData();
    const parsed = this.parseData(raw);
    const formatted = this.formatReport(parsed);
    this.sendReport(formatted);
  }

  protected fetchData(): string {
    return 'id,name,score\n1,Alice,95\n2,Bob,87';
  }

  protected abstract parseData(raw: string): Record<string, string>[];

  protected abstract formatReport(data: Record<string, string>[]): string;

  protected sendReport(output: string): void {
    console.log('Sending report:\n' + output);
  }
}

class CSVReport extends ReportGenerator {
  protected parseData(raw: string): Record<string, string>[] {
    const [header, ...rows] = raw.trim().split('\n');
    const keys = header.split(',');
    return rows.map(row => {
      const values = row.split(',');
      return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    });
  }

  protected formatReport(data: Record<string, string>[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(r => Object.values(r).join(','));
    return [header, ...rows].join('\n');
  }
}

class JSONReport extends ReportGenerator {
  protected parseData(raw: string): Record<string, string>[] {
    const [header, ...rows] = raw.trim().split('\n');
    const keys = header.split(',');
    return rows.map(row => {
      const values = row.split(',');
      return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    });
  }

  protected formatReport(data: Record<string, string>[]): string {
    return JSON.stringify(data, null, 2);
  }
}

new CSVReport().generateReport();
// Sending report:
// id,name,score
// 1,Alice,95
// 2,Bob,87

new JSONReport().generateReport();
// Sending report:
// [{ "id": "1", "name": "Alice", "score": "95" }, ...]
