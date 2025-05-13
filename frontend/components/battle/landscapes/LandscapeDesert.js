// components/battle/landscapes/LandscapeDesert.js
import { useEffect, useRef, useState } from 'react';
import useBattlePath from '../../../hooks/useBattlePath';
import { getTaskColor } from '../../../utils/dataTransformUtils';

const LandscapeDesert = ({ 
  roadPathId, 
  taskInstances = [], 
  selectedTaskId = null,
  onTaskSelect = () => {}
}) => {
  // Desert shape path data - more flat with dunes
  const desertPathData = "M0,600 L0,450 L100,430 L200,450 L300,420 L400,450 L500,400 L600,450 L700,430 L800,440 L800,600 Z";
  
  // Desert dune highlights
  const duneHighlights = "M100,430 L200,450 L300,420 L400,450 L500,400 L600,450 L700,430 L800,440 L800,450 L700,440 L600,460 L500,410 L400,460 L300,430 L200,460 L100,440 Z";
  
  // State for the split path data
  const [splitPaths, setSplitPaths] = useState({
    completedPath: null,
    remainingPath: null
  });
  
  // Use the battle path hook to handle task positioning
  const { roadRef, terrainRef, positionedTasks } = useBattlePath(
    roadPathId, 
    'desertShape', 
    taskInstances,
    'desert'
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
        
        // If no completed tasks, show all path as default color
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
  
  // Get appropriate colors for the desert theme
  const completedColor = "#06A77D"; // Desert green for completed path
  const availableColor = "#D4B483"; // Default desert road color
  
  return (
    <>
      {/* Desert shape and clip path definitions */}
      <defs>
        <path id="desertShape" d={desertPathData} ref={terrainRef} />
        <clipPath id="desertClip">
          <use href="#desertShape" />
        </clipPath>
        
        {/* Sand pattern definition */}
        <pattern id="sandPattern" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#E2C091" />
          <rect width="2" height="2" x="2" y="2" fill="#DDB978" />
          <rect width="2" height="2" x="6" y="6" fill="#DDB978" />
        </pattern>
      </defs>
      
      {/* Desert body */}
      <use href="#desertShape" fill="url(#sandPattern)" />
      
      {/* Dune highlights */}
      <path d={duneHighlights} fill="#F1DDB5" opacity="0.6" />
      
      {/* Road that's clipped to stay inside desert */}
      <g clipPath="url(#desertClip)">
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
            stroke={completedColor} 
            strokeWidth="20" 
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {splitPaths.remainingPath && (
          <path 
            d={splitPaths.remainingPath} 
            stroke={availableColor} 
            strokeWidth="20" 
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Road markings - more faded in desert */}
        <use href={`#${roadPathId}`} stroke="#F1DDB5" strokeWidth="2" strokeDasharray="15 25" fill="none" strokeLinecap="round" />
      </g>
      
      {/* Cacti */}
      <g clipPath="url(#desertClip)">
        <g transform="translate(150, 430)">
          <rect x="-5" y="-40" width="10" height="40" fill="#688E26" rx="2" />
          <rect x="-15" y="-30" width="10" height="20" fill="#688E26" rx="2" transform="rotate(-20, -15, -30)" />
          <rect x="12" y="-25" width="10" height="15" fill="#688E26" rx="2" transform="rotate(30, 12, -25)" />
        </g>
        
        <g transform="translate(350, 410)">
          <rect x="-8" y="-60" width="16" height="60" fill="#688E26" rx="3" />
          <rect x="-25" y="-45" width="12" height="30" fill="#688E26" rx="2" transform="rotate(-15, -25, -45)" />
          <rect x="20" y="-40" width="12" height="25" fill="#688E26" rx="2" transform="rotate(25, 20, -40)" />
        </g>
        
        <g transform="translate(600, 430)">
          <rect x="-6" y="-50" width="12" height="50" fill="#688E26" rx="2" />
          <rect x="-20" y="-40" width="10" height="25" fill="#688E26" rx="2" transform="rotate(-22, -20, -40)" />
        </g>
      </g>
      
      {/* Stop points - rendered on top, outside the clip path */}
      <g id="stopPoints">
        {positionedTasks.map((task, index) => {
          // Use the properly calculated positions from the hook
          const x = task.x ?? (100 + (600 * task.position));
          const y = task.y ?? (500 - (100 * task.position)); 
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
              {/* Oasis marker for desert */}
              <circle 
                cx={x} 
                cy={y} 
                r={isSelected ? 12 + (task.weight * 4) : 8 + (task.weight * 4)} 
                fill={getTaskColor(difficulty, 'desert')} 
                stroke={isSelected ? "#FFF900" : "#F1DDB5"} 
                strokeWidth={isSelected ? 3 : 2} 
              />
              <text 
                x={x} 
                y={y - 15} 
                textAnchor="middle" 
                fill="#F1DDB5" 
                stroke="#5E3023" 
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
                    fill="rgba(94, 48, 35, 0.8)" 
                  />
                  <text 
                    x={x} 
                    y={y - 40} 
                    textAnchor="middle" 
                    fill="#F1DDB5" 
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

export default LandscapeDesert;