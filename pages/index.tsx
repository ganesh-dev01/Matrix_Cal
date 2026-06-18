import * as React from 'react';
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import MatrixCalculator from '@/components/MatrixCalculator';

const FEATURES = [
  {
    icon: '⊗',
    title: 'O(n³) Matrix Multiplication',
    desc: 'Sparse-optimized A×B via the standard algorithm with early-zero skipping. Runs in a dedicated Web Worker thread — the UI never blocks.',
  },
  {
    icon: '∂',
    title: 'Gaussian Elimination det(A)',
    desc: 'Computes det(A) using LU decomposition with partial pivoting in O(n³). Handles singular matrices gracefully and returns tr(A) alongside.',
  },
  {
    icon: 'Aᵀ',
    title: 'Transposition & Trace',
    desc: 'Single-pass O(n·m) transpose flips rows ↔ columns instantly. Trace tr(A) = Σᵢ aᵢᵢ is auto-computed and displayed on every square result.',
  },
  {
    icon: 'kA',
    title: 'Scalar & Power Operations',
    desc: 'Scale any matrix with k·A (float precision). Raise any square matrix to integer powers Aⁿ using binary exponentiation in O(n³ log n).',
  },
  {
    icon: '⚙',
    title: 'Off-Thread Compute Engine',
    desc: 'All O(n³) operations — multiply, power, determinant — are dispatched to a Web Worker. The UI stays at 60 fps regardless of matrix size.',
  },
  {
    icon: '↔',
    title: 'Adaptive Scroll Intelligence',
    desc: 'ResizeObserver tracks each matrix card. Directional shadow overlays and scroll hints appear automatically when tables overflow — in any direction.',
  },
];


const App: React.FC = () => {
  return (
    <>
      <Head>
        <title>MatrixCalc — Premium Matrix Calculator</title>
      </Head>

      <main className={styles.main}>
        {/* Floating math symbols in background */}
        <div className={styles.mathBackground}>
          {['∑', '∏', '∂', '∇', '∫', 'λ', '√', 'Aᵀ', 'det(A)', 'f(x)', 'lim', 'log'].map((sym, i) => (
            <span key={i} className={styles.mathDecor} aria-hidden="true">{sym}</span>
          ))}
        </div>

        {/* ===== HEADER LOGO ===== */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>∑</div>
            <span className={styles.logoText}>
              Matrix<span className={styles.logoAccent}>Calc</span>
            </span>
          </div>
        </header>

        {/* ===== CALCULATOR ===== */}
        <section id="calculator" className={styles.calculatorSection}>
          <MatrixCalculator />
        </section>

        {/* ===== FEATURES ===== */}
        <section className={styles.features} id="features">
          <div className={styles.sectionTag}>
            <span className={styles.sectionTagLine} />
            <span className={styles.sectionTagText}>Features</span>
            <span className={`${styles.sectionTagLine} ${styles.right}`} />
          </div>

          <h2 className={styles.featuresHeading}>
            Everything you need
          </h2>
          <p className={styles.featuresSubtext}>
            A complete matrix calculator packed into a lightweight, beautiful web app.
          </p>

          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureBox}>
                <div className={styles.featureIconWrap}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default App;