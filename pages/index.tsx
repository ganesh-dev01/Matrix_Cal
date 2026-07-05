import { useState, useEffect } from 'react';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

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

          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className={styles.themeToggleSvg} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
            ) : (
              <svg className={styles.themeToggleSvg} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.5-.1 1 .2 1.2.7.2.5.1 1.1-.3 1.4-3.4 2.5-4 7.3-1.5 10.5 2.1 2.7 5.6 3.7 8.8 2.4.5-.2 1.1 0 1.3.5.2.5 0 1.1-.5 1.3-2.9 1.9-6.2 2-7.1 2z"/>
              </svg>
            )}
          </button>
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