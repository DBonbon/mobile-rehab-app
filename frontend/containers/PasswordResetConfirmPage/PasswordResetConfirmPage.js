// containers/PasswordResetConfirmPage/PasswordResetConfirmPage.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import styles from './PasswordResetConfirmPage.module.css';

const PasswordResetConfirmPage = () => {
  const [passwords, setPasswords] = useState({
    new_password1: '',
    new_password2: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { confirmPasswordReset, loading } = useAuth();
  const router = useRouter();
  const { uid, token } = router.query;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (passwords.new_password1 !== passwords.new_password2) {
      setError('Passwords do not match');
      return;
    }
    
    if (!uid || !token) {
      setError('Invalid password reset link');
      return;
    }
    
    try {
      await confirmPasswordReset(
        uid, 
        token, 
        passwords.new_password1, 
        passwords.new_password2
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed. The link may have expired.');
    }
  };

  if (!uid || !token) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Invalid password reset link. Please request a new one.
        </div>
        <Link href="/password-reset" className={styles.link}>
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Set New Password</h1>
      
      {error && (
        <div className={styles.error} role="alert">
          <span>{error}</span>
        </div>
      )}
      
      {success ? (
        <div className={styles.success}>
          <p>Your password has been reset successfully!</p>
          <p>
            <Link href="/login" className={styles.link}>
              Login with your new password
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="new_password1" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="new_password1"
              name="new_password1"
              value={passwords.new_password1}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="new_password2" className={styles.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              id="new_password2"
              name="new_password2"
              value={passwords.new_password2}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordResetConfirmPage;