import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import styles from '@/styles/Matrix.module.css';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import MatrixTable from './MatrixTable';

/* ── Types ───────────────────────────────────────────────────── */
interface ExtraMeta {
  isDeterminant?: boolean;
  isTrace?: boolean;
  det?: number;
  trace?: number;
}

/* ── Helpers ─────────────────────────────────────────────────── */
function matrixToTSV(matrix: number[][]): string {
  return matrix.map((row) => row.join('\t')).join('\n');
}

const SINGLE_MATRIX_OPS = new Set(['transpose', 'determinant', 'trace', 'scalar_multiply', 'power']);
const SCALAR_OPS        = new Set(['scalar_multiply']);
const POWER_OPS         = new Set(['power']);
const SCALAR_RESULT_OPS = new Set(['determinant', 'trace']);

const OP_LABELS: Record<string, string> = {
  add:             'Addition — A + B',
  subtract:        'Subtraction — A − B',
  multiply:        'Multiplication — A × B',
  transpose:       'Transpose — Aᵀ',
  determinant:     'Determinant — det(A)',
  trace:           'Trace — tr(A)',
  scalar_multiply: 'Scalar Multiply — k · A',
  power:           'Matrix Power — Aⁿ',
};

/* ── Component ───────────────────────────────────────────────── */
const Matrix: React.FC = () => {
  const [rows, setRows]         = useState<number | string>(3);
  const [columns, setColumns]   = useState<number | string>(3);
  const [matrix1, setMatrix1]   = useState<number[][]>([]);
  const [matrix2, setMatrix2]   = useState<number[][]>([]);
  const [result, setResult]     = useState<number[][] | null>(null);
  const [extra, setExtra]       = useState<ExtraMeta | null>(null);
  const [operation, setOp]      = useState<string>('add');
  const [scalar, setScalar]     = useState<number | string>(2);
  const [power, setPower]       = useState<number | string>(2);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const isSingleOp   = SINGLE_MATRIX_OPS.has(operation);
  const isScalarOp   = SCALAR_OPS.has(operation);
  const isPowerOp    = POWER_OPS.has(operation);
  const isScalarResult = SCALAR_RESULT_OPS.has(operation);

  /* ── Web Worker ── */
  useEffect(() => {
    workerRef.current = new Worker('/matrixWorker.js');
    workerRef.current.onmessage = (e) => {
      const data = e.data;
      if (data?.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setResult(data.result);
        setExtra(data.extra ?? null);
        setLoading(false);
        setError(null);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  /* ── Generate ── */
  const generateMatrices = useCallback(() => {
    const r = typeof rows    === 'string' ? parseInt(rows)    : rows;
    const c = typeof columns === 'string' ? parseInt(columns) : columns;
    if (!r || !c || r < 1 || c < 1) return;

    setMatrix1(Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => i + j)));
    setMatrix2(Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => i * j)));
    setResult(null);
    setExtra(null);
    setError(null);
  }, [rows, columns]);

  /* ── Compute ── */
  const performOperation = useCallback(() => {
    if (!matrix1.length) return;
    setLoading(true);
    setError(null);
    workerRef.current?.postMessage({
      matrix1,
      matrix2,
      operation,
      scalar: typeof scalar === 'string' ? parseFloat(scalar) : scalar,
      power:  typeof power  === 'string' ? parseInt(power)    : power,
    });
  }, [matrix1, matrix2, operation, scalar, power]);

  /* ── Copy ── */
  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(matrixToTSV(result)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const hasMatrices = matrix1.length > 0;

  /* ── Scalar result helpers ── */
  const scalarValue  = extra?.isDeterminant ? extra.det : extra?.isTrace ? extra.trace : null;
  const scalarLabel  = extra?.isDeterminant ? 'Determinant' : extra?.isTrace ? 'Trace' : '';
  const scalarFormula = extra?.isDeterminant
    ? `det(A)  where A is ${matrix1.length}×${matrix1[0]?.length ?? 0}`
    : extra?.isTrace
    ? `tr(A) = Σᵢ aᵢᵢ`
    : '';

  return (
    <>
      <Head>
        <title>Calculator — MatrixCalc</title>
      </Head>

      <main className={styles.main}>
        {/* ── FORM ── */}
        <div className={styles.formContainer}>
          <div className={styles.pageHeader}>
            <h1 className={styles.heading}>
              Matrix <span className={styles.headingAccent}>Calculator</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Generate matrices and perform operations instantly
            </p>
          </div>

          {/* Dimensions */}
          <div className={styles.configCard}>
            <div className={styles.configCardTitle}>Dimensions</div>
            <div className={styles.gridContainer}>
              <TextField
                id="input-rows"
                label="Rows"
                type="number"
                value={rows}
                onChange={(e) => setRows(e.target.value === '' ? '' : Number(e.target.value))}
                className={styles.textField}
                size="small"
                inputProps={{ min: 1, max: 20 }}
              />
              <TextField
                id="input-columns"
                label="Columns"
                type="number"
                value={columns}
                onChange={(e) => setColumns(e.target.value === '' ? '' : Number(e.target.value))}
                className={styles.textField}
                size="small"
                inputProps={{ min: 1, max: 20 }}
              />
              <Button
                id="btn-generate"
                variant="contained"
                onClick={generateMatrices}
                className={styles.generateButton}
              >
                Generate
              </Button>
            </div>
          </div>

          {/* Operation */}
          <div className={styles.configCard}>
            <div className={styles.configCardTitle}>Operation</div>
            <div className={styles.gridContainer}>
              <Select
                id="select-operation"
                value={operation}
                onChange={(e) => { setOp(e.target.value); setResult(null); setExtra(null); setError(null); }}
                className={styles.selectField}
                size="small"
              >
                <MenuItem disabled value="__group1__">
                  <em style={{ fontSize: '0.72rem', color: 'rgba(241,245,255,0.3)', fontStyle: 'normal', letterSpacing: '1px' }}>— TWO MATRIX OPS —</em>
                </MenuItem>
                <MenuItem value="add">Addition &nbsp;— A + B</MenuItem>
                <MenuItem value="subtract">Subtraction &nbsp;— A − B</MenuItem>
                <MenuItem value="multiply">Multiplication &nbsp;— A × B</MenuItem>
                <MenuItem disabled value="__group2__">
                  <em style={{ fontSize: '0.72rem', color: 'rgba(241,245,255,0.3)', fontStyle: 'normal', letterSpacing: '1px' }}>— SINGLE MATRIX OPS —</em>
                </MenuItem>
                <MenuItem value="transpose">Transpose &nbsp;— Aᵀ</MenuItem>
                <MenuItem value="determinant">Determinant &nbsp;— det(A)</MenuItem>
                <MenuItem value="trace">Trace &nbsp;— tr(A)</MenuItem>
                <MenuItem value="scalar_multiply">Scalar Multiply &nbsp;— k · A</MenuItem>
                <MenuItem value="power">Matrix Power &nbsp;— Aⁿ</MenuItem>
              </Select>

              <Button
                id="btn-compute"
                variant="outlined"
                onClick={performOperation}
                className={styles.operationButton}
                disabled={!hasMatrices || loading}
              >
                Compute
              </Button>
            </div>

            {/* Extra input: Scalar value */}
            {isScalarOp && (
              <div className={styles.extraInputRow}>
                <span className={styles.extraInputLabel}>Scalar k =</span>
                <TextField
                  id="input-scalar"
                  type="number"
                  value={scalar}
                  onChange={(e) => setScalar(e.target.value === '' ? '' : e.target.value)}
                  size="small"
                  className={styles.textField}
                  placeholder="e.g. 2.5"
                />
              </div>
            )}

            {/* Extra input: Power n */}
            {isPowerOp && (
              <div className={styles.extraInputRow}>
                <span className={styles.extraInputLabel}>Power n =</span>
                <TextField
                  id="input-power"
                  type="number"
                  value={power}
                  onChange={(e) => setPower(e.target.value === '' ? '' : e.target.value)}
                  size="small"
                  className={styles.textField}
                  placeholder="e.g. 3"
                  inputProps={{ min: 0, max: 20 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── MATRICES ── */}
        <div className={styles.tablesContainer}>

          {/* Single-matrix hint */}
          {isSingleOp && hasMatrices && (
            <div className={styles.singleMatrixHint}>
              <span className={styles.singleMatrixHintIcon}>ℹ</span>
              <span><strong>{OP_LABELS[operation]}</strong> uses only Matrix A — Matrix B is not required.</span>
            </div>
          )}

          {hasMatrices ? (
            <div className={styles.matrixGrid}>
              {/* Matrix A */}
              <Paper elevation={0} className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <Typography className={styles.tableTitle}>Matrix A</Typography>
                  <span className={styles.tableDimBadge}>{matrix1.length} × {matrix1[0]?.length}</span>
                </div>
                <div className={styles.tableInner}>
                  <MatrixTable rows={matrix1.length} columns={matrix1[0].length} matrix={matrix1} onCellChange={() => {}} />
                </div>
              </Paper>

              {/* Matrix B — hidden for single-matrix ops */}
              {!isSingleOp && matrix2.length > 0 && (
                <Paper elevation={0} className={styles.tableContainer}>
                  <div className={styles.tableHeader}>
                    <Typography className={styles.tableTitle}>Matrix B</Typography>
                    <span className={styles.tableDimBadge}>{matrix2.length} × {matrix2[0]?.length}</span>
                  </div>
                  <div className={styles.tableInner}>
                    <MatrixTable rows={matrix2.length} columns={matrix2[0].length} matrix={matrix2} onCellChange={() => {}} />
                  </div>
                </Paper>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⊞</div>
              <div className={styles.emptyTitle}>No matrices yet</div>
              <div className={styles.emptyDesc}>
                Set the dimensions above and click{' '}
                <strong style={{ color: 'rgba(167,139,250,0.8)' }}>Generate</strong>{' '}
                to create your matrices.
              </div>
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && (
            <div className={styles.loadingWrapper}>
              <CircularProgress size={36} className={styles.loadingIndicator} />
              <span className={styles.loadingText}>Computing…</span>
            </div>
          )}

          {/* ── RESULT ── */}
          {!loading && result && (
            <Box>
              {/* Scalar result (det / trace) */}
              {isScalarResult && scalarValue !== null && scalarValue !== undefined ? (
                <div className={styles.scalarResultCard}>
                  <div className={styles.scalarResultLabel}>{scalarLabel}</div>
                  <div className={styles.scalarResultValue}>{scalarValue}</div>
                  <div className={styles.scalarResultSub}>{scalarFormula}</div>
                  {extra?.isDeterminant && extra.trace !== undefined && (
                    <div style={{ marginTop: '1rem' }}>
                      <span className={styles.traceBadge}>tr(A) = {extra.trace}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Matrix result */
                <div className={styles.resultCard}>
                  <div className={styles.resultHeader}>
                    <Typography className={styles.resultTitle}>Result Matrix</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.tableDimBadge}>{result.length} × {result[0]?.length}</span>
                      {extra?.trace !== undefined && (
                        <span className={styles.traceBadge}>tr = {extra.trace}</span>
                      )}
                      <button
                        id="btn-copy-result"
                        className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                        onClick={handleCopy}
                      >
                        {copied ? '✓ Copied' : '⎘ Copy'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.tableInner}>
                    <MatrixTable rows={result.length} columns={result[0].length} matrix={result} onCellChange={() => {}} />
                  </div>
                </div>
              )}
            </Box>
          )}

          {/* ── ERROR ── */}
          {error && (
            <div className={styles.errorToast}>
              <span className={styles.errorIcon}>⚠</span>
              <span className={styles.errorText}>{error}</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Matrix;