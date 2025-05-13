// ./components/Avatars/TriangleAvatar/TriangleAvatar.js
import React from 'react';
import styles from './TriangleAvatar.module.css';

const TriangleAvatar = () => {
  console.log("TriangleAvatar component rendered");
  
  return (
    <div className={styles.avatarContainer}>
      <div className={styles.triangle} />
    </div>
  );
};

export default TriangleAvatar;