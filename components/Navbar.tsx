import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Calculator', path: '/matrix' },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navInner}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => router.push('/')}>
            <div className={styles.logoIcon}>∑</div>
            <span className={styles.logoText}>
              Matrix<span className={styles.logoAccent}>Calc</span>
            </span>
          </div>

          {/* Desktop links */}
          <ul className={styles.navLinks}>
            {navItems.map((item) => (
              <li
                key={item.path}
                className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <button
            className={styles.navCta}
            onClick={() => router.push('/matrix')}
          >
            Launch Calculator
          </button>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavLinks}>
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`${styles.mobileNavLink} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div className={styles.mobileCtaWrap}>
          <button
            className={styles.mobileCtaBtn}
            onClick={() => router.push('/matrix')}
          >
            Launch Calculator
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
