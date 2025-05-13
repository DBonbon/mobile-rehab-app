// components/battle/LandscapeBase.js
import { useEffect, useRef } from 'react';
import LandscapeMountain from './LandscapeMountain';
import LandscapeDesert from './LandscapeDesert';
import LandscapeGlacier from './LandscapeGlacier';
import { getPathData } from '../../../utils/pathUtils';

const LandscapeBase = ({
  terrain = 'mountain',
  bgColor = '#ffffff',
  bgColor2 = '#87CEEB',
  pathType = 'curved',
  taskInstances = [],
  selectedTaskId = null,
  onTaskSelect = () => {},
  dimensions = { width: 0, height: 0 }
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
  // Add this at the top of your LandscapeBase component
  console.log("LandscapeBase props:", { terrain, pathType, taskInstances });
  // Force SVG to scale properly using direct DOM manipulation
  useEffect(() => {
    const forceSvgScaling = () => {
      const container = containerRef.current;
      const svg = svgRef.current;
      
      if (!container || !svg) return;
      
      // Get container dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      console.log("Applying forced scaling to SVG", { containerWidth, containerHeight });
      
      // Direct DOM manipulation to override any potential styling conflicts
      // These inline styles will have highest specificity
      svg.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: ${containerWidth}px !important;
        height: ${containerHeight}px !important;
        max-width: none !important;
        max-height: none !important;
        min-width: ${containerWidth}px !important;
        min-height: ${containerHeight}px !important;
        object-fit: fill !important;
        transform-origin: 0 0 !important;
      `;
      
      // Ensure internal SVG scaling is disabled
      svg.setAttribute('preserveAspectRatio', 'none');
      
      // Scale the SVG viewBox to match container's aspect ratio
      const viewBoxWidth = 800;
      const viewBoxHeight = 600;
      const containerRatio = containerWidth / containerHeight;
      const viewBoxRatio = viewBoxWidth / viewBoxHeight;
      
      if (containerRatio !== viewBoxRatio) {
        if (containerRatio > viewBoxRatio) {
          // Container is wider, scale viewBox width
          const newWidth = viewBoxHeight * containerRatio;
          svg.setAttribute('viewBox', `0 0 ${newWidth} ${viewBoxHeight}`);
        } else {
          // Container is taller, scale viewBox height
          const newHeight = viewBoxWidth / containerRatio;
          svg.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${newHeight}`);
        }
      }
      
      // Force all paths to use non-scaling-stroke
      const paths = svg.querySelectorAll('path');
      paths.forEach(path => {
        path.setAttribute('vector-effect', 'non-scaling-stroke');
      });
    };
    
    // Run on mount and delayed to ensure DOM is ready
    forceSvgScaling();
    const timeoutId = setTimeout(forceSvgScaling, 100);
    
    // Run on window resize
    window.addEventListener('resize', forceSvgScaling);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', forceSvgScaling);
      clearTimeout(timeoutId);
    };
  }, []);
  
  
  // Get the appropriate landscape component based on terrain type
  // Get the appropriate landscape component based on terrain type
  const getLandscapeComponent = () => {
    // Handle both string and object cases
    const terrainName = typeof terrain === 'string' ? terrain : terrain?.name;
    
    switch (terrainName) {
      case 'desert':
        return LandscapeDesert;
      case 'glacier':
        return LandscapeGlacier;
      case 'mountain':
      default:
        return LandscapeMountain;
    }
  };
  
  const LandscapeComponent = getLandscapeComponent();
  
  // Handle task selection
  function handleTaskClick(taskId) {
    if (onTaskSelect) {
      onTaskSelect(taskId);
    }
  }
  
  return (
    <div 
      ref={containerRef} 
      className="battle-landscape-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Apply a CSS override class to handle Tailwind conflicts */}
      <style jsx>{`
        .battle-landscape-container * {
          box-sizing: content-box;
        }
        
        .battle-landscape-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          max-width: none;
          max-height: none;
        }
      `}</style>
      
      <svg 
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
        className="battle-landscape-svg"
      >
        {/* Definitions for reusable elements */}
        <defs>
          {/* Base path for the road */}
          <path id="roadPath" d={getPathData(pathType, terrain)} />
        </defs>
        
        {/* Background gradient */}
        <rect 
          x="0" 
          y="0" 
          width="800" 
          height="600" 
          fill={`url(#landscapeGradient)`} 
        />
        
        {/* Define the gradient */}
        <linearGradient 
          id="landscapeGradient" 
          x1="0%" 
          y1="0%" 
          x2="0%" 
          y2="100%"
        >
          <stop offset="0%" stopColor={bgColor2} />
          <stop offset="100%" stopColor={bgColor} />
        </linearGradient>
        
        {/* Landscape component */}
        <LandscapeComponent 
          roadPathId="roadPath" 
          taskInstances={taskInstances}
          selectedTaskId={selectedTaskId}
          onTaskSelect={handleTaskClick}
        />
      </svg>
    </div>
  );
};

export default LandscapeBase;