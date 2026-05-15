from __future__ import annotations


class QueryBuilder:
    def __init__(self) -> None:
        self._table = ''
        self._columns = '*'
        self._conditions: list[str] = []
        self._limit: int | None = None
        self._order_by = ''
        self._order_dir = 'ASC'

    def select(self, columns: str) -> QueryBuilder:
        self._columns = columns
        return self

    def from_(self, table: str) -> QueryBuilder:
        self._table = table
        return self

    def where(self, condition: str) -> QueryBuilder:
        self._conditions.append(condition)
        return self

    def order_by(self, column: str, direction: str = 'ASC') -> QueryBuilder:
        self._order_by = column
        self._order_dir = direction
        return self

    def limit(self, n: int) -> QueryBuilder:
        self._limit = n
        return self

    def build(self) -> str:
        if not self._table:
            raise ValueError('FROM clause is required')
        q = f'SELECT {self._columns} FROM {self._table}'
        if self._conditions:
            q += ' WHERE ' + ' AND '.join(self._conditions)
        if self._order_by:
            q += f' ORDER BY {self._order_by} {self._order_dir}'
        if self._limit is not None:
            q += f' LIMIT {self._limit}'
        return q


query = (
    QueryBuilder()
    .select('id, name, email')
    .from_('users')
    .where('active = true')
    .where('age > 18')
    .order_by('name')
    .limit(10)
    .build()
)
print(query)
# SELECT id, name, email FROM users WHERE active = true AND age > 18 ORDER BY name ASC LIMIT 10
