// pages/DashboardPage.js
import React from 'react';
import DashboardToolHolder from '../components/Dashboard/DashboardToolHolder';
import styles from './dashboardPage.module.css';

const DashboardPage = () => {
  // In a real app, you would get the userId from auth context or props
  const mockUserId = 101;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Tool Holder Dashboard</h1>
      </header>
      
      <main className={styles.main}>
        <DashboardToolHolder userId={mockUserId} />
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;