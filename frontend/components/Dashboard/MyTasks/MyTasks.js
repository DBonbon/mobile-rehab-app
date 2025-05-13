// components/Dashboard/MyTasks/MyTasks.js
import React from 'react';
import styles from './MyTasks.module.css';

const MyTasks = ({ tasks, onTaskComplete }) => {
  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.myTasksContainer}>
      <h3>My Tasks</h3>
     
      {tasks.length === 0 ? (
        <p className={styles.emptyState}>No tasks assigned yet.</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map(task => (
            <li key={task.id} className={styles.taskItem}>
              <div className={styles.taskInfo}>
                <span className={styles.title}>{task.title || 'Untitled'}</span>
                <div className={styles.taskDetails}>
                  <span className={styles.points}>{task.points || 0} pts</span>
                  {task.estTime && (
                    <span className={styles.estTime}>~{task.estTime} min</span>
                  )}
                  {task.battleDate && (
                    <span className={styles.date}>{formatDate(task.battleDate)}</span>
                  )}
                </div>
                {task.battleTitle && (
                  <span className={styles.battleTitle}>
                    Battle: {task.battleTitle}
                  </span>
                )}
              </div>
             
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onTaskComplete(task.id)}
                  className={styles.checkbox}
                  disabled={task.completed}
                />
                {task.completed ? 'Completed' : 'Complete'}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTasks;