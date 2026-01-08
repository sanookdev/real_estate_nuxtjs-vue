import { defineStore } from 'pinia';
import axios from 'axios';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        siteName: 'AssetSale',
        siteLogo: null,
        settings: {}, // Store all settings
        loading: false
    }),
    actions: {
        async fetchSettings() {
            this.loading = true;
            try {
                const config = useRuntimeConfig();
                let apiUrl = config.public.apiUrl;

                // If running on server (SSR) and inside Docker, we might need to use the internal container name
                // You can add NUXT_API_URL_INTERNAL to .env or docker-compose
                if (import.meta.server && config.public.apiUrlInternal) {
                     apiUrl = config.public.apiUrlInternal;
                }

                const response = await axios.get(`${apiUrl}/api/settings/public`);
                this.settings = response.data;
                console.log('setting', this.settings)
                if (this.settings.site_name) this.siteName = this.settings.site_name;
                if (this.settings.site_logo) this.siteLogo = this.settings.site_logo;
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                this.loading = false;
            }
        },
        updateLocalSettings(newSettings) {
            this.settings = { ...this.settings, ...newSettings };
            if (newSettings.site_name) this.siteName = newSettings.site_name;
            if (newSettings.site_logo) this.siteLogo = newSettings.site_logo;
        }
    }
});
