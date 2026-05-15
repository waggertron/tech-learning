class QueryBuilder {
  private table = '';
  private columns = '*';
  private conditions: string[] = [];
  private limitValue: number | null = null;
  private orderByColumn = '';
  private orderDir: 'ASC' | 'DESC' = 'ASC';

  select(columns: string): this { this.columns = columns; return this; }
  from(table: string): this { this.table = table; return this; }
  where(condition: string): this { this.conditions.push(condition); return this; }
  orderBy(column: string, dir: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByColumn = column; this.orderDir = dir; return this;
  }
  limit(n: number): this { this.limitValue = n; return this; }

  build(): string {
    if (!this.table) throw new Error('FROM clause is required');
    let q = `SELECT ${this.columns} FROM ${this.table}`;
    if (this.conditions.length > 0) q += ` WHERE ${this.conditions.join(' AND ')}`;
    if (this.orderByColumn) q += ` ORDER BY ${this.orderByColumn} ${this.orderDir}`;
    if (this.limitValue !== null) q += ` LIMIT ${this.limitValue}`;
    return q;
  }
}

const query = new QueryBuilder()
  .select('id, name, email')
  .from('users')
  .where('active = true')
  .where('age > 18')
  .orderBy('name')
  .limit(10)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE active = true AND age > 18 ORDER BY name ASC LIMIT 10
