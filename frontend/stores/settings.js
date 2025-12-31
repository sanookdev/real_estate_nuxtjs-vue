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
                const response = await axios.get('http://localhost:5000/api/settings/public');
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
