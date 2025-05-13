// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create the context with default values
export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  resetPassword: async () => {},
  confirmPasswordReset: async () => {},
  verifyEmail: async () => {},
  checkEmailVerificationStatus: async () => {},
  deleteAccount: async () => {},
});

// API URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Changed from true to false

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          
          // Set axios default headers
          axios.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
        } catch (parseError) {
          console.error("Invalid user data in localStorage:", parseError);
          // Clear corrupted data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // In case localStorage is completely inaccessible
    }
  }, []);

  // Setup CSRF token handling
  useEffect(() => {
    const csrftoken = Cookies.get('csrftoken');
    if (csrftoken) {
      console.log('CSRF token found in cookies, setting in axios defaults');
      axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
    } else {
      console.log('No CSRF token found in cookies');
    }
    
    // Enable withCredentials for all requests to support CSRF cookies
    axios.defaults.withCredentials = true;
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/wt/api/auth/login/`, {
        username,
        password,
      });
      
      const { token, user } = response.data;
      
      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setToken(token);
      setUser(user);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/wt/api/auth/register/`, userData);
      
      const { token, user } = response.data;
      
      // Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setToken(token);
      setUser(user);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    const router = useRouter(); // ✅ Use it *inside* the function where it's called

    try {
      if (token) {
        await axios.post(`${API_URL}/wt/api/auth/logout/`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      router.push('/login'); // still works, now valid
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/wt/api/auth/user/update/`, userData);
      
      // Update stored user data
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    console.log('⭐ resetPassword called with email:', email);
    console.log('⭐ API_URL:', API_URL);
    const fullUrl = `${API_URL}/wt/api/auth/password/reset/`;
    console.log('⭐ Full request URL:', fullUrl);
    
    try {
      setLoading(true);
      
      // Get the CSRF token from cookies
      const csrftoken = Cookies.get('csrftoken');
      console.log('⭐ CSRF token:', csrftoken ? 'found' : 'not found');
      
      // Create a config object with CSRF token and credentials
      const config = {
        headers: {
          'X-CSRFToken': csrftoken
        },
        withCredentials: true
      };
      
      console.log('⭐ Making POST request with config:', config);
      const response = await axios.post(fullUrl, { email }, config);
      
      console.log('⭐ Password reset response received:', response.status);
      console.log('⭐ Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Password reset request error:', error);
      
      if (error.response) {
        console.error('❌ Error response data:', error.response.data);
        console.error('❌ Error response status:', error.response.status);
        console.error('❌ Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('❌ No response received. Request:', error.request);
      } else {
        console.error('❌ Error message:', error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Confirm password reset function
  const confirmPasswordReset = async (uid, token, new_password1, new_password2) => {
    try {
      setLoading(true);
      // Get the CSRF token from cookies
      const csrftoken = Cookies.get('csrftoken');
      
      // Create a config object with CSRF token
      const config = {
        headers: {
          'X-CSRFToken': csrftoken
        },
        withCredentials: true
      };
      
      const response = await axios.post(`${API_URL}/wt/api/auth/password/reset/confirm/`, {
        uid, token, new_password1, new_password2
      }, config);
      
      return response.data;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email verification function
  const verifyEmail = async (key) => {
    try {
      setLoading(true);
      // Get the CSRF token from cookies
      const csrftoken = Cookies.get('csrftoken');
      
      // Create a config object with CSRF token
      const config = {
        headers: {
          'X-CSRFToken': csrftoken
        },
        withCredentials: true
      };
      
      const response = await axios.post(`${API_URL}/wt/api/auth/email/verify/`, { key }, config);
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check email verification status
  const checkEmailVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/wt/api/auth/email/verify/status/`);
      return response.data;
    } catch (error) {
      console.error('Email verification status check error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      setLoading(true);
      // Get the CSRF token from cookies
      const csrftoken = Cookies.get('csrftoken');
      
      // Create a config object with CSRF token
      const config = {
        headers: {
          'X-CSRFToken': csrftoken
        },
        withCredentials: true
      };
      
      await axios.delete(`${API_URL}/wt/api/auth/user/delete/`, config);
      logout(); // Log out after successful deletion
      return { success: true };
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        confirmPasswordReset,
        verifyEmail,
        checkEmailVerificationStatus,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => React.useContext(AuthContext);