"use client";

import { useEffect, useState } from "react";
import styles from "./IntroLines.module.css";

// Module state lives for the whole page load, so the drawing plays once even if the intro remounts.
let hasPlayed = false;

const CORNER = 18;

export default function IntroLines() {
  const [animate] = useState(() => !hasPlayed);

  useEffect(() => {
    hasPlayed = true;
  }, []);

  return (
    <svg className={animate ? `${styles.lines} animate` : styles.lines} aria-hidden="true" focusable="false">
      {/* Frame rules, top and bottom */}
      <line className={styles.d1} x1="0" y1="1" x2="100%" y2="1" pathLength={1} />
      <line className={styles.d3} x1="100%" y1="99.8%" x2="0" y2="99.8%" pathLength={1} />
      {/* Height dimension along the left edge, with end ticks */}
      <g className={styles.d2}>
        <line x1="12" y1="8%" x2="12" y2="92%" pathLength={1} />
        <line x1="6" y1="8%" x2="18" y2="8%" pathLength={1} />
        <line x1="6" y1="92%" x2="18" y2="92%" pathLength={1} />
      </g>
      {/* Crop marks at the four corners */}
      <g className={styles.d4}>
        <svg x="0" y="0" overflow="visible">
          <polyline points={`0,${CORNER + 8} 0,8 ${CORNER},8`} pathLength={1} />
        </svg>
        <svg x="100%" y="0" overflow="visible">
          <polyline points={`${-CORNER},8 0,8 0,${CORNER + 8}`} pathLength={1} />
        </svg>
        <svg x="0" y="100%" overflow="visible">
          <polyline points={`0,${-CORNER - 8} 0,-8 ${CORNER},-8`} pathLength={1} />
        </svg>
        <svg x="100%" y="100%" overflow="visible">
          <polyline points={`${-CORNER},-8 0,-8 0,${-CORNER - 8}`} pathLength={1} />
        </svg>
      </g>
    </svg>
  );
}
