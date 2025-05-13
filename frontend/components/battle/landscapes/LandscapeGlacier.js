// components/battle/landscapes/LandscapeGlacier.js
import { useEffect, useRef, useState } from 'react';
import useBattlePath from '../../../hooks/useBattlePath';
import { getTaskColor } from '../../../utils/dataTransformUtils';

const LandscapeGlacier = ({ 
  roadPathId, 
  taskInstances = [], 
  selectedTaskId = null,
  onTaskSelect = () => {}
}) => {
  // Glacier shape path data - jagged and crystalline
  const glacierPathData = "M0,600 L0,350 L120,320 L170,280 L220,330 L300,250 L340,270 L380,230 L440,280 L500,200 L550,250 L600,220 L650,270 L720,230 L800,280 L800,600 Z";
  
  // Glacier highlights/cracks
  const glacierHighlights = "M120,320 L150,350 L190,310 L220,330 L260,300 L300,250 L320,290 L360,260 L380,230 L400,260 L420,240 L440,280 L470,230 L500,200 L530,230 L550,250 L580,230 L600,220 L620,250 L650,270 L680,250 L720,230 L760,260 L800,280";
  
  // State for the split path data
  const [splitPaths, setSplitPaths] = useState({
    completedPath: null,
    remainingPath: null
  });
  
  // Use the battle path hook to handle task positioning
  const { roadRef, terrainRef, positionedTasks } = useBattlePath(
    roadPathId, 
    'glacierShape', 
    taskInstances,
    'glacier'
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
  
  // Get appropriate colors for the glacier theme
  const completedColor = "#5CB8E4"; // Ice blue for completed path
  const availableColor = "#84AFBD"; // Default glacier road color
  
  return (
    <>
      {/* Glacier shape and clip path definitions */}
      <defs>
        <path id="glacierShape" d={glacierPathData} ref={terrainRef} />
        <clipPath id="glacierClip">
          <use href="#glacierShape" />
        </clipPath>
        
        {/* Ice pattern definition */}
        <linearGradient id="iceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5D6E2" />
          <stop offset="50%" stopColor="#75B9D1" />
          <stop offset="100%" stopColor="#A5D6E2" />
        </linearGradient>
        
        {/* Frost pattern */}
        <pattern id="frostPattern" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="#DCF5FF" />
          <path d="M0,0 L20,20 M20,0 L0,20" stroke="#FFFFFF" strokeWidth="1" />
        </pattern>
      </defs>
      
      {/* Glacier body */}
      <use href="#glacierShape" fill="url(#iceGradient)" />
      
      {/* Glacier cracks/highlights */}
      <path d={glacierHighlights} stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.7" />
      
      {/* Frost overlay */}
      <use href="#glacierShape" fill="url(#frostPattern)" opacity="0.3" />
      
      {/* Road that's clipped to stay inside glacier */}
      <g clipPath="url(#glacierClip)">
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
        
        {/* Road markings - more subtle on ice */}
        <use href={`#${roadPathId}`} stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 15" fill="none" strokeLinecap="round" />
      </g>
      
      {/* Ice formations */}
      <g clipPath="url(#glacierClip)">
        <g transform="translate(170, 300)">
          <path d="M-10,0 L0,-40 L10,0 Z" fill="#FFFFFF" opacity="0.7" />
          <path d="M-5,0 L0,-20 L5,0 Z" fill="#A5D6E2" opacity="0.9" />
        </g>
        
        <g transform="translate(320, 260)">
          <path d="M-15,0 L0,-60 L15,0 Z" fill="#FFFFFF" opacity="0.7" />
          <path d="M-8,0 L0,-30 L8,0 Z" fill="#A5D6E2" opacity="0.9" />
        </g>
        
        <g transform="translate(500, 220)">
          <path d="M-12,0 L0,-50 L12,0 Z" fill="#FFFFFF" opacity="0.7" />
          <path d="M-6,0 L0,-25 L6,0 Z" fill="#A5D6E2" opacity="0.9" />
        </g>
        
        <g transform="translate(650, 250)">
          <path d="M-10,0 L0,-40 L10,0 Z" fill="#FFFFFF" opacity="0.7" />
          <path d="M-5,0 L0,-20 L5,0 Z" fill="#A5D6E2" opacity="0.9" />
        </g>
      </g>
      
      {/* Stop points - rendered on top, outside the clip path */}
      <g id="stopPoints">
        {positionedTasks.map((task, index) => {
          // Use the properly calculated positions from the hook
          const x = task.x ?? (100 + (600 * task.position));
          const y = task.y ?? (510 - (200 * task.position));
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
              {/* Flag marker for glacier points */}
              <line 
                x1={x} 
                y1={y + 10} 
                x2={x} 
                y2={y - 20} 
                stroke={isSelected ? "#FFF900" : "#333"} 
                strokeWidth={isSelected ? 3 : 2} 
              />
              <path 
                d={`M${x},${y - 20} L${x + 15},${y - 15} L${x},${y - 10} Z`} 
                fill={getTaskColor(difficulty, 'glacier')}
              />
              <circle 
                cx={x} 
                cy={y} 
                r={isSelected ? 9 + (task.weight * 4) : 6 + (task.weight * 4)} 
                fill="#FFFFFF" 
                stroke={getTaskColor(difficulty, 'glacier')} 
                strokeWidth={isSelected ? 3 : 2} 
              />
              <text 
                x={x} 
                y={y + 25} 
                textAnchor="middle" 
                fill="#FFFFFF" 
                stroke="#333333" 
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
                    y={y - 80} 
                    width="160" 
                    height="30" 
                    rx="5" 
                    fill="rgba(51, 51, 51, 0.8)" 
                  />
                  <text 
                    x={x} 
                    y={y - 60} 
                    textAnchor="middle" 
                    fill="#FFFFFF" 
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

export default LandscapeGlacier;