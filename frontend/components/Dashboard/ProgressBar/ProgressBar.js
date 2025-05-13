// ProgressBar.js
import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(100, Math.round((current / total) * 100)) || 0;
  
  // Determine color based on progress percentage
  const getColorClass = () => {
    if (percentage < 30) return styles.lowProgress;
    if (percentage < 70) return styles.midProgress;
    return styles.highProgress;
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInfo}>
        <span>{current} / {total} points</span>
        <span>{percentage}%</span>
      </div>
      
      <div className={styles.progressBarOuter}>
        <div 
          className={`${styles.progressBarInner} ${getColorClass()}`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
};

export default ProgressBar;