onmessage = function (e) {
  const { matrix1, matrix2, operation } = e.data;

  const rows1 = matrix1.length;
  const cols1 = matrix1[0].length;
  const rows2 = matrix2.length;
  const cols2 = matrix2[0].length;

  if (operation === 'multiply' && cols1 !== rows2) {
    postMessage({ error: "Matrix multiplication is not possible. Number of columns in Matrix 1 must equal number of rows in Matrix 2." });
    return;
  }

  if (operation === 'add' || operation === 'subtract') {
    if (rows1 !== rows2 || cols1 !== cols2) {
      postMessage({ error: "Matrices must have the same dimensions for addition or subtraction." });
      return;
    }
  }

  const resultMatrix = Array.from({ length: rows1 }, () => Array(cols2).fill(0));

  if (operation === 'multiply') {
    for (let i = 0; i < rows1; i++) {
      for (let k = 0; k < cols1; k++) {
        const temp = matrix1[i][k];
        if (temp !== 0) {
          for (let j = 0; j < cols2; j++) {
            resultMatrix[i][j] += temp * matrix2[k][j];
          }
        }
      }
    }
  } else {
    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols1; j++) {
        const val1 = matrix1[i][j] || 0;
        const val2 = matrix2[i][j] || 0;

        switch (operation) {
          case 'add':
            resultMatrix[i][j] = val1 + val2;
            break;
          case 'subtract':
            resultMatrix[i][j] = val1 - val2;
            break;
          default:
            postMessage({ error: `Unsupported operation: ${operation}` });
            return;
        }
      }
    }
  }

  postMessage(resultMatrix); 
};