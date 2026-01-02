<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="navbarClass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 relative">
          <!-- Left: Logo -->
          <div class="flex-shrink-0 z-10">
            <button @click="handleLogoClick" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <template v-if="settingsStore.siteLogo">
                <img 
                  :src="getLogoUrl()" 
                  alt="Logo" 
                  class="h-10 w-auto object-contain rounded-md bg-white/10 backdrop-blur-sm p-0.5"
                />
              </template>
              <span v-else class="text-2xl">🏠</span>
              
              <span class="text-xl font-bold" :class="isTransparent ? 'text-white' : 'text-green-700'">
                {{ settingsStore.siteName || 'Default' }}
              </span>
            </button>
          </div>

          <!-- Center: Desktop Nav -->
          <div class="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.to" 
              :to="link.to"
              class="text-sm font-medium transition-colors"
              :class="isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-green-700'"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Right: Auth Buttons -->
          <div class="flex items-center gap-4 z-10">
            <ClientOnly>
              <template v-if="authStore.user">
                <UDropdown :items="userItems" :popper="{ placement: 'bottom-end' }">
                  <UButton color="white" variant="ghost" class="flex items-center bg-transparent hover:bg-transparent gap-2">
                    <UAvatar :alt="authStore.user.username" size="sm" />
                    <span :class="isTransparent ? 'text-white ' : 'text-gray-700'">{{ authStore.user.username }}</span>
                    <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4" :class="isTransparent ? 'text-white' : 'text-gray-500'" />
                  </UButton>

                  <template #account="{ item }">
                    <div class="text-left">
                      <p>Signed in as</p>
                      <p class="truncate font-medium text-gray-900 dark:text-white">
                        {{ item.label }}
                      </p>
                    </div>
                  </template>

                  <template #item="{ item }">
                    <span class="truncate">{{ item.label }}</span>
                    <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                  </template>
                </UDropdown>
              </template>
              <template v-else>
                <div class="flex items-center gap-3">
                  <NuxtLink 
                    to="/login" 
                    class="text-sm font-medium transition-colors"
                    :class="isTransparent ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-green-700'"
                  >
                    เข้าสู่ระบบ
                  </NuxtLink>
                  <NuxtLink 
                    to="/register" 
                    class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5"
                  >
                    สมัครสมาชิก
                  </NuxtLink>
                </div>
              </template>
              <template #fallback>
                <div class="w-24 h-8 bg-gray-200/50 rounded-lg animate-pulse"></div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">🏠 {{ settingsStore.settings.site_name || 'Default' }}</h3>
            <p class="text-gray-400 text-sm">{{ settingsStore.settings.site_description || 'Description Default' }}</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Pages</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><NuxtLink to="/" class="hover:text-white">หน้าแรก</NuxtLink></li>
              <li><NuxtLink to="/listings" class="hover:text-white">ประกาศทั้งหมด</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-white">เกี่ยวกับเรา</NuxtLink></li>
              <li><NuxtLink to="/contacts" class="hover:text-white">ติดต่อเรา</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Contact</h4>
            <p v-if="settingsStore.settings.contact_phone" class="text-sm text-gray-400">📞 {{ settingsStore.settings.contact_phone }}</p>
            <p v-if="settingsStore.settings.contact_email" class="text-sm text-gray-400">📧 {{ settingsStore.settings.contact_email }}</p>
            <p v-if="settingsStore.settings.contact_line" class="text-sm text-gray-400">💬 Line: {{ settingsStore.settings.contact_line }}</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Follow Us</h4>
            <div class="flex gap-4 text-gray-400">
              <a v-if="settingsStore.settings.contact_facebook" :href="settingsStore.settings.contact_facebook" target="_blank" class="hover:text-white"><i class="fab fa-facebook text-xl"></i></a>
              <a v-if="settingsStore.settings.contact_line" :href="`https://line.me/ti/p/~${settingsStore.settings.contact_line.replace('@','')}`" target="_blank" class="hover:text-white"><i class="fab fa-line text-xl"></i></a>
              <!-- Hardcoded Instagram for now as not in settings yet, or remove -->
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {{ new Date().getFullYear() }} {{settingsStore.settings.site_name || 'Default'}}. All rights reserved. Developed by <a href="https://warat-supaporn.vercel.app" target="_blank" class="text-white hover:text-gray-200">Nook Warat Supaporn</a>
        </div>
      </div>
    </footer>
    <!-- Scroll to Top Button -->
    <Transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 z-40 focus:outline-none"
        aria-label="Scroll to top"
      >
        <i class="fas fa-arrow-up"></i>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { useSettingsStore } from '~/stores/settings';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const isDemoMode = config.public.demoMode === 'true' || config.public.demoMode === true;
const route = useRoute();
const router = useRouter();
const isScrolled = ref(false);
const showScrollTop = ref(false);

// Get logo URL helper (handles demo mode)
const getLogoUrl = () => {
  const logo = settingsStore.siteLogo;
  if (isDemoMode && logo && logo.startsWith('demo/')) {
    return `/${logo}`;
  }
  return `${apiUrl}/uploads/${logo}`;
};

const isHomePage = computed(() => route.path === '/');
const isTransparent = computed(() => isHomePage.value && !isScrolled.value);

const navbarClass = computed(() => {
  if (isTransparent.value) {
    return 'bg-transparent';
  }
  return 'bg-white/95 backdrop-blur-md shadow-sm';
});

const navLinks = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'ประกาศทั้งหมด', to: '/listings' },
  { label: 'เกี่ยวกับเรา', to: '/about' },
  { label: 'ติดต่อ', to: '/contacts' }
];

const logout = () => {
  const { $alertify } = useNuxtApp();
  authStore.logout();
  $alertify.success('ออกจากระบบสำเร็จ');
  router.push('/');
};

const userItems = computed(() => [
  [{
    label: authStore.user?.username || 'User Account',
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'Dashboard',
    icon: 'i-heroicons-squares-2x2',
    to: '/dashboard'
  }, {
    label: 'รายการที่ถูกใจ',
    icon: 'i-heroicons-heart',
    to: '/favorites'
  }],
  ...( ['admin', 'superadmin'].includes(authStore.user?.role) ? [
    [{
      label: authStore.user?.role === 'superadmin' ? 'จัดการข้อมูล' : 'จัดการประกาศ',
      icon: authStore.user?.role === 'superadmin' ? 'i-heroicons-clipboard-document-list' : 'i-heroicons-clipboard-document-list',
      to: '/admin'
    }]
  ] : []),
  ...( authStore.user?.role === 'superadmin' ? [
    [{
      label: 'ตั้งค่าระบบ',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/admin/settings'
    }]
  ] : []),
  [{
    label: 'เปลี่ยนรหัสผ่าน',
    icon: 'i-heroicons-key',
    to: '/change-password'
  }],
  [{
    label: 'ออกจากระบบ',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: logout
  }]
]);

const handleLogoClick = async () => {
  await router.push('/');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
  showScrollTop.value = window.scrollY > 400;
};

onMounted(async () => {
  await settingsStore.fetchSettings();
  window.addEventListener('scroll', handleScroll);
  if (typeof window !== 'undefined') {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
