// /api/mockApi.js
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockTasks = [
  { id: 1, title: "Update product descriptions", points: 10, completed: false, assigned: false },
  { id: 2, title: "Review customer feedback", points: 15, completed: false, assigned: false },
  { id: 3, title: "Test checkout flow", points: 20, completed: false, assigned: false },
  { id: 4, title: "Create social media posts", points: 12, completed: false, assigned: false },
  { id: 5, title: "Update FAQ section", points: 8, completed: false, assigned: false },
];

const mockUser = {
  id: 101,
  name: "John Doe",
  totalPoints: 25,
  completedTasks: 2,
  maxPossiblePoints: 100
};

// Mock API functions
const api = {
  // Get user data
  getUserData: async (userId) => {
    await delay(500); // Simulate network delay
    return { ...mockUser };
  },
  
  // Get available (unassigned) tasks
  getAvailableTasks: async () => {
    await delay(700);
    return mockTasks.filter(task => !task.assigned);
  },
  
  // Get tasks assigned to user
  getUserTasks: async (userId) => {
    await delay(600);
    return mockTasks.filter(task => task.assigned && task.assignedTo === userId);
  },
  
  // Assign task to user
  assignTask: async (taskId, userId) => {
    await delay(800);
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].assigned = true;
      mockTasks[taskIndex].assignedTo = userId;
      return { success: true, task: mockTasks[taskIndex] };
    }
    return { success: false, error: "Task not found" };
  },
  
  // Mark task as completed
  completeTask: async (taskId, userId) => {
    await delay(600);
    const taskIndex = mockTasks.findIndex(t => t.id === taskId && t.assignedTo === userId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].completed = true;
      
      // Update user points
      mockUser.totalPoints += mockTasks[taskIndex].points;
      mockUser.completedTasks += 1;
      
      return { 
        success: true, 
        task: mockTasks[taskIndex],
        userProgress: {
          totalPoints: mockUser.totalPoints,
          completedTasks: mockUser.completedTasks,
          maxPossiblePoints: mockUser.maxPossiblePoints
        }
      };
    }
    return { success: false, error: "Task not found or not assigned to user" };
  }
};

export default api;