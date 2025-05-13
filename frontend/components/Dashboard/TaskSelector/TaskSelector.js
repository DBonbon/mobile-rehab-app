// components/Dashboard/TaskSelector/TaskSelector.js
import React, { useState } from 'react';
import styles from './TaskSelector.module.css';

const TaskSelector = ({ availableTasks, onTaskSelect }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  
  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleChange = (e) => {
    setSelectedTaskId(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedTaskId) {
      onTaskSelect(parseInt(selectedTaskId, 10));
      setSelectedTaskId('');
    }
  };

  // Get selected task details
  const selectedTask = availableTasks.find(task => task.id.toString() === selectedTaskId);

  return (
    <div className={styles.selectorContainer}>
      <h3 className={styles.dashboardSectionHeader}>Select a Task</h3>
     
      {availableTasks.length === 0 ? (
        <p className={styles.emptyState}>No tasks available at the moment.</p>
      ) : (
        <>
          <div className={styles.selectorControls}>
            <select
              value={selectedTaskId}
              onChange={handleChange}
              className={styles.taskDropdown}
            >
              <option value="">Choose a task...</option>
              {availableTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} {task.battleDate ? `(${formatDate(task.battleDate)})` : ''} 
                  {task.estTime ? ` - דק${task.estTime}` : ''}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleSubmit}
              disabled={!selectedTaskId}
              className={styles.selectButton}
            >
              Select Task
            </button>
          </div>

          {/* Show selected task details */}
          {selectedTask && (
            <div className={styles.selectedTaskDetails}>
              <div className={styles.taskHeader}>
                <h4>{selectedTask.title}</h4>
                <span className={`${styles.difficulty} ${styles[selectedTask.difficulty]}`}>
                  {selectedTask.difficulty}
                </span>
              </div>
              
              <div className={styles.taskInfo}>
                <div className={styles.taskDetail}>
                  <span className={styles.label}>Points:</span>
                  <span className={styles.value}>{selectedTask.points}</span>
                </div>
                
                {selectedTask.estTime && (
                  <div className={styles.taskDetail}>
                    <span className={styles.label}>Est. Time:</span>
                    <span className={styles.value}>~{selectedTask.estTime} min</span>
                  </div>
                )}
                
                {selectedTask.battleTitle && (
                  <div className={styles.taskDetail}>
                    <span className={styles.label}>Battle:</span>
                    <span className={styles.value}>{selectedTask.battleTitle}</span>
                  </div>
                )}
                
                {selectedTask.battleDate && (
                  <div className={styles.taskDetail}>
                    <span className={styles.label}>Date:</span>
                    <span className={styles.value}>{formatDate(selectedTask.battleDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskSelector;