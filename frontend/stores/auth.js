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
                // Assume backend running on localhost:5000
                const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
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
        async register(username, email, password) {
            try {
                await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
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
                if (token && user) {
                    this.token = token;
                    this.user = JSON.parse(user);
                }
            }
        }
    }
});
