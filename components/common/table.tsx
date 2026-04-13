export const Table = ({
  columnWidths,
  children,
}: {
  columnWidths: string[];
  children: React.ReactNode;
}) => {
  return (
    <table>
      <colgroup>
        {columnWidths.map((width: string, i: number) => (
          <col key={i} style={{ width }} />
        ))}
      </colgroup>
      {children}
    </table>
  );
};
