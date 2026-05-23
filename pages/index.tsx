import * as React from 'react';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import Head from 'next/head';

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


const STATS = [
  { number: '8', label: 'Operations' },
  { number: '∞', label: 'Matrix Sizes' },
  { number: '0ms', label: 'UI Block' },
];

const App: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>MatrixCalc — Matrix Calculator</title>
      </Head>

      <main className={styles.main}>
        {/* ===== HERO ===== */}
        <section className={styles.hero}>
          {/* Floating math decorations */}
          {['∑', '∏', '∂', '∇', '∫'].map((sym, i) => (
            <span key={i} className={styles.mathDecor} aria-hidden="true">{sym}</span>
          ))}

          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Powered by Web Workers
          </div>

          <h1 className={styles.heading}>
            Matrix Operations
            <span className={styles.headingGradient}>Made Beautiful</span>
          </h1>

          <p className={styles.subheading}>
            Generate matrices, perform addition, subtraction, and multiplication —
            all with a stunning interface designed for clarity and speed.
          </p>

          <div className={styles.ctaGroup}>
            <button
              className={styles.trybtn}
              onClick={() => router.push('/matrix')}
              id="hero-try-btn"
            >
              <span className={styles.trybtnInner}>
                Try the Calculator
                <span className={styles.tryArrow}>→</span>
              </span>
            </button>
            <button
              className={styles.ghostBtn}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              id="hero-learn-btn"
            >
              Learn More
            </button>
          </div>

          {/* Scroll hint */}
          <div className={styles.scrollHint} aria-hidden="true">
            <div className={styles.scrollMouse}>
              <div className={styles.scrollWheel} />
            </div>
            <span>Scroll</span>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <div className={styles.statsStrip}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statNumber}>{s.number}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

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

        {/* ===== CTA BOTTOM ===== */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaCardHeading}>Ready to compute?</h2>
            <p className={styles.ctaCardSub}>
              Jump into the calculator and start working with matrices right away.
            </p>
            <button
              className={styles.trybtn}
              onClick={() => router.push('/matrix')}
              id="cta-bottom-btn"
            >
              <span className={styles.trybtnInner}>
                Open Calculator
                <span className={styles.tryArrow}>→</span>
              </span>
            </button>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className={styles.footer}>
          © {new Date().getFullYear()} MatrixCalc · Built with Next.js
        </footer>
      </main>
    </>
  );
};

export default App;