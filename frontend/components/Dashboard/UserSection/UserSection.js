// UserSection.js
import React from 'react';
import { FiUser, FiLogOut, FiEdit, FiKey } from 'react-icons/fi';
import styles from './UserSection.module.css';

const UserSection = ({ userName, avatarUrl = null }) => {
  return (
    <div className={styles.userContainer}>
      <div className={styles.userAvatarSection}>
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={`${userName}'s avatar`} 
            className={styles.userAvatar}
          />
        ) : (
          <div className={styles.userIcon}>
            <FiUser className={styles.userIconSvg} />
          </div>
        )}
      </div>
      
      <div className={styles.userInfo}>
        <span className={styles.userName}>{userName || 'User'}</span>
        
        <div className={styles.userActions}>
          <button className={styles.actionButton}>
            <FiEdit className={styles.actionIcon} />
            <span>Edit Profile</span>
          </button>
          
          <button className={styles.actionButton}>
            <FiKey className={styles.actionIcon} />
            <span>Password</span>
          </button>
          
          <button className={styles.logoutButton}>
            <FiLogOut className={styles.actionIcon} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSection;