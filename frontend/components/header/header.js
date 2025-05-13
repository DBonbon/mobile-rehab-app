// components/header/header.js
import React from 'react';
import { FiHome, FiPlus } from 'react-icons/fi';
import Link from 'next/link'; // Use Next.js Link instead of React Router's
import styles from './header.module.css';

const Header = ({ 
  onDashboardOpen,  // Function to open dashboard
  showHomeButton = true,  // Whether to show the home button (hide on homepage)
  pageTitle = ''  // Title of the current page (used for breadcrumb/accessibility)
}) => {
  return (
    <header className={styles.header}>
      {/* Home button - hidden on homepage */}
      {showHomeButton ? (
        <Link href="/" className={styles.homeIcon} aria-label="Go to home page">
          <FiHome size={20} />
        </Link>
      ) : (
        <div className={styles.spacer}></div>
      )}
      
      {/* App name */}
      <h2>Savima</h2>
      
      {/* Dashboard button */}
      <button 
        onClick={onDashboardOpen} 
        className={styles.dashboardButton}
        aria-label="Open Dashboard"
      >
        <FiPlus size={20} />
      </button>
    </header>
  );
};

export default Header;