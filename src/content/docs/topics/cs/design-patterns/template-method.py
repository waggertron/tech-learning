from __future__ import annotations
from abc import ABC, abstractmethod


class ReportGenerator(ABC):
    # Template method: defines the invariant sequence.
    def generate_report(self) -> None:
        raw = self.fetch_data()
        parsed = self.parse_data(raw)
        formatted = self.format_report(parsed)
        self.send_report(formatted)

    def fetch_data(self) -> str:
        return 'id,name,score\n1,Alice,95\n2,Bob,87'

    @abstractmethod
    def parse_data(self, raw: str) -> list[dict[str, str]]: ...

    @abstractmethod
    def format_report(self, data: list[dict[str, str]]) -> str: ...

    def send_report(self, output: str) -> None:
        print(f'Sending report:\n{output}')


class CSVReport(ReportGenerator):
    def parse_data(self, raw: str) -> list[dict[str, str]]:
        lines = raw.strip().split('\n')
        keys = lines[0].split(',')
        return [dict(zip(keys, row.split(','))) for row in lines[1:]]

    def format_report(self, data: list[dict[str, str]]) -> str:
        header = ','.join(data[0].keys())
        rows = [','.join(r.values()) for r in data]
        return '\n'.join([header, *rows])


class JSONReport(ReportGenerator):
    def parse_data(self, raw: str) -> list[dict[str, str]]:
        lines = raw.strip().split('\n')
        keys = lines[0].split(',')
        return [dict(zip(keys, row.split(','))) for row in lines[1:]]

    def format_report(self, data: list[dict[str, str]]) -> str:
        import json
        return json.dumps(data, indent=2)


CSVReport().generate_report()
# Sending report:
# id,name,score
# 1,Alice,95

JSONReport().generate_report()
# Sending report:
# [{"id": "1", "name": "Alice", "score": "95"}, ...]
