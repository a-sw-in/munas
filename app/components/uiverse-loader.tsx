/*
From Uiverse.io by JaydipPrajapati1910 - https://uiverse.io/JaydipPrajapati1910/stale-pug-89
MIT License, Copyright (c) JaydipPrajapati1910 (Jaydip Prajapati)
*/

import styles from "./uiverse-loader.module.css";

export default function UiverseLoader({
  color,
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <section
      className={`${styles.loaderContainer} ${className}`}
      style={color ? ({ "--loader-color": color } as React.CSSProperties) : undefined}
      aria-label="Loading..."
    >
      <div className={styles.branch}>
        <div className={styles.inner}>
          <span className={`${styles.one} ${styles.h6}`} />
          <span className={`${styles.two} ${styles.h3}`} />
        </div>
      </div>

      <div className={styles.branch}>
        <div className={styles.inner}>
          <span className={`${styles.one} ${styles.h1}`} />
          <span className={`${styles.two} ${styles.h4}`} />
        </div>
      </div>

      <div className={styles.branch}>
        <div className={styles.inner}>
          <span className={`${styles.one} ${styles.h5}`} />
          <span className={`${styles.two} ${styles.h2}`} />
        </div>
      </div>
    </section>
  );
}
