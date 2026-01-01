<script setup>
import { useSettingsStore } from '~/stores/settings';

const settingsStore = useSettingsStore();

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
      href: () => settingsStore.settings?.site_favicon ? `http://localhost:5000/uploads/${settingsStore.settings.site_favicon}` : '/favicon.ico' 
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
