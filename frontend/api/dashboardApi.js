import querystring from 'querystring';
import {
    keysToCamelFromSnake,
    keysToSnakeFromCamel,
} from '../utils/caseconverters';

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return '/wt/api/nextjs';
    }
    return process.env.WAGTAIL_API_URL || 'http://localhost:8081/wt/api/nextjs';
};

/**
 * Fetch all dashboard data (tasks, profile, achievements, etc)
 * @param {Object} options - Fetch options (headers, etc)
 * @returns {Object} - Dashboard data
 */
export async function getDashboardData(options = {}) {
    console.log('📊 dashboardApi: Fetching all dashboard data');
    const baseUrl = getBaseUrl();
    console.log('Using baseUrl for dashboard data:', baseUrl);
    
    const endpoints = [
        { key: 'taskAvailable', path: 'v1/task-instance/available/' },
        { key: 'userTasks', path: 'v1/task-instance/' },
        { key: 'achievements', path: 'v1/achievements/' },
        { key: 'progress', path: 'v1/progress/' },
        { key: 'userProfile', path: 'v1/user-profiles/me/' },
        { key: 'supportMessages', path: 'v1/support-messages/' }
    ];
    
    const dashboardData = {
        taskAvailable: [],
        userTasks: [],
        achievements: [],
        progress: [],
        userProfile: {},
        supportMessages: []
    };
    
    try {
        const results = await Promise.allSettled(
            endpoints.map(async (endpoint) => {
                const apiUrl = `${baseUrl.replace(/\/$/, '')}/${endpoint.path}`;
                console.log(`📡 Fetching ${endpoint.key} from: ${apiUrl}`);
                
                try {
                    const response = await fetch(apiUrl, {
                        headers: {
                            'Content-Type': 'application/json',
                            ...(options?.headers || {})
                        }
                    });
                    
                    console.log(`📊 ${endpoint.key} status:`, response.status);
                    
                    if (!response.ok) {
                        throw new Error(`API error for ${endpoint.key}: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    const camelData = keysToCamelFromSnake(data?.items || data);
                    console.log(`✓ Fetched ${endpoint.key}:`, 
                        Array.isArray(camelData) ? `${camelData.length} items` : 'object');
                    
                    return { 
                        key: endpoint.key, 
                        data: camelData
                    };
                } catch (endpointError) {
                    console.error(`❌ Error fetching ${endpoint.key}:`, endpointError);
                    throw endpointError;
                }
            })
        );
        
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                dashboardData[result.value.key] = result.value.data;
                console.log(`✓ Added ${result.value.key} to dashboard data`);
            } else {
                console.error(`❌ Failed endpoint:`, result.reason);
            }
        });
        
        console.log('📈 Dashboard data complete with keys:', Object.keys(dashboardData));
        return dashboardData;
    } catch (err) {
        console.error('💥 Major error fetching dashboard data:', err);
        return dashboardData;
    }
}


function getCsrfTokenFromCookie() {
    if (typeof document !== 'undefined') {
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === name) return decodeURIComponent(value);
        }
    }
    return '';
}

/**
 * Assign a task instance to the current user
 * @param {number|string} taskInstanceId - The ID of the BattleTaskInstance to assign
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} - The assigned task instance
 */
export async function assignTask(taskInstanceId, options = {}) {
    console.log('🔄 dashboardApi: Assigning task instance', taskInstanceId);
    const baseUrl = getBaseUrl();
    
    try {
        const apiUrl = `${baseUrl.replace(/\/$/, '')}/v1/task-instance/${taskInstanceId}/assign/`;
        console.log('🔗 Assign URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfTokenFromCookie(), // <- this is the key fix
                ...(options?.headers || {})
            }            
        });
        
        console.log('📊 Assign response status:', response.status);
        
        if (!response.ok) {
            let errorDetails = '';
            try {
                const errorData = await response.json();
                errorDetails = JSON.stringify(errorData);
            } catch (e) {
                errorDetails = response.statusText;
            }
            throw new Error(`Task assignment failed: ${response.status} - ${errorDetails}`);
        }
        
        const data = await response.json();
        const assignedTask = keysToCamelFromSnake(data);
        console.log('✅ Task instance assigned successfully:', assignedTask);
        return assignedTask;
    } catch (err) {
        console.error('❌ Error assigning task instance:', err);
        throw err;
    }
}


/**
 * Mark a task instance as completed
 * @param {number|string} taskInstanceId - The ID of the BattleTaskInstance to mark complete
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} - The updated task instance
 */
export async function completeTask(taskInstanceId, options = {}) {
    console.log('✅ dashboardApi: Completing task instance', taskInstanceId);
    const baseUrl = getBaseUrl();

    try {
        const apiUrl = `${baseUrl.replace(/\/$/, '')}/v1/task-instance/${taskInstanceId}/complete/`;
        console.log('🔗 Complete URL:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfTokenFromCookie(), // ensure CSRF token is sent
                ...(options?.headers || {})
            }
        });

        console.log('📊 Complete response status:', response.status);

        if (!response.ok) {
            let errorDetails = '';
            try {
                const errorData = await response.json();
                errorDetails = JSON.stringify(errorData);
            } catch (e) {
                errorDetails = response.statusText;
            }
            throw new Error(`Task completion failed: ${response.status} - ${errorDetails}`);
        }

        const data = await response.json();
        const completedTask = keysToCamelFromSnake(data);
        console.log('✅ Task instance marked as completed:', completedTask);
        return completedTask;
    } catch (err) {
        console.error('❌ Error completing task instance:', err);
        throw err;
    }
}
