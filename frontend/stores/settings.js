import { defineStore } from 'pinia';
import axios from 'axios';
import { getPublicSettings } from '~/data/mockSettings';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        siteName: 'Real Estate',
        siteLogo: null,
        settings: {},
        loading: false
    }),
    actions: {
        async fetchSettings() {
            this.loading = true;
            const config = useRuntimeConfig();
            const isDemoMode = config.public.demoMode === 'true' || config.public.demoMode === true;

            // Demo mode: use mock settings
            if (isDemoMode) {
                this.settings = getPublicSettings();
                if (this.settings.site_name) this.siteName = this.settings.site_name;
                if (this.settings.site_logo) this.siteLogo = this.settings.site_logo;
                this.loading = false;
                return;
            }

            // Production mode: use API
            try {
                const apiUrl = config.public.apiUrl;
                const response = await axios.get(`${apiUrl}/api/settings/public`);
                this.settings = response.data;
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
