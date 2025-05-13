// components/Dashboard/DashboardMobile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../../api/dashboardApi';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import './DashboardMobile.css';

// Sub-components
import UserSection from './UserSection/UserSection';
import ProgressBar from './ProgressBar/ProgressBar';
import TaskSelector from './TaskSelector/TaskSelector';
import MyTasks from './MyTasks/MyTasks';
import Achievements from './Achievements/Achievements';
import { assignTask, completeTask } from '../../api/dashboardApi';

const DashboardMobile = () => {
  const [activeTab, setActiveTab] = useState('current'); // 'current', 'past', or 'achievements'
  const [dashboardData, setDashboardData] = useState({
    taskAvailable: [],
    userTasks: [],
    achievements: [],
    progress: {},
    userProfile: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        // Use mock data for development
        const mockData = {
          taskAvailable: [
            { id: 101, title: 'Morning Stretch', taskPointValue: 10, taskDifficulty: 'easy' },
            { id: 102, title: 'Take Medication', taskPointValue: 20, taskDifficulty: 'medium' }
          ],
          userTasks: [
            { id: 103, title: 'Walk 10 Minutes', taskPointValue: 15, taskDifficulty: 'medium', status: 'in-progress' },
            { id: 104, title: 'Evening Exercises', taskPointValue: 25, taskDifficulty: 'hard', status: 'completed' }
          ],
          achievements: [
            { id: 1, title: 'First Steps', description: 'Complete your first task', icon: '🌟', point_threshold: 10 },
            { id: 2, title: 'Consistency', description: 'Complete 5 tasks in a row', icon: '🔥', point_threshold: 50 }
          ],
          progress: { current: 35, total: 100 },
          userProfile: { name: 'Test User', totalPoints: 35 }
        };
        setDashboardData(mockData);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Format tasks for components
  const formatTasks = (tasks) => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title || task.taskTitle || 'Untitled',
      points: task.taskPointValue || 0,
      difficulty: task.taskDifficulty || 'medium',
      completed: task.status === 'completed'
    }));
  };

  // Get current tasks (not completed)
  const getCurrentTasks = () => {
    return formatTasks(dashboardData.userTasks.filter(task => task.status !== 'completed'));
  };

  // Get past tasks (completed)
  const getPastTasks = () => {
    return formatTasks(dashboardData.userTasks.filter(task => task.status === 'completed'));
  };

  // Handle task selection
  const handleTaskSelect = async (taskId) => {
    try {
      const taskToAssign = dashboardData.taskAvailable.find(t => t.id === taskId);
      if (!taskToAssign) return;
      
      const assignedTask = await assignTask(taskId);
      
      // Update dashboard data
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
      await completeTask(taskId);
      
      // Update dashboard data
      setDashboardData(prev => ({
        ...prev,
        userTasks: prev.userTasks.map(task => 
          task.id === taskId ? { ...task, status: 'completed' } : task
        ),
        progress: {
          ...prev.progress,
          current: prev.progress.current + 
            (prev.userTasks.find(t => t.id === taskId)?.taskPointValue || 0)
        }
      }));
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-mobile">
      {/* Header */}
      <header className="dashboard-header">
        <Link to="/" className="back-button">
          <FiHome />
        </Link>
        <h1>Dashboard</h1>
      </header>

      {/* User and Progress */}
      <section className="user-section">
        <UserSection userName={dashboardData.userProfile?.name || 'User'} />
        
        <div className="progress-section">
          <h3>Your Progress</h3>
          <ProgressBar 
            current={dashboardData.progress?.current || 0} 
            total={dashboardData.progress?.total || 100} 
          />
          <div className="progress-info">
            <span>{dashboardData.progress?.current || 0} Points</span>
            <span>{getPastTasks().length} Tasks Completed</span>
          </div>
        </div>
      </section>

      {/* Task Selection */}
      <section className="task-selection">
        <TaskSelector 
          availableTasks={formatTasks(dashboardData.taskAvailable)}
          onTaskSelect={handleTaskSelect}
        />
      </section>

      {/* Tabs */}
      <div className="tab-selector">
        <button 
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Battles
        </button>
        <button 
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Battles
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'current' && (
          <div className="current-tasks">
            <MyTasks 
              tasks={getCurrentTasks()} 
              onTaskComplete={handleTaskComplete}
            />
            {getCurrentTasks().length === 0 && (
              <div className="empty-state">
                <p>No current tasks. Select a new task to begin!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="past-tasks">
            {getPastTasks().length === 0 ? (
              <div className="empty-state">
                <p>No completed tasks yet.</p>
              </div>
            ) : (
              <ul className="completed-tasks-list">
                {getPastTasks().map(task => (
                  <li key={task.id} className="completed-task-item">
                    <div className="task-info">
                      <span className="task-title">{task.title}</span>
                      <span className="task-points">{task.points} pts</span>
                    </div>
                    <span className="completion-icon">✓</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <Achievements achievements={dashboardData.achievements} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMobile;