/* ─────────────────────────────────────────────
   MatrixCalc Web Worker
   Operations: add | subtract | multiply |
               transpose | determinant | trace |
               scalar_multiply | power
   ───────────────────────────────────────────── */

/* ── Internal helpers ────────────────────────────────── */

function matMul(A, B) {
  const n = A.length, m = B[0].length, p = B.length;
  const C = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let k = 0; k < p; k++) {
      const temp = A[i][k];
      if (temp !== 0)
        for (let j = 0; j < m; j++)
          C[i][j] += temp * B[k][j];
    }
  return C;
}

/** Binary (fast) exponentiation — O(n³ log exp) */
function matPow(A, exp) {
  const size = A.length;
  // Start with identity matrix
  let result = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
  );
  let base = A.map(row => [...row]);
  while (exp > 0) {
    if (exp & 1) result = matMul(result, base);
    base = matMul(base, base);
    exp >>= 1;
  }
  return result;
}

/** Gaussian elimination with partial pivoting — O(n³) */
function determinant(matrix) {
  const n = matrix.length;
  const mat = matrix.map(row => [...row]);
  let sign = 1;
  for (let i = 0; i < n; i++) {
    // Partial pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) maxRow = k;
    }
    if (maxRow !== i) {
      [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
      sign *= -1;
    }
    if (Math.abs(mat[i][i]) < 1e-12) return 0;
    for (let k = i + 1; k < n; k++) {
      const factor = mat[k][i] / mat[i][i];
      for (let j = i; j < n; j++) mat[k][j] -= factor * mat[i][j];
    }
  }
  let det = sign;
  for (let i = 0; i < n; i++) det *= mat[i][i];
  return Math.round(det * 1e9) / 1e9;
}

/** tr(A) = Σ aᵢᵢ */
function trace(matrix) {
  const n = Math.min(matrix.length, matrix[0].length);
  let tr = 0;
  for (let i = 0; i < n; i++) tr += matrix[i][i];
  return tr;
}

function round9(v) { return Math.round(v * 1e9) / 1e9; }

/* ── Message handler ─────────────────────────────────── */
onmessage = function (e) {
  const { matrix1, matrix2, operation, scalar, power } = e.data;

  try {
    const rows1 = matrix1.length;
    const cols1 = matrix1[0].length;

    /* ── Single-matrix operations ── */

    if (operation === 'transpose') {
      const result = Array.from({ length: cols1 }, (_, j) =>
        Array.from({ length: rows1 }, (_, i) => matrix1[i][j])
      );
      postMessage({ result, extra: null });
      return;
    }

    if (operation === 'determinant') {
      if (rows1 !== cols1) {
        postMessage({ error: 'Determinant requires a square matrix (n × n).' });
        return;
      }
      const det = determinant(matrix1);
      const tr  = trace(matrix1);
      postMessage({ result: [[det]], extra: { isDeterminant: true, det, trace: tr } });
      return;
    }

    if (operation === 'trace') {
      if (rows1 !== cols1) {
        postMessage({ error: 'Trace requires a square matrix (n × n).' });
        return;
      }
      const tr = trace(matrix1);
      postMessage({ result: [[tr]], extra: { isTrace: true, trace: tr } });
      return;
    }

    if (operation === 'scalar_multiply') {
      const k = scalar !== undefined ? Number(scalar) : 1;
      const result = matrix1.map(row => row.map(v => round9(v * k)));
      postMessage({ result, extra: null });
      return;
    }

    if (operation === 'power') {
      if (rows1 !== cols1) {
        postMessage({ error: 'Matrix exponentiation requires a square matrix (n × n).' });
        return;
      }
      const n = power !== undefined ? Math.max(0, Math.floor(Number(power))) : 2;
      const result = matPow(matrix1, n);
      // Include trace of result
      const tr = trace(result);
      postMessage({ result, extra: { trace: tr } });
      return;
    }

    /* ── Two-matrix operations ── */

    const rows2 = matrix2.length;
    const cols2 = matrix2[0].length;

    if (operation === 'multiply' && cols1 !== rows2) {
      postMessage({ error: `Multiplication not possible: A is ${rows1}×${cols1} but B is ${rows2}×${cols2}. Columns of A must equal rows of B.` });
      return;
    }

    if ((operation === 'add' || operation === 'subtract') && (rows1 !== rows2 || cols1 !== cols2)) {
      postMessage({ error: `Matrices must be the same size for ${operation}. A is ${rows1}×${cols1} but B is ${rows2}×${cols2}.` });
      return;
    }

    let result;
    if (operation === 'multiply') {
      result = matMul(matrix1, matrix2);
    } else {
      result = Array.from({ length: rows1 }, (_, i) =>
        Array.from({ length: cols1 }, (_, j) => {
          const v1 = matrix1[i][j] || 0;
          const v2 = matrix2[i][j] || 0;
          return operation === 'add' ? v1 + v2 : v1 - v2;
        })
      );
    }

    // Attach trace of result if square
    const extra = (result.length === result[0].length)
      ? { trace: trace(result) }
      : null;

    postMessage({ result, extra });

  } catch (err) {
    postMessage({ error: 'An unexpected error occurred during computation.' });
  }
};