// containers/ProfilePage/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProfilePage.module.css';

// A basic country selector component
const CountrySelector = ({ value, onChange }) => {
  // This is a simplified version - in a real app, you'd want a more comprehensive list
  const countries = [
    { code: '', name: 'Select a country' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    // Add more countries as needed
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.select}
    >
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};

const ProfilePage = () => {
  const { user, updateProfile, logout, loading, isAuthenticated, deleteAccount } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    date_of_birth: '',
    address1: '',
    address2: '',
    zip_code: '',
    city: '',
    country: '',
    mobile_phone: '',
    additional_information: '',
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        display_name: user.display_name || '',
        date_of_birth: user.date_of_birth || '',
        address1: user.address1 || '',
        address2: user.address2 || '',
        zip_code: user.zip_code || '',
        city: user.city || '',
        country: user.country || '',
        mobile_phone: user.mobile_phone || '',
        additional_information: user.additional_information || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
        
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    // Router will handle redirect in the logout function
  };
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // The logout function in AuthContext will handle the redirect
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    }
  };

  if (loading || !user) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
      
      {error && (
        <div className={styles.error} role="alert">
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className={styles.success} role="alert">
          <span>{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="first_name" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="last_name" className={styles.label}>
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="display_name" className={styles.label}>
            Display Name
          </label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            className={styles.input}
          />
          <p className={styles.helpText}>This will be shown when commenting.</p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="date_of_birth" className={styles.label}>
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="address1" className={styles.label}>
            Address Line 1
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="address2" className={styles.label}>
            Address Line 2
          </label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="city" className={styles.label}>
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="zip_code" className={styles.label}>
              Zip Code
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="country" className={styles.label}>
              Country
            </label>
            <CountrySelector value={formData.country} onChange={handleCountryChange} />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="mobile_phone" className={styles.label}>
            Mobile Phone
          </label>
          <input
            type="tel"
            id="mobile_phone"
            name="mobile_phone"
            placeholder="+1234567890"
            value={formData.mobile_phone}
            onChange={handleChange}
            className={styles.input}
          />
          <p className={styles.helpText}>Format: +[country code][number]</p>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="additional_information" className={styles.label}>
            Additional Information
          </label>
          <textarea
            id="additional_information"
            name="additional_information"
            rows={4}
            value={formData.additional_information}
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>
        
        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
      
      <div className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>Danger Zone</h2>
        
        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className={styles.deleteButton}
          >
            Delete Account
          </button>
        ) : (
          <div className={styles.deleteConfirm}>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className={styles.deleteActions}>
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount} 
                className={styles.confirmDeleteButton}
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;