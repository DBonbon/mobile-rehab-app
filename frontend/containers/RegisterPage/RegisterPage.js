// containers/RegisterPage/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import styles from './RegisterPage.module.css';

const ROLES = [
  { value: 'regular_user', label: 'Regular User' },
  { value: 'collaborator', label: 'Collaborator' }
];

const RegisterPage = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
    display_name: '',
    role: 'regular_user',
    additional_information: ''
  });

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(formData);
      // Redirect will happen in useEffect
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        // Format API errors into a readable message
        const errorMessages = Object.entries(errorData)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        setError(errorMessages || 'Registration failed.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create an Account</h1>
      
      {error && (
        <div className={styles.error} role="alert">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="password1" className={styles.label}>
              Password*
            </label>
            <input
              type="password"
              id="password1"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password2" className={styles.label}>
              Confirm Password*
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="first_name" className={styles.label}>
              First Name*
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="last_name" className={styles.label}>
              Last Name*
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="display_name" className={styles.label}>
            Display Name*
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <p className={styles.helpText}>This will be shown when commenting.</p>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Role*</label>
          <div className={styles.radioGroup}>
            {ROLES.map((role) => (
              <div key={role.value} className={styles.radioOption}>
                <input
                  id={`role-${role.value}`}
                  name="role"
                  type="radio"
                  value={role.value}
                  checked={formData.role === role.value}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <label htmlFor={`role-${role.value}`} className={styles.radioLabel}>
                  {role.label}
                </label>
              </div>
            ))}
          </div>
          <p className={styles.helpText}>Click "Collaborator" if you wish to join us.</p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="additional_information" className={styles.label}>
            Additional Information*
          </label>
          <textarea
            id="additional_information"
            name="additional_information"
            value={formData.additional_information}
            onChange={handleChange}
            rows={3}
            className={styles.textarea}
            required
          />
          <p className={styles.helpText}>Briefly, tell us why do you want to join us. It helps us to filter bots.</p>
        </div>
        
        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      
      <div className={styles.footer}>
        <p>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

