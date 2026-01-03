import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null, // Should initialize from localStorage in a real app (using persist plugin or onMounted)
    }),
    actions: {
        async login(email, password) {
            try {
                const config = useRuntimeConfig();
                const apiUrl = config.public.apiUrl;
                const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
                this.token = response.data.token;
                this.user = response.data.user;

                // Save to local storage (basic implementation)
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
        async register(username, email, phone, password) {
            try {
                const config = useRuntimeConfig();
                const apiUrl = config.public.apiUrl;
                const response = await axios.post(`${apiUrl}/api/auth/register`, { username, email, phone, password });
                return response.data;
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
                if (token && user) {
                    this.token = token;
                    this.user = JSON.parse(user);
                }
            }
        }
    }
});
