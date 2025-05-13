// containers/HomePage/HomePage.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import { FiPlus, FiCheck, FiHome } from 'react-icons/fi';
import styles from './HomePage.module.css';
import Dashboard from '../../components/Dashboard/Dashboard';
import Header from '../../components/header/header';

const HomePage = ({ title, children = [] }) => {
  console.log('✅ HomePage received children:', children?.length);
  
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
  const openDashboard = () => {
    setIsDashboardOpen(true);
  };
  
  const closeDashboard = () => {
    setIsDashboardOpen(false);
  };
  // State for battle path
  const [activeIndex, setActiveIndex] = useState(0);
  const [battleStatus, setBattleStatus] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  

  // Process battle data
  useEffect(() => {
    if (children && children.length > 0) {
      // Calculate mock progress for demo purposes
      // In real implementation, this would come from API data
      const completedBattles = Math.floor(children.length * 0.3); // 30% completion for demo
      setOverallProgress((completedBattles / children.length) * 100);
      
      // Create mock battle status items for demo
      // In real implementation, this would be actual task statuses
      const mockStatus = [
        { id: 1, title: 'Stretches', icon: '🧘‍♀️', progress: 75 },
        { id: 2, title: 'Medication', icon: '💊', progress: 50 },
        { id: 3, title: 'Cognitive', icon: '🧠', progress: 25 }
      ];
      setBattleStatus(mockStatus);
    }
  }, [children]);

  // Get landscape icon based on battle index (for demo)
  const getLandscapeIcon = (index) => {
    const landscapes = ['🏔️', '🏜️', '❄️'];
    return landscapes[index % landscapes.length];
  };
  
  // Get landscape type based on battle index (for demo)
  const getLandscapeType = (index) => {
    const types = ['mountain', 'desert', 'glacier'];
    return types[index % types.length];
  };

  // Handle battle icon click
  const handleBattleClick = (index) => {
    setActiveIndex(index);
  };

  // Handle scroll in path
  const handleScroll = (direction) => {
    if (direction === 'left' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (direction === 'right' && activeIndex < children.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Calculate visible battles (current battle + 3 on each side)
  const getVisibleBattles = () => {
    if (!children || children.length === 0) return [];
    const start = Math.max(0, activeIndex - 3);
    const end = Math.min(children.length, activeIndex + 4);
    return children.slice(start, end);
  };

  // Mock start dates for demo (in real implementation, this would come from API)
  const getStartDate = (index) => {
    const date = new Date();
    date.setDate(date.getDate() - (index * 3));
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.homeContainer}>
      {/* Header */}
      <Header 
        onDashboardOpen={openDashboard} 
        showHomeButton={false} // Hide home button on homepage
      />
      
      {/* Page title now outside the header */}
      {title && (
        <div className={styles.pageTitle}>
          <h2>{title}</h2>
        </div>
      )}

      {/* Progress Overview */}
      <div className={styles.progressOverview}>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <div className={styles.progressStats}>
          <span>{Math.round(overallProgress)}% Complete</span>
          <span>{Math.floor(children.length * 0.3)}/{children.length} Battles</span>
        </div>
      </div>

      {/* Battle Status (Current Tasks) */}
      <div className={styles.battleStatus}>
        <h3>Rehab Status</h3>
        <div className={styles.statusList}>
          {battleStatus.map(status => (
            <div key={status.id} className={styles.statusItem}>
              <div className={styles.statusInfo}>
                <span className={styles.statusIcon}>{status.icon}</span>
                <span className={styles.statusTitle}>{status.title}</span>
              </div>
              <div className={styles.statusProgress}>
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${status.progress}%` }}
                  ></div>
                </div>
                <span className={styles.progressPercentage}>{status.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rehab Path (Battle Journey) */}
      <div className={styles.rehabPath}>
        <h3>Rehab Journey</h3>
        
        <div className={styles.battlePath}>
          {/* Left scroll button */}
          <button 
            className={styles.scrollButton} 
            onClick={() => handleScroll('left')}
            disabled={activeIndex === 0}
          >
            &lt;
          </button>
          
          {/* Battle icons */}
          <div className={styles.battleIcons}>
            {getVisibleBattles().map((battle, index) => {
              const adjustedIndex = Math.max(0, activeIndex - 3) + index;
              const isActive = adjustedIndex === activeIndex;
              const landscapeType = getLandscapeType(adjustedIndex);
              const isCompleted = adjustedIndex < Math.floor(children.length * 0.3);
              
              return (
                <div 
                  key={battle.id}
                  className={`${styles.battleIcon} ${isActive ? styles.active : ''} ${styles[`landscape${landscapeType.charAt(0).toUpperCase() + landscapeType.slice(1)}`]}`}
                  onClick={() => handleBattleClick(adjustedIndex)}
                >
                  {isCompleted && <FiCheck className={styles.completionMark} />}
                  <div className={styles.landscapeIcon}>
                    {getLandscapeIcon(adjustedIndex)}
                  </div>
                  
                  {/* Tooltip shown on hover/active */}
                  {isActive && (
                    <div className={styles.battleTooltip}>
                      <span className={styles.battleTitle}>{battle.title}</span>
                      <div className={styles.battleDate}>
                        Started: {getStartDate(adjustedIndex)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Right scroll button */}
          <button 
            className={styles.scrollButton} 
            onClick={() => handleScroll('right')}
            disabled={activeIndex >= children.length - 1}
          >
            &gt;
          </button>
        </div>
        
        {/* Selected Battle Preview */}
        {children[activeIndex] && (
          <div className={styles.battlePreview}>
            <h3>{children[activeIndex].title}</h3>
            <div className={styles.battleStats}>
              <div className={styles.battleProgressMini}>
                <div className={styles.progressBarContainer}>
                  {/* Mock progress for demo */}
                  <div 
                    className={styles.progressBarFill} 
                    style={{ 
                      width: activeIndex < Math.floor(children.length * 0.3) ? '100%' : 
                             activeIndex < Math.floor(children.length * 0.5) ? '60%' : 
                             activeIndex < Math.floor(children.length * 0.7) ? '30%' : '0%'
                    }}
                  ></div>
                </div>
                <span>
                  {activeIndex < Math.floor(children.length * 0.3) ? 'Completed' : 
                   activeIndex < Math.floor(children.length * 0.5) ? 'In progress' : 
                   activeIndex < Math.floor(children.length * 0.7) ? 'Just started' : 'Not started'}
                </span>
              </div>
              
              <a 
                href={children[activeIndex].url} 
                className={styles.viewBattleButton}
              >
                View Battle
              </a>
            </div>
          </div>
        )}
      </div>
      {/* Dashboard Modal */}
      <Dashboard 
        isOpen={isDashboardOpen} 
        onClose={closeDashboard}
        
        //battles={battles} // Pass your battles data
      />
    </div>
  );
};

HomePage.defaultProps = {
  title: '',
  children: [],
};

HomePage.propTypes = {
  title: PropTypes.string,
  children: PropTypes.array,
};

export default basePageWrap(HomePage);