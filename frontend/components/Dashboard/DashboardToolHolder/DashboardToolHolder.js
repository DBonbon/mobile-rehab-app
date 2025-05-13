// Modified DashboardToolHolder.js component
import React, { useState, useEffect } from 'react';
import styles from './DashboardToolHolder.module.css';
import UserSection from '../UserSection';
import ProgressBar from '../ProgressBar';
import TaskSelector from '../TaskSelector';
import MyTasks from '../MyTasks';
import Achievements from '../Achievements';
import { assignTask, completeTask } from '../../../api/dashboardApi';

// Update prop names to match API response structure
const DashboardToolHolder = ({ 
  battleTasks = [], // taskAvailable from API
  myTasks: initialMyTasks = [], // userTasks from API
  userProfile = {}, // userProfile from API
  achievements = [], // achievements from API
  progress = {} // progress from API
}) => {
  console.log('DashboardToolHolder received:', { 
    battleTasks: battleTasks?.length,
    initialMyTasks: initialMyTasks?.length,
    userProfile,
    achievements: achievements?.length,
    progress
  });
  
  const [myTasks, setMyTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [userData, setUserData] = useState({
    name: 'User',
    totalPoints: 0,
    maxPossiblePoints: 100,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('unknown');

  // Initialize with data from API
  useEffect(() => {
    try {
      setLoading(true);
      
      // If we have real data from the API
      if ((battleTasks && battleTasks.length > 0) || (initialMyTasks && initialMyTasks.length > 0)) {
        console.log('Setting up with real API data');
        setDataSource('api-data');
        
        // Format the available tasks
        const formattedAvailableTasks = battleTasks.map(instance => ({
          id: instance.id,
          title: instance.taskTitle || 'Untitled',
          description: instance.taskDescription || '',
          points: instance.taskPointValue || 0,  // Will always be 0 unless you change the serializer
          difficulty: instance.taskDifficulty || 'medium'  // Same here if not provided by backend
        }));        
              
        // Format the user's tasks
        const formattedMyTasks = initialMyTasks.map(task => ({
          id: task.id,
          title: task.taskTitle || 'Untitled',
          description: task.taskDescription || '',
          points: task.taskPointValue || 0,
          difficulty: task.taskDifficulty || 'medium',
          completed: task.status === 'completed'
        }));                
        
        console.log('Formatted available tasks:', formattedAvailableTasks);
        console.log('Formatted my tasks:', formattedMyTasks);
        
        setAvailableTasks(formattedAvailableTasks);
        setMyTasks(formattedMyTasks);
        
        // Set user data from profile
        const totalPoints = userProfile?.totalPoints || 0;
        const completedTasks = formattedMyTasks.filter(task => task.completed).length;
        
        // Calculate max possible points
        const maxPossiblePoints = [...formattedAvailableTasks, ...formattedMyTasks]
          .reduce((sum, task) => sum + task.points, 0);
        
        setUserData({
          name: userProfile?.name || userProfile?.username || 'User',
          totalPoints,
          maxPossiblePoints,
          completedTasks
        });
      } else {
        // Fallback to mock data (same as in your original component)
        console.log('No API data, using mock data');
        setDataSource('mock-data');
        
        // Your existing mock data setup...
        const mockAvailableTasks = [
          { id: 101, title: 'Mock Task 1', points: 10, difficulty: 'easy' },
          { id: 102, title: 'Mock Task 2', points: 20, difficulty: 'medium' }
        ];
      
      const mockMyTasks = [
        { id: 103, title: 'Mock Assigned Task', points: 15, difficulty: 'medium', completed: false },
        { id: 104, title: 'Mock Completed Task', points: 25, difficulty: 'hard', completed: true }
      ];
      
      setAvailableTasks(mockAvailableTasks);
      setMyTasks(mockMyTasks);
      setUserData({
        name: 'Mock User',
        totalPoints: 25,
        maxPossiblePoints: 70,
        completedTasks: 1
      });
      }

      setLoading(false);
      } catch (error) {
        console.error('Error processing API data:', error);
        setError('Error setting up dashboard');
        setLoading(false);
      }
  }, [battleTasks, initialMyTasks, userProfile]);

  // Task selection handler
  const handleTaskSelect = async (taskId) => {
    console.log('Task selected (ID):', taskId);
    console.log('Task selected (Type):', typeof taskId);
    console.log('Available tasks to search:', availableTasks);
    console.log('🎯 Achievements received in DashboardToolHolder:', achievements);

    // Find the task - try both string and number comparison
    let taskToMove = availableTasks.find(task => task.id === taskId);
    if (!taskToMove) {
      taskToMove = availableTasks.find(task => task.id === Number(taskId));
    }
    
    console.log('Task to move:', taskToMove);
    
    if (taskToMove) {
      try {
        console.log('🚀 Assigning task instance via API:', taskToMove.id);
        const assigned = await assignTask(taskToMove.id);
  
        console.log('✅ Assigned task response:', assigned);
  
        // Remove from available, add to myTasks using backend data
        const updatedAvailableTasks = availableTasks.filter(task =>
          task.id !== taskToMove.id
        );
  
        const newMyTask = {
          id: assigned.id,
          title: assigned.taskTitle || 'Untitled',
          description: assigned.taskDescription || '',
          points: assigned.taskPointValue || 0,
          difficulty: assigned.taskDifficulty || 'medium',
          completed: assigned.status === 'completed'
        };
  
        setMyTasks(prev => [...prev, newMyTask]);
        setAvailableTasks(updatedAvailableTasks);
      } catch (error) {
        console.error('❌ Failed to assign task:', error);
      }
    } else {
      console.error('Could not find task with ID:', taskId);
    }
  };
  

  // Task completion handler
  const handleTaskComplete = async (taskId) => {
    console.log('Task completed (ID):', taskId);

    const taskToComplete = myTasks.find(task => task.id === taskId || task.id === Number(taskId));
    if (!taskToComplete) {
      console.error('Could not find task with ID:', taskId);
      return;
    }

    try {
      console.log('🚀 Completing task instance via API:', taskId);
      const completed = await completeTask(taskId);
      console.log('✅ Completed task response:', completed);

      const updatedTasks = myTasks.map(task =>
        task.id === taskId || task.id === Number(taskId)
          ? { ...task, completed: true }
          : task
      );

      setMyTasks(updatedTasks);
      setUserData(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + taskToComplete.points,
        completedTasks: prev.completedTasks + 1
      }));
    } catch (error) {
      console.error('❌ Failed to complete task:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {dataSource === 'mock-data' && (
        <div className={styles.mockWarning} style={{ color: 'red', padding: '5px', marginBottom: '10px' }}>
          Using mock data for testing - no real tasks found
        </div>
      )}
      
      <UserSection userName={userData.name} />
      
      <div className={styles.statsSection}>
        <h2>Your Progress</h2>
        <ProgressBar
          current={userData.totalPoints}
          total={userData.maxPossiblePoints}
        />
        <div className={styles.statsInfo}>
          <p>Completed: {userData.completedTasks}</p>
          <p>Points: {userData.totalPoints}/{userData.maxPossiblePoints}</p>
        </div>
      </div>
      
      <div className={styles.taskSection}>
        <div>
          <h4>Task Data Source: {dataSource}</h4>
          <p>Available Tasks: {availableTasks.length}</p>
          <p>My Tasks: {myTasks.length}</p>
          
          {/* Add debug info */}
          <details>
            <summary>Debug Info</summary>
            <pre style={{ fontSize: '10px', background: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto' }}>
              Received battleTasks: {JSON.stringify(battleTasks, null, 2)}
            </pre>
          </details>
        </div>
        
        <TaskSelector
          availableTasks={availableTasks}
          onTaskSelect={handleTaskSelect}
        />
        
        <MyTasks
          tasks={myTasks}
          onTaskComplete={handleTaskComplete}
        />
      </div>
      
      <Achievements achievements={achievements} />

    </div>
  );
};

export default DashboardToolHolder;