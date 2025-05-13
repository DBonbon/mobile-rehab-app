// utils/dataTransformUtils.js

/**
 * Transforms API data for battle visualization components
 * Converts API data structure to the format expected by visualization components
 * 
 * @param {Object} apiData - The raw API data from your backend
 * @returns {Object} Transformed data ready for visualization components
 */
export function prepareBattleData(apiData) {
    // Extract needed properties with defaults
    const {
      title = '',
      description = '',
      terrain = null,
      taskInstances = [],
      pointValue = 0,
      recommended_frequency = 0,
      bg_color = '#ffffff',
      bg_color2 = '#87CEEB',
      path_type = 'curved'
    } = apiData;
  
    // Get terrain identifier or use default
    const terrainType = terrain?.identifier || 'mountain';
  
    // Calculate total points from all tasks
    const totalPoints = taskInstances.reduce(
      (sum, entry) => sum + (Number(entry.task?.pointValue) || 0),
      0
    );
  
    // Calculate position and weight for each task based on point values
    let currentPosition = 0;
    const positionedTasks = taskInstances.map(task => {
      const pointValue = Number(task.task?.pointValue) || 0;
      const position = currentPosition;
      
      // Update for next task
      currentPosition += pointValue / (totalPoints || 1); // Avoid division by zero
      
      return {
        ...task,
        position, // Position as percentage (0-1)
        weight: pointValue / (totalPoints || 1) // Normalized weight
      };
    });
  
    // Return transformed data with camelCase properties
    return {
      title,
      description,
      terrain: terrainType,
      taskInstances: positionedTasks,
      pointValue: pointValue,
      recommendedFrequency: recommended_frequency,
      bgColor: bg_color,
      bgColor2: bg_color2,
      pathType: path_type
    };
  }
  
  /**
   * Helper function to get the appropriate task color based on difficulty
   * 
   * @param {string} difficulty - Task difficulty (easy, medium, hard)
   * @param {string} terrain - Terrain type
   * @returns {string} HEX color code
   */
  export function getTaskColor(difficulty, terrain = 'mountain') {
    const colorMap = {
      mountain: {
        easy: '#4CAF50',    // Green
        medium: '#FF9800',  // Orange
        hard: '#F44336'     // Red
      },
      desert: {
        easy: '#06A77D',    // Desert green
        medium: '#F5A623',  // Desert orange
        hard: '#D7263D'     // Desert red
      },
      glacier: {
        easy: '#5CB8E4',    // Ice blue
        medium: '#F77F00',  // Ice orange
        hard: '#E63946'     // Ice red
      }
    };
    
    // Get the color map for the terrain, fall back to mountain if terrain doesn't exist
    const themeColors = colorMap[terrain] || colorMap.mountain;
    
    // Return the color for the difficulty, fall back to medium if difficulty doesn't exist
    return themeColors[difficulty] || themeColors.medium;
  }