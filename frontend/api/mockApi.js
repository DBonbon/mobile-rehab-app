// api/mockApi.js
// Mock API implementations for development and testing

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock battle data
const mockBattles = [
  { 
    id: 1, 
    title: 'Morning Routine', 
    image: '🌄', 
    terrain: 'mountain', 
    completedTasks: 3, 
    totalTasks: 5, 
    status: 'in-progress' 
  },
  { 
    id: 2, 
    title: 'Physical Therapy', 
    image: '💪', 
    terrain: 'desert', 
    completedTasks: 5, 
    totalTasks: 5, 
    status: 'completed' 
  },
  { 
    id: 3, 
    title: 'Medication', 
    image: '💊', 
    terrain: 'glacier', 
    completedTasks: 0, 
    totalTasks: 3, 
    status: 'not-started' 
  },
  { 
    id: 4, 
    title: 'Stretching', 
    image: '🧘‍♀️', 
    terrain: 'mountain', 
    completedTasks: 2, 
    totalTasks: 4, 
    status: 'in-progress' 
  },
  { 
    id: 5, 
    title: 'Cognitive Exercise', 
    image: '🧠', 
    terrain: 'desert', 
    completedTasks: 1, 
    totalTasks: 6, 
    status: 'in-progress' 
  },
];

// Mock battle details
const mockBattleDetails = {
  1: {
    id: 1,
    title: 'Morning Routine',
    description: 'Help with the essential morning activities to start the day right.',
    pointValue: 100,
    recommended_frequency: 7,
    terrain: 'mountain',
    bg_color: '#f0f8ff',
    bg_color2: '#87CEEB',
    path_type: 'curved',
    taskInstances: [
      {
        id: 101,
        status: 'completed',
        isAssigned: true,
        task: {
          id: 1001,
          title: 'Medication Reminder',
          description: 'Ensure morning medications are taken on time',
          pointValue: 20,
          difficulty: 'easy'
        }
      },
      {
        id: 102,
        status: 'completed',
        isAssigned: true,
        task: {
          id: 1002,
          title: 'Prepare Breakfast',
          description: 'Help prepare a nutritious breakfast',
          pointValue: 30,
          difficulty: 'medium'
        }
      },
      {
        id: 103,
        status: 'completed',
        isAssigned: true,
        task: {
          id: 1003,
          title: 'Morning Hygiene',
          description: 'Assist with morning hygiene routine',
          pointValue: 15,
          difficulty: 'easy'
        }
      },
      {
        id: 104,
        status: 'in_progress',
        isAssigned: true,
        task: {
          id: 1004,
          title: 'Daily Planning',
          description: 'Review the day\'s schedule and plan activities',
          pointValue: 15,
          difficulty: 'medium'
        }
      },
      {
        id: 105,
        status: 'not_started',
        isAssigned: false,
        task: {
          id: 1005,
          title: 'Light Exercise',
          description: 'Assist with gentle morning stretches or light exercise',
          pointValue: 20,
          difficulty: 'hard'
        }
      }
    ]
  },
  // Add more detailed battle data as needed
};

// Mock dashboard data
const mockDashboardData = {
  taskAvailable: [
    { id: 201, title: 'Afternoon Walk', taskPointValue: 25, taskDifficulty: 'medium' },
    { id: 202, title: 'Reading Session', taskPointValue: 15, taskDifficulty: 'easy' },
    { id: 203, title: 'Evening Medications', taskPointValue: 20, taskDifficulty: 'medium' }
  ],
  userTasks: [
    { id: 301, title: 'Prepare Lunch', taskPointValue: 20, taskDifficulty: 'medium', status: 'in_progress' },
    { id: 302, title: 'Morning Medications', taskPointValue: 15, taskDifficulty: 'easy', status: 'completed' }
  ],
  achievements: [
    { id: 1, title: 'First Steps', description: 'Complete your first task', icon: '🌟', point_threshold: 10 },
    { id: 2, title: 'Helping Hand', description: 'Complete 5 tasks', icon: '🤝', point_threshold: 50 },
    { id: 3, title: 'Regular Support', description: 'Log in 5 days in a row', icon: '📅', point_threshold: 100 }
  ],
  progress: { current: 35, total: 100 },
  userProfile: { name: 'Sarah Johnson', totalPoints: 35, userType: 'toolholder' }
};

// Mock API functions

// Get all battles (for homepage)
export const getBattles = async () => {
  await delay(500); // Simulate network delay
  return [...mockBattles];
};

// Get battle details by ID
export const getBattleDetails = async (battleId) => {
  await delay(700);
  const battle = mockBattleDetails[battleId];
  if (!battle) {
    throw new Error(`Battle with ID ${battleId} not found`);
  }
  return {...battle};
};

// Get dashboard data
export const getMockDashboardData = async () => {
  await delay(600);
  return {...mockDashboardData};
};

// Assign user to a task
export const mockAssignUserToTask = async (taskInstanceId) => {
  await delay(400);
  // In a real app, this would update the database
  return { success: true, taskId: taskInstanceId };
};

// Complete a task
export const mockCompleteTask = async (taskInstanceId) => {
  await delay(400);
  // In a real app, this would update the database
  return { success: true, taskId: taskInstanceId };
};

// Assign a task from dashboard
export const mockAssignTask = async (taskId) => {
  await delay(400);
  // Find the task in available tasks
  const task = mockDashboardData.taskAvailable.find(t => t.id === taskId);
  if (!task) {
    throw new Error(`Task with ID ${taskId} not found`);
  }
  
  // Create new assigned task
  const assignedTask = {
    ...task,
    id: 400 + mockDashboardData.userTasks.length, // Generate new ID
    status: 'in_progress'
  };
  
  // In a real app, this would update the database
  // For mock purposes, we update our local mock data
  mockDashboardData.taskAvailable = mockDashboardData.taskAvailable.filter(t => t.id !== taskId);
  mockDashboardData.userTasks.push(assignedTask);
  
  return assignedTask;
};

// Export a function that can be used if the real API call fails
export const fallbackToDashboardMockData = () => {
  console.log('⚠️ Using fallback mock dashboard data');
  return {...mockDashboardData};
};