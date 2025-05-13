// utils/pathUtils.js

/**
 * Calculate positions for tasks along a path
 * This utility helps position task points along an SVG path
 * 
 * @param {Element} pathElement - The SVG path element
 * @param {Element} clipElement - The SVG clip path element
 * @param {Array} tasks - Array of battle tasks with position property (0-1)
 * @returns {Array} Array of tasks with x, y coordinates added
 */
export function calculateTaskPositions(pathElement, clipElement, tasks) {
    if (!pathElement || !tasks.length) return tasks;
    
    // Get the total length of the path
    const pathLength = pathElement.getTotalLength();
    
    // Set up canvas for point-in-path testing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const clipPathD = clipElement.getAttribute('d');
    const clipPath = new Path2D(clipPathD);
    
    // Extract just the visible segment of the path (the part inside the clip path)
    const visibleSegments = findVisiblePathSegments(pathElement, clipPath, ctx, pathLength);
    
    // Calculate the visible path start and end
    const visiblePathStart = visibleSegments.length > 0 ? visibleSegments[0].start : 0;
    const visiblePathEnd = visibleSegments.length > 0 ? 
      visibleSegments[visibleSegments.length - 1].end : pathLength;
    
    // Calculate the total visible length
    const visibleLength = visiblePathEnd - visiblePathStart;
    
    // Add margins to prevent points from being at the very beginning or end
    // Using 10% margin on each side
    const margin = visibleLength * 0.1;
    const adjustedStart = visiblePathStart + margin;
    const adjustedEnd = visiblePathEnd - margin;
    const adjustedLength = adjustedEnd - adjustedStart;
    
    return tasks.map(task => {
      // Adjust position to only use the visible part of the path with margins
      // This ensures first and last points aren't at the very beginning or end
      let adjustedPosition = adjustedStart + (adjustedLength * task.position);
      
      // Ensure we're within bounds
      adjustedPosition = Math.max(adjustedStart, Math.min(adjustedEnd, adjustedPosition));
      
      // Get the point on the path
      const point = pathElement.getPointAtLength(adjustedPosition);
      
      return {
        ...task,
        x: point.x,
        y: point.y
      };
    });
  }
  
  /**
   * Find the visible segments of a path within a clip path
   * This helps us determine which parts of the road are actually visible
   * 
   * @param {Element} pathElement - The path element (road)
   * @param {Path2D} clipPath - The clip path (landscape)
   * @param {CanvasRenderingContext2D} ctx - Canvas context for hit testing
   * @param {number} pathLength - Total length of the path
   * @returns {Array} Array of visible segment objects {start, end}
   */
  export function findVisiblePathSegments(pathElement, clipPath, ctx, pathLength) {
    const segments = [];
    const numSamples = 100; // Number of points to check along the path
    const sampleDistance = pathLength / numSamples;
    
    let currentSegment = null;
    
    // Sample the path at regular intervals to find visible segments
    for (let i = 0; i <= numSamples; i++) {
      const distance = i * sampleDistance;
      const point = pathElement.getPointAtLength(distance);
      const isVisible = ctx.isPointInPath(clipPath, point.x, point.y);
      
      // If we found a visible point and we're not in a segment, start a new one
      if (isVisible && !currentSegment) {
        currentSegment = { start: distance };
      }
      // If we found a non-visible point and we are in a segment, end it
      else if (!isVisible && currentSegment) {
        currentSegment.end = distance;
        segments.push(currentSegment);
        currentSegment = null;
      }
    }
    
    // If we ended while still in a segment, close it
    if (currentSegment) {
      currentSegment.end = pathLength;
      segments.push(currentSegment);
    }
    
    return segments;
  }
  
  /**
   * Find the appropriate ground level (bottom) of a terrain shape
   * This helps position points consistently on the "ground"
   * 
   * @param {string} pathData - SVG path data string for terrain
   * @returns {number} Approximate Y coordinate of ground level
   */
  export function findGroundLevel(pathData) {
    // SVG terrain paths typically have the bottom edges at y=600
    // For more accurate calculation, we would parse the path data
    return 600;
  }
  
  /**
   * Get the appropriate task color based on difficulty and terrain
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
  
  /**
   * Get path data for different path types and terrains
   * 
   * @param {string} pathType - Type of path (curved, straight, zigzag)
   * @param {string} terrain - Type of terrain
   * @returns {string} SVG path data
   */
  export function getPathData(pathType, terrain) {
    // Base paths for different path types - now starting slightly above the ground
    const basePaths = {
      straight: "M50,580 L750,580", // Raised slightly, shorter on sides
      zigzag: "M50,580 L200,400 L400,500 L600,300 L750,580", // Shorter on sides
      curved: "M50,580 C150,550 300,500 450,400 C600,300 650,450 750,580" // Shorter on sides
    };
    
    // Terrain-specific adjustments to paths
    // This ensures the road follows the terrain contours better and starts above ground
    const terrainAdjustments = {
      mountain: {
        straight: "M50,580 L750,580", // Raised from ground level
        zigzag: "M50,580 L200,500 L400,550 L600,450 L750,580", // Following mountain base
        curved: "M50,580 C150,550 300,500 450,450 C550,400 650,450 750,580" // Smooth curve along mountain
      },
      desert: {
        straight: "M50,580 L750,580", // Raised from desert floor
        zigzag: "M50,580 L200,550 L400,580 L600,550 L750,580", // Gentler zigzag on desert
        curved: "M50,580 C150,570 300,550 450,540 C600,530 700,550 750,580" // Shallow curve on desert
      },
      glacier: {
        straight: "M50,580 L750,580", // Raised from ground level
        zigzag: "M50,580 L200,500 L400,550 L600,450 L750,580", // Following glacier base
        curved: "M50,580 C150,550 300,520 450,500 C600,480 700,520 750,580" // Curve along glacier base
      }
    };
    
    // Return terrain-specific path if available, otherwise return base path
    return terrainAdjustments[terrain]?.[pathType] || basePaths[pathType] || basePaths.curved;
  }