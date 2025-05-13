// containers/VerificationSentPage/VerificationSentPage.js
import React from 'react';
import Link from 'next/link';
import styles from './VerificationSentPage.module.css';

const VerificationSentPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verification Email Sent</h1>
      
      <div className={styles.message}>
        <p>We've sent a verification email to your email address.</p>
        <p>Please check your inbox and click on the verification link to complete your registration.</p>
        <p>If you don't see the email, check your spam folder.</p>
      </div>
      
      <div className={styles.links}>
        <Link href="/login" className={styles.link}>
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default VerificationSentPage;