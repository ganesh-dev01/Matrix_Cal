import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Matrix.module.css';
import { Container, TextField, Button, Grid, Box, Typography, CircularProgress, Select, MenuItem, Paper } from '@mui/material';
import MatrixTable from './MatrixTable';

const Matrix: React.FC = () => {
  const [rows, setRows] = useState<number | string>(0);
  const [columns, setColumns] = useState<number | string>(0);
  const [matrix1, setMatrix1] = useState<number[][]>([]);
  const [matrix2, setMatrix2] = useState<number[][]>([]);
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
  const [operation, setOperation] = useState<string>('add');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker('/matrixWorker.js');
    workerRef.current.onmessage = (e) => {
      const data = e.data;
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setResultMatrix(data);
        setLoading(false);
        setError(null);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRows(value === '' ? '' : Number(value));
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColumns(value === '' ? '' : Number(value));
  };

  const generateMatrices = () => {
    const rowsNumber = typeof rows === 'string' ? parseInt(rows) : rows;
    const columnsNumber = typeof columns === 'string' ? parseInt(columns) : columns;

    const newMatrix1 = Array.from({ length: rowsNumber }, (_, i) =>
      Array.from({ length: columnsNumber }, (_, j) => i + j)
    );
    const newMatrix2 = Array.from({ length: rowsNumber }, (_, i) =>
      Array.from({ length: columnsNumber }, (_, j) => i * j)
    );

    setMatrix1(newMatrix1);
    setMatrix2(newMatrix2);
    setResultMatrix(null);
  };

  const performOperation = () => {
    setLoading(true);
    workerRef.current?.postMessage({ matrix1, matrix2, operation });
  };

  return (
    <Container className={styles.main} maxWidth={false}>
      <Box className={styles.formContainer}>
        <Typography variant="h4" className={styles.heading}>
          Matrix Calculator
        </Typography>
        <Grid container spacing={2} alignItems="center" className={styles.gridContainer}>
          <Grid item>
            <TextField
              label="Rows"
              type="number"
              value={rows}
              onChange={handleRowChange}
              className={styles.textField}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Columns"
              type="number"
              value={columns}
              onChange={handleColumnChange}
              className={styles.textField}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={generateMatrices} className={styles.generateButton}>
              Generate
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={styles.gridContainer}>
          <Grid item>
            <Select
              value={operation}
              onChange={(e) => setOperation(e.target.value as string)}
              className={styles.selectField}
            >
              <MenuItem value="add">Add</MenuItem>
              <MenuItem value="subtract">Subtract</MenuItem>
              <MenuItem value="multiply">Multiply</MenuItem>
            </Select>
          </Grid>
          <Grid item style={{ marginTop: '16px', marginBottom: '16px' }}>
            <Button variant="contained" color="secondary" onClick={performOperation} className={styles.operationButton}>
              Perform Operation
            </Button>
          </Grid>

        </Grid>
      </Box>
      <Box className={styles.tablesContainer}>
        <Grid container spacing={4}>
          {matrix1.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper elevation={4} className={styles.tableContainer}>
                <Box p={2}>
                  <Typography variant="h6" className={styles.tableTitle}>
                    Table 1: Sum of Indices
                  </Typography>
                  <MatrixTable rows={matrix1.length} columns={matrix1[0].length} matrix={matrix1} onCellChange={() => { }} />
                </Box>
              </Paper>
            </Grid>
          )}
          {matrix2.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper elevation={4} className={styles.tableContainer}>
                <Box p={2}>
                  <Typography variant="h6" className={styles.tableTitle}>
                    Table 2: Product of Indices
                  </Typography>
                  <MatrixTable rows={matrix2.length} columns={matrix2[0].length} matrix={matrix2} onCellChange={() => { }} />
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
        {loading ? (
          <CircularProgress className={styles.loadingIndicator} />
        ) : (
          resultMatrix && (
            <Box mt={4}>
              <Typography variant="h6" className={styles.tableTitle}>
                Result Matrix
              </Typography>
              <MatrixTable rows={resultMatrix.length} columns={resultMatrix[0].length} matrix={resultMatrix} onCellChange={() => { }} />
            </Box>
          )
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Container>
  );
}

export default Matrix;