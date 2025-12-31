<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="navbarClass">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <button @click="handleLogoClick" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span class="text-xl font-bold" :class="isTransparent ? 'text-white' : 'text-green-700'">
              🏠 AssetSale
            </span>
          </button>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.to" 
              :to="link.to"
              class="text-sm font-medium transition-colors"
              :class="isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-green-700'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-3">
            <ClientOnly>
              <template v-if="authStore.user">
                <span class="text-sm font-medium" :class="isTransparent ? 'text-white' : 'text-gray-700'">
                  {{ authStore.user.username }}
                </span>
                <NuxtLink 
                  to="/dashboard" 
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dashboard
                </NuxtLink>
                <NuxtLink 
                  v-if="authStore.user.role === 'superadmin'"
                  to="/admin" 
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  จัดการผู้ใช้และระบบ
                </NuxtLink>
                <NuxtLink 
                  v-if="authStore.user.role === 'superadmin'"
                  to="/admin/settings" 
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  ตั้งค่าระบบ
                </NuxtLink>
                <button 
                  @click="logout" 
                  class="text-sm font-medium transition-colors"
                  :class="isTransparent ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-gray-900'"
                >
                  Logout
                </button>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/login" 
                  class="text-sm font-medium transition-colors"
                  :class="isTransparent ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-green-700'"
                >
                  เข้าสู่ระบบ
                </NuxtLink>
                <NuxtLink 
                  to="/register" 
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  สมัครสมาชิก
                </NuxtLink>
              </template>
              <template #fallback>
                <!-- Placeholder while loading auth state -->
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
            <h3 class="text-xl font-bold mb-4">🏠 AssetSale</h3>
            <p class="text-gray-400 text-sm">แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ชั้นนำ</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><NuxtLink to="/" class="hover:text-white">หน้าแรก</NuxtLink></li>
              <li><NuxtLink to="/listings" class="hover:text-white">ประกาศทั้งหมด</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Contact</h4>
            <p class="text-sm text-gray-400">📍 Mr.Warat Supaporn</p>
            <p class="text-sm text-gray-400">📞 +66 6 5352 3666</p>
            <p class="text-sm text-gray-400">📧 nuk.warat@gmail.com</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Follow Us</h4>
            <div class="flex gap-4 text-gray-400">
              <a href="#" class="hover:text-white"><i class="fab fa-facebook text-xl"></i></a>
              <a href="#" class="hover:text-white"><i class="fab fa-instagram text-xl"></i></a>
              <a href="#" class="hover:text-white"><i class="fab fa-line text-xl"></i></a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {{ new Date().getFullYear() }} AssetSale. All rights reserved.
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
import { ref, computed, onMounted, onUnmounted } from 'vue';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isScrolled = ref(false);
const showScrollTop = ref(false);

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

const logout = () => {
  authStore.logout();
  router.push('/');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Force scroll to top on refresh
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
