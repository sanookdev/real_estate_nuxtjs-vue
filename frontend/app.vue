<script setup>
import { useSettingsStore } from '~/stores/settings';

const settingsStore = useSettingsStore();

useHead({
  title: () => settingsStore.siteName ? `${settingsStore.siteName} - ${settingsStore.settings?.site_description}` : 'Asset Sale - Premium Real Estate',
  meta: [
    { name: 'description', content: () => settingsStore.settings?.site_description || 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ชั้นนำ' }
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
