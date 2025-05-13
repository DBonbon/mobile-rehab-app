// containers/PasswordResetPage/PasswordResetPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import styles from './PasswordResetPage.module.css';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword, loading } = useAuth();

  // Log component mounting
  useEffect(() => {
    console.log('PasswordResetPage component mounted');
    console.log('AuthContext loaded:', !!resetPassword);
    return () => {
      console.log('PasswordResetPage component unmounted');
    };
  }, [resetPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with email:', email);
    setError('');
    setSuccess(false);
   
    try {
      console.log('Calling resetPassword function...');
      await resetPassword(email);
      console.log('resetPassword completed successfully');
      setSuccess(true);
    } catch (err) {
      console.error('Error in resetPassword:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError('Failed to request password reset. Please try again.');
    }
  };
  
  console.log('Rendering PasswordResetPage component, success:', success, 'error:', error);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reset Password</h1>
     
      {error && (
        <div className={styles.error} role="alert">
          <span>{error}</span>
        </div>
      )}
     
      {success ? (
        <div className={styles.success}>
          <p>If an account exists with email {email}, you will receive an email with instructions to reset your password.</p>
          <p>
            <Link href="/login" className={styles.link}>
              Return to login
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                console.log('Email input changed:', e.target.value);
                setEmail(e.target.value);
              }}
              className={styles.input}
              required
            />
          </div>
         
          <div className={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              className={styles.button}
              onClick={() => console.log('Reset button clicked')}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </div>
         
          <div className={styles.links}>
            <Link href="/login" className={styles.link}>
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordResetPage;