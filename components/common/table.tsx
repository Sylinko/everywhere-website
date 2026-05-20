export const Table = ({
  columnWidths,
  firstColumnHeader = false,
  children,
}: {
  columnWidths: string[];
  firstColumnHeader?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <table
      className={
        firstColumnHeader
          ? '[&_tbody_tr_td:first-child]:bg-fd-muted'
          : undefined
      }
    >
      <colgroup>
        {columnWidths.map((width: string, i: number) => (
          <col key={i} style={{ width }} />
        ))}
      </colgroup>
      {children}
    </table>
  );
};
