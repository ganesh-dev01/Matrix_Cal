import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "@/styles/MatrixTable.module.css";

interface ScrollState {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

interface MatrixTableProps {
  rows: number;
  columns: number;
  matrix: number[][];
  onCellChange: (row: number, col: number, value: number) => void;
}

const MatrixTable = ({ rows, columns, matrix }: MatrixTableProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<ScrollState>({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 4;
    setScroll({
      left:   el.scrollLeft > threshold,
      right:  el.scrollLeft < el.scrollWidth  - el.clientWidth  - threshold,
      top:    el.scrollTop  > threshold,
      bottom: el.scrollTop  < el.scrollHeight - el.clientHeight - threshold,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, matrix]);

  const canScrollH = scroll.left || scroll.right;
  const canScrollV = scroll.top || scroll.bottom;
  const showHint   = canScrollH || canScrollV;

  return (
    <div className={styles.wrapper}>
      {/* ── Shadow overlays (appear only when scrollable) ── */}
      {scroll.right  && <div className={styles.shadowRight}  aria-hidden="true" />}
      {scroll.left   && <div className={styles.shadowLeft}   aria-hidden="true" />}
      {scroll.bottom && <div className={styles.shadowBottom} aria-hidden="true" />}
      {scroll.top    && <div className={styles.shadowTop}    aria-hidden="true" />}

      {/* ── Scrollable table container ── */}
      <div ref={scrollRef} className={styles.scrollContainer}>
        <table className={styles.table}>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r} className={styles.tableRow}>
                {Array.from({ length: columns }, (_, c) => {
                  const val = matrix[r]?.[c] ?? 0;
                  return (
                    <td
                      key={c}
                      className={`${styles.cell} ${val === 0 ? styles.zero : ""}`}
                      title={`[${r}][${c}] = ${val}`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Scroll hint (shown only when table overflows) ── */}
      {showHint && (
        <div className={styles.scrollHint} aria-label="Scroll hint">
          {canScrollH && (
            <span className={styles.scrollHintItem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Scroll horizontally
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          )}
          {canScrollH && canScrollV && (
            <span className={styles.scrollHintItem} style={{ opacity: 0.18 }}>·</span>
          )}
          {canScrollV && (
            <span className={styles.scrollHintItem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              Scroll vertically
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MatrixTable;