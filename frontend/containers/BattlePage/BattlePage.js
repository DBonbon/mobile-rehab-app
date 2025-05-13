// components/Battle/BattlePage.js
import { useState, useEffect } from 'react';
import { FiHome, FiPlus, FiCheck } from 'react-icons/fi';
import LandscapeBase from '../../components/battle/landscapes/LandscapeBase';
import styles from './BattlePage.module.css';
import Dashboard from '../../components/Dashboard/Dashboard';
import Header from '../../components/header/header';

const BattlePage = ({
  id,
  title,
  description,
  pointValue,
  recommended_frequency,
  terrain = 'desert',
  bg_color = '#ffffff',
  bg_color2 = '#87CEEB',
  path_type = 'curved',
  taskInstances = []
}) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  // Add these missing state and functions for the Dashboard
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
  const openDashboard = () => {
    setIsDashboardOpen(true);
  };
  
  const closeDashboard = () => {
    setIsDashboardOpen(false);
  };
  
  // Rest of your component remains the same...
  
  // Calculate total points from tasks
  useEffect(() => {
    const sum = taskInstances.reduce(
      (sum, entry) => sum + (Number(entry.task?.pointValue) || 0),
      0
    );
    setTotalPoints(sum);
  }, [taskInstances]);
  
  // Sanitize HTML (in a real app, use a proper sanitizer)
  const createMarkup = (html) => {
    return { __html: html };
  };
  
  // Calculate task positions based on point values
  const calculateTaskPositions = (tasks, total) => {
    let currentPosition = 0;
    return tasks.map(taskInstance => {
      const pointValue = Number(taskInstance.task?.pointValue) || 0;
      const position = currentPosition;
      // Update for next task
      currentPosition += pointValue / total;
      
      return {
        ...taskInstance,
        // Position as percentage of the path (0 to 1)
        position,
        // Normalized weight for sizing elements
        weight: pointValue / total
      };
    });
  };
  
  // Calculate completion percentage
  const completionPercentage = taskInstances.length > 0 ?
    (taskInstances.filter(t => t.status === 'completed').length / taskInstances.length) * 100 : 0;
  
  const positionedTasks = calculateTaskPositions(taskInstances, totalPoints);
  
  // Handle task selection
  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };
  
  // Mock task assignment (would connect to API in real app)
  const handleAssignTask = async (taskInstanceId) => {
    console.log(`Assigning task: ${taskInstanceId}`);
    // API call would go here
  };
  
  // Mock task completion (would connect to API in real app)
  const handleCompleteTask = async (taskInstanceId) => {
    console.log(`Completing task: ${taskInstanceId}`);
    // API call would go here
  };

  return (
    <div className={styles.battlePage}>
      {/* Header */}
      <Header 
        onDashboardOpen={openDashboard} 
        showHomeButton={true}
        pageTitle={title}
      />
      
      {/* Page title now outside the header */}
      {title && (
        <div className={styles.pageTitle}>
          <h2>{title}</h2>
        </div>
      )}

      {/* Battle Description (if provided) */}
      {description && (
        <div className={styles.description}>
          <h6 dangerouslySetInnerHTML={createMarkup(description)} />
        </div>
      )}

      {/* Landscape Visualization (Main Feature) */}
      <div className={styles.landscapeContainer}>
        <LandscapeBase 
          terrain={terrain}
          bgColor={bg_color}
          bgColor2={bg_color2}
          pathType={path_type}
          taskInstances={positionedTasks}
          selectedTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
        />
      </div>

      {/* Battle Tasks */}
      <div className={styles.tasksSection}>
        <h3>Battle Tasks</h3>
        
        <div className={styles.taskList}>
          {taskInstances.map(taskInstance => {
            const isSelected = taskInstance.task?.id === selectedTaskId;
            // Mock task status for development (in real app, would come from API)
            const taskStatus = taskInstance.status || 'not_started';
            const isAssigned = taskInstance.isAssigned || false;
            
            return (
              <div 
                key={taskInstance.id} 
                className={`${styles.taskItem} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleTaskSelect(taskInstance.task?.id)}
              >
                <div className={styles.taskHeader}>
                  <h3>{taskInstance.task?.title}</h3>
                  <div className={styles.taskMeta}>
                    <span className={`${styles.difficulty} ${styles[`difficulty${taskInstance.task?.difficulty?.charAt(0).toUpperCase() + taskInstance.task?.difficulty?.slice(1)}`]}`}>
                      {taskInstance.task?.difficulty}
                    </span>
                    <span className={styles.points}>
                      {taskInstance.task?.pointValue} {taskInstance.task?.pointValue === 1 ? 'pt' : 'pts'}
                    </span>
                    {taskInstance.task?.estTime && (
                      <span className={styles.estTime}>~{taskInstance.task.estTime} min</span>
                    )}
                  </div>
                </div>
                
                {taskInstance.task?.description && (
                  <p className={styles.taskDescription}>{taskInstance.task.description}</p>
                )}
                
                <div className={styles.taskActions}>
                  {taskStatus === 'not_started' && !isAssigned && (
                    <button 
                      className={`${styles.taskButton} ${styles.assignButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignTask(taskInstance.id);
                      }}
                    >
                      Accept Task
                    </button>
                  )}
                  
                  {taskStatus === 'in_progress' && isAssigned && (
                    <button 
                      className={`${styles.taskButton} ${styles.completeButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(taskInstance.id);
                      }}
                    >
                      <FiCheck /> Complete
                    </button>
                  )}
                  
                  {taskStatus === 'completed' && (
                    <span className={styles.completionStatus}>
                      <FiCheck /> Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Battle Info */}
      <div className={styles.battleInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Total Points:</span> 
          <span className={styles.value}>{totalPoints}</span>
        </div>
        {recommended_frequency > 0 && (
          <div className={styles.infoItem}>
            <span className={styles.label}>Recommended:</span> 
            <span className={styles.value}>{recommended_frequency}/week</span>
          </div>
        )}
      </div>
      
      {/* Dashboard Modal - moved outside battleInfo */}
      <Dashboard 
        isOpen={isDashboardOpen} 
        onClose={closeDashboard}
      />
    </div>
  );
};

export default BattlePage;