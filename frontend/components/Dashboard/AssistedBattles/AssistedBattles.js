// components/Dashboard/AssistedBattles/AssistedBattles.js
import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './AssistedBattles.module.css';

const AssistedBattles = ({ battles = [] }) => {
  if (!battles || battles.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No completed battles found.</p>
      </div>
    );
  }

  return (
    <div className={styles.assistedBattlesContainer}>
      <ul className={styles.battleList}>
        {battles.map(battle => (
          <li key={battle.id} className={styles.battleItem}>
            <div className={styles.battleInfo}>
              <h3 className={styles.battleTitle}>{battle.title}</h3>
              <div className={styles.taskCount}>
                <FiCheck className={styles.checkIcon} />
                <span className={styles.completedText}>
                  {battle.completedTasks} tasks completed
                </span>
              </div>
            </div>
            <div className={styles.battleActions}>
              <a 
                href={`/battle/${battle.id}`} 
                className={styles.viewButton}
              >
                View
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssistedBattles;