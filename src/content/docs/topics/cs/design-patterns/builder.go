package main

import (
	"errors"
	"fmt"
	"strings"
)

type QueryBuilder struct {
	table      string
	columns    string
	conditions []string
	orderCol   string
	orderDir   string
	limitVal   int
	hasLimit   bool
}

func NewQuery() *QueryBuilder {
	return &QueryBuilder{columns: "*", orderDir: "ASC"}
}

func (q *QueryBuilder) Select(columns string) *QueryBuilder {
	q.columns = columns
	return q
}

func (q *QueryBuilder) From(table string) *QueryBuilder {
	q.table = table
	return q
}

func (q *QueryBuilder) Where(condition string) *QueryBuilder {
	q.conditions = append(q.conditions, condition)
	return q
}

func (q *QueryBuilder) OrderBy(column, dir string) *QueryBuilder {
	q.orderCol = column
	q.orderDir = dir
	return q
}

func (q *QueryBuilder) Limit(n int) *QueryBuilder {
	q.limitVal = n
	q.hasLimit = true
	return q
}

func (q *QueryBuilder) Build() (string, error) {
	if q.table == "" {
		return "", errors.New("FROM clause is required")
	}
	query := fmt.Sprintf("SELECT %s FROM %s", q.columns, q.table)
	if len(q.conditions) > 0 {
		query += " WHERE " + strings.Join(q.conditions, " AND ")
	}
	if q.orderCol != "" {
		query += fmt.Sprintf(" ORDER BY %s %s", q.orderCol, q.orderDir)
	}
	if q.hasLimit {
		query += fmt.Sprintf(" LIMIT %d", q.limitVal)
	}
	return query, nil
}

func main() {
	query, err := NewQuery().
		Select("id, name, email").
		From("users").
		Where("active = true").
		Where("age > 18").
		OrderBy("name", "ASC").
		Limit(10).
		Build()
	if err != nil {
		panic(err)
	}
	fmt.Println(query)
	// SELECT id, name, email FROM users WHERE active = true AND age > 18 ORDER BY name ASC LIMIT 10
}
