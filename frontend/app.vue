<script setup>
import { useSettingsStore } from '~/stores/settings';

const settingsStore = useSettingsStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

// Helper function for favicon URL (supports Supabase)
const getFaviconUrl = () => {
  const favicon = settingsStore.settings?.site_favicon;
  if (!favicon) return '/favicon.ico';
  // If already a full URL (Supabase), use as-is
  if (favicon.startsWith('http://') || favicon.startsWith('https://')) {
    return favicon;
  }
  // Legacy local path
  return `${apiUrl}/uploads/${favicon}`;
};

// Fetch settings on app init
await callOnce(settingsStore.fetchSettings);

useHead({
  title: () => settingsStore.siteName ? `${settingsStore.siteName} - ${settingsStore.settings?.site_description}` : 'Asset Sale - Premium Real Estate',
  meta: [
    { name: 'description', content: () => settingsStore.settings?.site_description || 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ชั้นนำ' }
  ],
  link: [
    { 
      rel: 'icon', 
      type: 'image/x-icon', 
      href: getFaviconUrl
    }
  ]
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
