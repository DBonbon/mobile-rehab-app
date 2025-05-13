// pages/_app.js
import '../index.css';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Ping the backend every 4 minutes to keep it warm
        const pingInterval = setInterval(() => {
            fetch('/api/ping-backend')
                .catch(err => console.error('Error pinging backend:', err));
        }, 240000);
        
        // Ping immediately on page load
        fetch('/api/ping-backend').catch(console.error);
        
        return () => clearInterval(pingInterval);
    }, []);
    
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;