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
    </div>
  );
};

export default MatrixTable;
