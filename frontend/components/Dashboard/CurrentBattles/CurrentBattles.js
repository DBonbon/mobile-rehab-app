// components/Dashboard/CurrentBattles/CurrentBattles.js
import React from 'react';
import { FiClock } from 'react-icons/fi';
import styles from './CurrentBattles.module.css';

const CurrentBattles = ({ battles = [] }) => {
  if (!battles || battles.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No active battles found.</p>
      </div>
    );
  }

  return (
    <div className={styles.currentBattlesContainer}>
      <ul className={styles.battleList}>
        {battles.map(battle => (
          <li key={battle.id} className={styles.battleItem}>
            <div className={styles.battleInfo}>
              <h3 className={styles.battleTitle}>{battle.title}</h3>
              <div className={styles.battleProgress}>
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${(battle.completedTasks / battle.totalTasks) * 100}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {battle.completedTasks}/{battle.totalTasks} tasks
                </span>
              </div>
            </div>
            <div className={styles.battleActions}>
              <a 
                href={`/battle/${battle.id}`} 
                className={styles.viewButton}
              >
                <FiClock />
                <span>In Progress</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentBattles;