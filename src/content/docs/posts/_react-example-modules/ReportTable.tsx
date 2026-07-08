type Row = {
  id: string;
  name: string;
};

export function ReportTable({ rows }: { rows: Row[] }) {
  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
