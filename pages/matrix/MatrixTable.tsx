import React, { memo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { TextField } from "@mui/material";

const Cell = memo(({ columnIndex, rowIndex, style, data }: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    matrix: number[][];
    onCellChange: (row: number, col: number, value: number) => void;
  };
}) => {
  const { matrix, onCellChange } = data;

  return (
    <div
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextField
        type="number"
        value={matrix[rowIndex][columnIndex] || 0}
        onChange={(e) =>
          onCellChange(rowIndex, columnIndex, Number(e.target.value))
        }
        size="small"
      />
    </div>
  );
});
const MatrixTable = ({ rows, columns, matrix, onCellChange }: {
  rows: number;
  columns: number;
  matrix: number[][];
  onCellChange: (row: number, col: number, value: number) => void;
}) => {
  return (
    <Grid
      columnCount={columns}
      rowCount={rows}
      columnWidth={80}
      rowHeight={40}
      height={400}
      width={800}
      itemData={{ matrix, onCellChange }}
      itemKey={({ rowIndex, columnIndex }) => `${rowIndex}-${columnIndex}`}
    >
      {Cell}
    </Grid>
  );
};
export default MatrixTable;