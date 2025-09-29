// components/Table.tsx
type Column<T> = {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

const Table = <T extends object>({ columns, data }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : (row as any)[col.accessor]}
                </td>
              ))}
              <th>
                <button className="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
