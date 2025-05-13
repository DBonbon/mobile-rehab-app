// components/battle/landscapes/LandscapeMountain.js
import { useEffect, useRef, useState } from 'react';
import useBattlePath from '../../../hooks/useBattlePath';
import { getTaskColor } from '../../../utils/dataTransformUtils';

const LandscapeMountain = ({ 
  roadPathId, 
  taskInstances = [], 
  selectedTaskId = null,
  onTaskSelect = () => {}
}) => {
  // Mountain shape path data
  const mountainPathData = "M0,600 L0,400 L150,250 L300,350 L450,150 L600,300 L800,200 L800,600 Z";
  
  // Snow caps path data that follows mountain contour
  const snowPathData = "M150,250 L300,350 L450,150 L600,300 L800,200 L800,230 L600,330 L450,180 L300,380 L150,280 Z";
  
  // State for the split path data
  const [splitPaths, setSplitPaths] = useState({
    completedPath: null,
    remainingPath: null
  });
  
  // Use the battle path hook to handle task positioning
  const { roadRef, terrainRef, positionedTasks } = useBattlePath(
    roadPathId, 
    'mountainShape', 
    taskInstances,
    'mountain'
  );
  
  // Find the furthest completed task
  const findFurthestCompletedTask = () => {
    if (!positionedTasks.length) return null;
    
    // Combine positionedTasks with status information from taskInstances
    const tasksWithStatus = positionedTasks.map(posTask => {
      const taskInstance = taskInstances.find(t => t.task.id === posTask.task.id);
      return {
        ...posTask,
        status: taskInstance?.status || 'available'
      };
    });
    
    // Filter to get only completed tasks
    const completedTasks = tasksWithStatus.filter(task => task.status === 'completed');
    if (!completedTasks.length) return null;
    
    // Sort by position (which is along path) to find the furthest one
    const sortedCompletedTasks = [...completedTasks].sort((a, b) => b.position - a.position);
    
    // Return the task with the highest position (furthest along the path)
    return sortedCompletedTasks[0];
  };
  
  // Effect to split the path when positioned tasks are available
  useEffect(() => {
    if (!positionedTasks.length) return;
    
    // Wait for DOM to be ready
    setTimeout(() => {
      const roadPath = document.getElementById(roadPathId);
      if (!roadPath) return;
      
      try {
        // Find the furthest completed task
        const furthestCompletedTask = findFurthestCompletedTask();
        
        // If no completed tasks, show all path as gray
        if (!furthestCompletedTask) {
          setSplitPaths({
            completedPath: '',
            remainingPath: createPathSegment(roadPath, 0, roadPath.getTotalLength())
          });
          return;
        }
        
        // Get coordinates of the furthest completed task
        const completedPoint = {
          x: furthestCompletedTask.x,
          y: furthestCompletedTask.y
        };
        
        // Find the closest point on the path to the completed point
        const pathLength = roadPath.getTotalLength();
        let closestDistance = Infinity;
        let closestPosition = 0;
        
        // Sample the path at small intervals to find the closest point
        const precision = 1; // 1 pixel precision
        for (let i = 0; i <= pathLength; i += precision) {
          const point = roadPath.getPointAtLength(i);
          const distance = Math.sqrt(
            Math.pow(point.x - completedPoint.x, 2) + 
            Math.pow(point.y - completedPoint.y, 2)
          );
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPosition = i;
          }
        }
        
        // Create the two path segments
        const completedPath = createPathSegment(roadPath, 0, closestPosition);
        const remainingPath = createPathSegment(roadPath, closestPosition, pathLength);
        
        setSplitPaths({
          completedPath,
          remainingPath
        });
      } catch (error) {
        console.error('Error splitting path:', error);
      }
    }, 200); // Small delay to ensure DOM is ready
  }, [positionedTasks, taskInstances, roadPathId]);
  
  // Helper function to create a path segment
  function createPathSegment(pathElement, startDistance, endDistance) {
    if (!pathElement) return '';
    
    // For very short segments, return empty
    if (Math.abs(endDistance - startDistance) < 1) return '';
    
    // Sample the path at regular intervals
    const points = [];
    const numSamples = 30; // Number of points to sample
    const step = (endDistance - startDistance) / numSamples;
    
    for (let i = 0; i <= numSamples; i++) {
      const distance = startDistance + (i * step);
      if (distance >= 0 && distance <= pathElement.getTotalLength()) {
        const point = pathElement.getPointAtLength(distance);
        points.push(`${point.x},${point.y}`);
      }
    }
    
    // Create SVG path data string
    if (points.length < 2) return '';
    return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`;
  }
  
  // Handle task click
  const handleTaskClick = (taskId, e) => {
    e.stopPropagation();
    if (onTaskSelect) {
      onTaskSelect(taskId);
    }
  };
  
  return (
    <>
      {/* Mountain shape and clip path definitions */}
      <defs>
        <path id="mountainShape" d={mountainPathData} ref={terrainRef} />
        <clipPath id="mountainClip">
          <use href="#mountainShape" />
        </clipPath>
      </defs>
      
      {/* Mountain body */}
      <use href="#mountainShape" fill="#8B4513" />
      
      {/* Snow caps */}
      <path d={snowPathData} fill="#F5F5F5" opacity="0.8" />
      
      {/* Road that's clipped to stay inside mountain */}
      <g clipPath="url(#mountainClip)">
        {/* Original path (hidden) - needed for calculations */}
        <use 
          href={`#${roadPathId}`} 
          ref={roadRef}
          stroke="none" 
          fill="none" 
        />
        
        {/* Split path segments - colored differently */}
        {splitPaths.completedPath && (
          <path 
            d={splitPaths.completedPath} 
            stroke="#00A86B" 
            strokeWidth="20" 
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {splitPaths.remainingPath && (
          <path 
            d={splitPaths.remainingPath} 
            stroke="#696969" 
            strokeWidth="20" 
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Road markings - kept the same */}
        <use href={`#${roadPathId}`} stroke="#FFFFFF" strokeWidth="2" strokeDasharray="20 20" fill="none" strokeLinecap="round" />
      </g>
      
      {/* Trees */}
      <g clipPath="url(#mountainClip)">
        <g transform="translate(120, 430) scale(0.5)">
          <path d="M0,0 L20,0 L10,-40 Z" fill="#2E8B57" />
          <path d="M0,-30 L20,-30 L10,-70 Z" fill="#2E8B57" />
          <rect x="8" y="0" width="4" height="10" fill="#8B4513" />
        </g>
        
        <g transform="translate(250, 400) scale(0.7)">
          <path d="M0,0 L20,0 L10,-40 Z" fill="#2E8B57" />
          <path d="M0,-30 L20,-30 L10,-70 Z" fill="#2E8B57" />
          <rect x="8" y="0" width="4" height="10" fill="#8B4513" />
        </g>
        
        <g transform="translate(380, 350) scale(0.6)">
          <path d="M0,0 L20,0 L10,-40 Z" fill="#2E8B57" />
          <path d="M0,-30 L20,-30 L10,-70 Z" fill="#2E8B57" />
          <rect x="8" y="0" width="4" height="10" fill="#8B4513" />
        </g>
        
        <g transform="translate(520, 320) scale(0.5)">
          <path d="M0,0 L20,0 L10,-40 Z" fill="#2E8B57" />
          <path d="M0,-30 L20,-30 L10,-70 Z" fill="#2E8B57" />
          <rect x="8" y="0" width="4" height="10" fill="#8B4513" />
        </g>
        
        <g transform="translate(680, 240) scale(0.4)">
          <path d="M0,0 L20,0 L10,-40 Z" fill="#2E8B57" />
          <path d="M0,-30 L20,-30 L10,-70 Z" fill="#2E8B57" />
          <rect x="8" y="0" width="4" height="10" fill="#8B4513" />
        </g>
      </g>
      
      {/* Stop points - rendered on top, outside the clip path */}
      <g id="stopPoints">
        {positionedTasks.map((task, index) => {
          // Use the properly calculated positions from the hook
          const x = task.x ?? (100 + (600 * task.position));
          const y = task.y ?? (550 - (200 * task.position));
          const isSelected = task.task.id === selectedTaskId;
          const difficulty = task.task?.difficulty || 'medium';
          
          // Get task status
          const taskInstance = taskInstances.find(t => t.task.id === task.task.id);
          const status = taskInstance?.status || 'available';
          
          return (
            <g 
              key={task.id || index}
              onClick={(e) => handleTaskClick(task.task.id, e)}
              style={{ cursor: 'pointer' }}
              className={isSelected ? 'task-selected' : ''}
            >
              <circle 
                cx={x} 
                cy={y} 
                r={isSelected ? 12 + (task.weight * 4) : 8 + (task.weight * 4)} 
                fill={getTaskColor(difficulty, 'mountain')} 
                stroke={isSelected ? "#FFF900" : "white"} 
                strokeWidth={isSelected ? 3 : 2} 
              />
              <text 
                x={x} 
                y={y - 15} 
                textAnchor="middle" 
                fill="white" 
                stroke="black" 
                strokeWidth="0.5" 
                fontWeight="bold" 
                fontSize="14"
              >
                {index + 1}
              </text>
              
              {/* Task title (shows on hover or selection) */}
              {isSelected && (
                <g>
                  <rect 
                    x={x - 80} 
                    y={y - 60} 
                    width="160" 
                    height="30" 
                    rx="5" 
                    fill="rgba(0,0,0,0.7)" 
                  />
                  <text 
                    x={x} 
                    y={y - 40} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="12"
                  >
                    {task.task.title}
                  </text>
                </g>
              )}
              
              {/* Small indicator for completed tasks */}
              {status === 'completed' && (
                <circle 
                  cx={x} 
                  cy={y} 
                  r="3" 
                  fill="#FFF" 
                />
              )}
            </g>
          );
        })}
      </g>
      
      <style jsx>{`
        .task-selected {
          filter: drop-shadow(0 0 5px rgba(255, 249, 0, 0.7));
        }
      `}</style>
    </>
  );
};

export default LandscapeMountain;