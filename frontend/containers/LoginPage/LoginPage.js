// containers/LoginPage/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
      // Redirect will happen in the useEffect above
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      
      {error && (
        <div className={styles.error} role="alert">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </div>
      </form>
      
      <div className={styles.footer}>
        <p>
          Don't have an account?{' '}
          <Link href="/register" className={styles.link}>
          Register
        </Link>
        </p>
      </div>
      <div className={styles.links}>
        <Link href="/password-reset" className={styles.link}>
          Forgot Password?
        </Link>
      </div>
    </div>   
  );
};

export default LoginPage;