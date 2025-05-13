// Updated Achievements.js
import React from 'react';
import { FiAward } from 'react-icons/fi';
import styles from './Achievements.module.css';

const Achievements = ({ achievements = [] }) => {
  if (!achievements || achievements.length === 0) {
    return (
      <div className={styles.achievementsSection}>
        <h3 className={styles.sectionHeader}>Achievements</h3>
        <div className={styles.emptyState}>
          <FiAward size={32} opacity={0.4} />
          <p>No achievements yet. Complete tasks to earn achievements!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.achievementsSection}>
      <h3 className={styles.sectionHeader}>Achievements</h3>
      <ul className={styles.achievementList}>
        {achievements.map(ach => (
          <li key={ach.id} className={styles.achievementItem}>
            <span className={styles.icon}>{ach.icon || '🏆'}</span>
            <div className={styles.details}>
              <strong>{ach.title}</strong>
              <p>{ach.description}</p>
              <small>Earned at {ach.point_threshold} pts</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Achievements;