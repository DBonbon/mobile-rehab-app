// hooks/useBattlePath.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { calculateTaskPositions } from '../utils/pathUtils';

/**
 * Custom hook to handle battle path functionality
 * - Positions tasks along the path
 * - Ensures tasks stay within the terrain boundaries
 * - Handles responsive resizing
 * 
 * @param {string} roadPathId - ID of the road path element
 * @param {string} terrainShapeId - ID of the terrain shape element
 * @param {Array} taskInstances - Array of task instances with position property
 * @param {string} terrain - Type of terrain (mountain, desert, glacier)
 * @returns {Object} Object containing task data and refs
 */
export default function useBattlePath(roadPathId, terrainShapeId, taskInstances, terrain = 'mountain') {
  const roadRef = useRef(null);
  const terrainRef = useRef(null);
  const [positionedTasks, setPositionedTasks] = useState(taskInstances);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  
  // Position tasks when components are mounted and when tasks change
  const updateTaskPositions = useCallback(() => {
    // Skip if we're server-side rendering
    if (typeof window === 'undefined') return;
    
    // Get the DOM elements
    const roadPath = document.getElementById(roadPathId);
    const terrainShape = document.getElementById(terrainShapeId);
    const svgElement = roadPath?.closest('svg');
    
    if (!roadPath || !terrainShape) return;
    
    // Update SVG dimensions
    if (svgElement) {
      const bbox = svgElement.getBoundingClientRect();
      setSvgDimensions({
        width: bbox.width,
        height: bbox.height
      });
    }
    
    try {
      // Use the utility function to calculate positions
      const updatedTasks = calculateTaskPositions(roadPath, terrainShape, taskInstances);
      setPositionedTasks(updatedTasks);
    } catch (error) {
      console.error('Error positioning tasks:', error);
    }
  }, [taskInstances, roadPathId, terrainShapeId]);
  
  // Update positions when tasks change or window resizes
  useEffect(() => {
    // Initial update
    updateTaskPositions();
    
    // Add window resize listener
    const handleResize = () => {
      // Use requestAnimationFrame to avoid excessive updates
      window.requestAnimationFrame(() => {
        updateTaskPositions();
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Also update when the SVG might have rendered
    const checkPositionsTimer = setTimeout(() => {
      updateTaskPositions();
    }, 500);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(checkPositionsTimer);
    };
  }, [updateTaskPositions]);
  
  // Also update positions when refs change
  useEffect(() => {
    if (roadRef.current && terrainRef.current) {
      updateTaskPositions();
    }
  }, [updateTaskPositions]);
  
  return {
    roadRef,
    terrainRef,
    positionedTasks,
    svgDimensions,
    updatePositions: updateTaskPositions
  };
}