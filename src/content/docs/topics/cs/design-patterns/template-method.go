package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

type ReportSteps interface {
	ParseData(raw string) []map[string]string
	FormatReport(data []map[string]string) string
}

// GenerateReport is the template method: it owns the sequence.
func GenerateReport(steps ReportSteps) {
	raw := fetchData()
	parsed := steps.ParseData(raw)
	formatted := steps.FormatReport(parsed)
	sendReport(formatted)
}

func fetchData() string {
	return "id,name,score\n1,Alice,95\n2,Bob,87"
}

func sendReport(output string) {
	fmt.Println("Sending report:\n" + output)
}

// CSVReport implements ReportSteps.
type CSVReport struct{}

func (c CSVReport) ParseData(raw string) []map[string]string {
	lines := strings.Split(strings.TrimSpace(raw), "\n")
	keys := strings.Split(lines[0], ",")
	var result []map[string]string
	for _, row := range lines[1:] {
		values := strings.Split(row, ",")
		m := make(map[string]string)
		for i, k := range keys {
			m[k] = values[i]
		}
		result = append(result, m)
	}
	return result
}

func (c CSVReport) FormatReport(data []map[string]string) string {
	if len(data) == 0 {
		return ""
	}
	keys := []string{"id", "name", "score"}
	rows := []string{strings.Join(keys, ",")}
	for _, r := range data {
		vals := make([]string, len(keys))
		for i, k := range keys {
			vals[i] = r[k]
		}
		rows = append(rows, strings.Join(vals, ","))
	}
	return strings.Join(rows, "\n")
}

// JSONReport implements ReportSteps.
type JSONReport struct{}

func (j JSONReport) ParseData(raw string) []map[string]string {
	return CSVReport{}.ParseData(raw)
}

func (j JSONReport) FormatReport(data []map[string]string) string {
	b, _ := json.MarshalIndent(data, "", "  ")
	return string(b)
}

func main() {
	GenerateReport(CSVReport{})
	// Sending report:
	// id,name,score
	// 1,Alice,95

	GenerateReport(JSONReport{})
	// Sending report:
	// [{"id":"1","name":"Alice","score":"95"}, ...]
}
