// components/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { FiX, FiCheck, FiClock } from 'react-icons/fi';
import { getDashboardData, assignTask, completeTask } from '../../api/dashboardApi';
import styles from './Dashboard.module.css';

// Import sub-components
import UserSection from './UserSection/UserSection';
import TaskSelector from './TaskSelector/TaskSelector';
import MyTasks from './MyTasks/MyTasks';
import Achievements from './Achievements/Achievements';
import CurrentBattles from './CurrentBattles/CurrentBattles';
import AssistedBattles from './AssistedBattles/AssistedBattles';

const Dashboard = ({
  isOpen, 
  onClose,
  // Original props
  taskAvailable = [],
  userTasks = [],
  achievements = [],
  progress = [],
  userProfile = {},
  supportMessages = [],
  battles = [], // New prop to pass battle data
  ...otherProps
}) => {
  console.log('🔔 Dashboard component render started');
 
  // State for tabbed interface
  const [activeTab, setActiveTab] = useState('current'); // 'current', 'past', 'achievements', 'currentBattles', 'assistedBattles'
  
  // State to hold all dashboard data
  const [dashboardData, setDashboardData] = useState({
    taskAvailable: [],
    userTasks: [],
    achievements: [],
    progress: {},
    userProfile: {},
    supportMessages: [],
    battles: []
  });
  const [isLoading, setIsLoading] = useState(true);
 
  // Fetch all dashboard data directly
  useEffect(() => {
    async function fetchDashboardData() {
      if (!isOpen) return; // Only fetch when modal is open
      
      try {
        console.log('🔄 Dashboard directly fetching all data');
        setIsLoading(true);
        const data = await getDashboardData();
        console.log('✅ Dashboard data fetched:', {
          tasks: data.taskAvailable?.length || 0,
          userTasks: data.userTasks?.length || 0,
          achievements: data.achievements?.length || 0,
          progress: data.progress?.length || 0,
          hasProfile: Boolean(data.userProfile),
          messages: data.supportMessages?.length || 0
        });
        setDashboardData(data);
      } catch (error) {
        console.error('❌ Dashboard data fetch error:', error);
        // Keep default empty values
      } finally {
        setIsLoading(false);
      }
    }
   
    fetchDashboardData();
  }, [isOpen]);
 
  // Merge props and fetched data, preferring fetched data if available
  const finalData = {
    taskAvailable: dashboardData.taskAvailable?.length > 0 ? dashboardData.taskAvailable : taskAvailable,
    userTasks: dashboardData.userTasks?.length > 0 ? dashboardData.userTasks : userTasks,
    achievements: dashboardData.achievements?.length > 0 ? dashboardData.achievements : achievements,
    progress: dashboardData.progress?.length > 0 ? dashboardData.progress : progress,
    userProfile: Object.keys(dashboardData.userProfile || {}).length > 0 ? dashboardData.userProfile : userProfile,
    supportMessages: dashboardData.supportMessages?.length > 0 ? dashboardData.supportMessages : supportMessages,
    battles: dashboardData.battles?.length > 0 ? dashboardData.battles : battles
  };

  // Format tasks for components
  const formatTasks = (tasks = []) => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title || task.taskTitle || task.task_title || 'Untitled',
      points: task.taskPointValue || task.task_point_value || 0,
      difficulty: task.taskDifficulty || task.task_difficulty || 'medium',
      completed: task.status === 'completed',
      battleId: task.battleId || task.battle_id,
      battleTitle: task.battleTitle || task.battle_title,
      estTime: task.taskEstTime || task.task_est_time,
      battleDate: task.battleDate || task.battle_date,
      description: task.taskDescription || task.task_description    }));
  };

  // Get current tasks (not completed)
  const getCurrentTasks = () => {
    return formatTasks(finalData.userTasks.filter(task => task.status !== 'completed'));
  };

  // Get past tasks (completed)
  const getPastTasks = () => {
    return formatTasks(finalData.userTasks.filter(task => task.status === 'completed'));
  };

  // Get current battles (where user has at least one assigned task)
  const getCurrentBattles = () => {
    // Group tasks by battle ID
    const battleTaskMap = {};
    
    finalData.userTasks.forEach(task => {
      const battleId = task.battleId || task.battle_id;
      if (!battleId) return;
      
      if (!battleTaskMap[battleId]) {
        battleTaskMap[battleId] = [];
      }
      battleTaskMap[battleId].push(task);
    });
    
    // Filter for battles with at least one assigned task
    return Object.entries(battleTaskMap)
      .filter(([_, tasks]) => tasks.some(task => task.status === 'assigned' || task.status === 'in_progress'))
      .map(([battleId, tasks]) => {
        // Find battle details
        const battle = finalData.battles.find(b => b.id === parseInt(battleId, 10));
        return {
          id: parseInt(battleId, 10),
          title: battle?.title || `Battle ${battleId}`,
          tasks: tasks,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          totalTasks: tasks.length
        };
      });
  };

  // Get assisted battles (all tasks completed and user had at least one task)
  const getAssistedBattles = () => {
    // Group tasks by battle ID
    const battleTaskMap = {};
    
    finalData.userTasks.forEach(task => {
      const battleId = task.battleId || task.battle_id;
      if (!battleId) return;
      
      if (!battleTaskMap[battleId]) {
        battleTaskMap[battleId] = [];
      }
      battleTaskMap[battleId].push(task);
    });
    
    // Filter for battles where all tasks are completed
    return Object.entries(battleTaskMap)
      .filter(([_, tasks]) => tasks.every(task => task.status === 'completed'))
      .map(([battleId, tasks]) => {
        // Find battle details
        const battle = finalData.battles.find(b => b.id === parseInt(battleId, 10));
        return {
          id: parseInt(battleId, 10),
          title: battle?.title || `Battle ${battleId}`,
          tasks: tasks,
          completedTasks: tasks.length, // All tasks are completed
          totalTasks: tasks.length
        };
      });
  };
 
  // Handle task selection
  const handleTaskSelect = async (taskId) => {
    try {
      console.log('Task selected (ID):', taskId);
      
      // Find the task in available tasks
      const taskToAssign = finalData.taskAvailable.find(t => t.id === taskId);
      if (!taskToAssign) {
        console.error('Could not find task with ID:', taskId);
        return;
      }
      
      // Call API to assign task
      const assignedTask = await assignTask(taskId);
      console.log('✅ Task assigned:', assignedTask);
      
      // Update local state
      setDashboardData(prev => ({
        ...prev,
        taskAvailable: prev.taskAvailable.filter(t => t.id !== taskId),
        userTasks: [...prev.userTasks, assignedTask]
      }));
    } catch (error) {
      console.error('Failed to assign task:', error);
    }
  };

  // Handle task completion
  const handleTaskComplete = async (taskId) => {
    try {
      console.log('Task completed (ID):', taskId);
      
      // Call API to complete task
      const completedTask = await completeTask(taskId);
      console.log('✅ Task completed:', completedTask);
      
      // Update local state
      setDashboardData(prev => ({
        ...prev,
        userTasks: prev.userTasks.map(task => 
          task.id === taskId ? { ...task, status: 'completed' } : task
        )
      }));
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  // Calculate progress percentage
  const progressPercentage = finalData.progress?.current && finalData.progress?.total
    ? (finalData.progress.current / finalData.progress.total) * 100
    : 0;

  // Don't render anything when modal is closed
  if (!isOpen) return null;

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.dashboardModal}>
        <div className={styles.dashboardOverlay} onClick={onClose}></div>
        <div className={styles.dashboardContent}>
          <div className={styles.dashboardLoading}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardModal}>
      <div className={styles.dashboardOverlay} onClick={onClose}></div>
      <div className={styles.dashboardContent}>
        {/* Header */}
        <header className={styles.dashboardHeader}>
          <h2>Dashboard</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </header>

        {/* User and Progress */}
        <section className={styles.userSection}>
          <UserSection userName={finalData.userProfile?.name || 'User'} />
          
          <div className={styles.progressSection}>
            <h5>Your Progress</h5>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className={styles.progressInfo}>
              <span>{finalData.progress?.current || 0} Points</span>
              <span>{getPastTasks().length} Tasks Completed</span>
            </div>
          </div>
        </section>

        {/* Task Selection */}
        <section className={styles.taskSelection}>
          <TaskSelector 
            availableTasks={formatTasks(finalData.taskAvailable)}
            onTaskSelect={handleTaskSelect}
          />
        </section>

        {/* Tabs */}
        <div className={styles.tabSelector}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'current' ? styles.active : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Tasks
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'currentBattles' ? styles.active : ''}`}
            onClick={() => setActiveTab('currentBattles')}
          >
            Current Battles
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'assistedBattles' ? styles.active : ''}`}
            onClick={() => setActiveTab('assistedBattles')}
          >
            Assisted
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'achievements' ? styles.active : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'current' && (
            <div className={styles.currentTasks}>
              <MyTasks 
                tasks={getCurrentTasks()} 
                onTaskComplete={handleTaskComplete}
              />
              {getCurrentTasks().length === 0 && (
                <div className={styles.emptyState}>
                  <p>No current tasks. Select a new task to begin!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'currentBattles' && (
            <div className={styles.currentBattles}>
              <CurrentBattles battles={getCurrentBattles()} />
              {getCurrentBattles().length === 0 && (
                <div className={styles.emptyState}>
                  <p>No current battles. Join a battle to see it here!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assistedBattles' && (
            <div className={styles.assistedBattles}>
              <AssistedBattles battles={getAssistedBattles()} />
              {getAssistedBattles().length === 0 && (
                <div className={styles.emptyState}>
                  <p>No completed battles yet. Keep working!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className={styles.achievementsTab}>
              <Achievements achievements={finalData.achievements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;