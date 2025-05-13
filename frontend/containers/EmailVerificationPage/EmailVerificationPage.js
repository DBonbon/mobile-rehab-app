// containers/EmailVerificationPage/EmailVerificationPage.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import styles from './EmailVerificationPage.module.css';

const EmailVerificationPage = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const { key } = router.query;

  useEffect(() => {
    if (key) {
      verifyEmail(key)
        .then(() => {
          setStatus('success');
        })
        .catch(err => {
          setStatus('error');
          setError(err.response?.data?.detail || 'Failed to verify email. The link may have expired.');
        });
    }
  }, [key, verifyEmail]);

  if (!key) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Invalid verification link. Please check your email for the correct link.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Verification</h1>
      
      {status === 'verifying' && (
        <div className={styles.loading}>
          Verifying your email address...
        </div>
      )}
      
      {status === 'success' && (
        <div className={styles.success}>
          <p>Your email has been successfully verified!</p>
          <p>
            <Link href="/login" className={styles.link}>
              Go to Login
            </Link>
          </p>
        </div>
      )}
      
      {status === 'error' && (
        <div className={styles.error}>
          <p>{error}</p>
          <p>
            <Link href="/login" className={styles.link}>
              Return to Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationPage;