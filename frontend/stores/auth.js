import { defineStore } from 'pinia';
import axios from 'axios';
import { authenticateDemoUser } from '~/data/mockUsers';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),
    actions: {
        async login(email, password) {
            const config = useRuntimeConfig();
            const isDemoMode = config.public.demoMode === 'true' || config.public.demoMode === true;

            // Demo mode: use mock authentication
            if (isDemoMode) {
                const result = authenticateDemoUser(email, password);
                if (result.success) {
                    this.token = result.token;
                    this.user = result.user;

                    if (process.client) {
                        localStorage.setItem('token', this.token);
                        localStorage.setItem('user', JSON.stringify(this.user));
                    }
                    return true;
                } else {
                    throw new Error(result.message);
                }
            }

            // Production mode: use API
            try {
                const apiUrl = config.public.apiUrl;
                const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
                this.token = response.data.token;
                this.user = response.data.user;

                if (process.client) {
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('user', JSON.stringify(this.user));
                }

                return true;
            } catch (error) {
                console.error('Login failed', error);
                throw error;
            }
        },
        async register(username, email, password) {
            const config = useRuntimeConfig();
            const isDemoMode = config.public.demoMode === 'true' || config.public.demoMode === true;

            // Demo mode: simulate registration success
            if (isDemoMode) {
                console.log('Demo mode: Registration simulated for', email);
                return true;
            }

            // Production mode: use API
            try {
                const apiUrl = config.public.apiUrl;
                await axios.post(`${apiUrl}/api/auth/register`, { username, email, password });
                return true;
            } catch (error) {
                throw error;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            if (process.client) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        },
        initializeAuth() {
            if (process.client) {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
                if (token && user && user !== 'undefined') {
                    try {
                        this.token = token;
                        this.user = JSON.parse(user);
                    } catch (e) {
                        // Invalid JSON in localStorage, clear it
                        console.error('Invalid user data in localStorage, clearing...');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } else {
                    // Clear invalid data
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        }
    }
});
