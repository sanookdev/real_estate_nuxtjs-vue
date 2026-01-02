<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 py-24 px-4 sm:px-6 lg:px-8">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden z-0">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 z-0"></div>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-32 left-1/3 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      
      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
    </div>

    <!-- Glassmorphism Card -->
    <div class="max-w-md w-full space-y-8 relative z-10 mx-4 sm:mx-auto">
      <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl transform transition-all duration-500 hover:shadow-green-500/10 hover:border-white/30">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mx-auto h-16 w-16 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300 mb-4">
            <UIcon name="i-heroicons-home-modern" class="text-3xl text-white" />
          </div>
          <h2 class="text-3xl font-bold text-white tracking-tight">ยินดีต้อนรับกลับมา</h2>
          <p class="mt-2 text-sm text-gray-400">เข้าสู่ระบบเพื่อจัดการอสังหาริมทรัพย์ของคุณ</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-5">
            <!-- Email Input -->
            <div class="group">
              <label for="email" class="block text-sm font-medium text-gray-300 mb-1 ml-1 group-focus-within:text-green-400 transition-colors">ชื่อผู้ใช้ หรือ อีเมล</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-user" class="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="text"
                  required
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                  placeholder="กรอกชื่อผู้ใช้ หรือ อีเมล"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="group">
              <label for="password" class="block text-sm font-medium text-gray-300 mb-1 ml-1 group-focus-within:text-green-400 transition-colors">รหัสผ่าน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-lock-closed" class="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  type="password"
                  required
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
            </div>
          </div>
            <div class="flex justify-end mt-1">
              <NuxtLink to="/forgot-password" class="text-sm text-green-400 hover:text-green-300 transition-colors">
                ลืมรหัสผ่าน?
              </NuxtLink>
            </div>

          <!-- Error Message -->
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <UIcon name="i-heroicons-exclamation-circle" class="h-5 w-5 text-red-400 shrink-0" />
              <p class="text-sm text-red-200">{{ error }}</p>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <UIcon 
                v-if="!loading" 
                name="i-heroicons-arrow-right-on-rectangle" 
                class="h-5 w-5 text-green-100 group-hover:text-white transition-colors" 
              />
              <UIcon 
                v-else 
                name="i-heroicons-arrow-path" 
                class="h-5 w-5 text-green-100 animate-spin" 
              />
            </span>
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>

          <!-- Links -->
          <div class="text-center mt-6 space-y-2">
            <p class="text-sm text-gray-400">
              ยังไม่มีบัญชี? 
              <NuxtLink to="/register" class="font-medium text-green-400 hover:text-green-300 transition-colors relative group">
                <span class="relative z-10">สมัครสมาชิก</span>
                <span class="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </NuxtLink>
            </p>
            <div class="pt-2">
               <NuxtLink to="/" class="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1 group">
                 <UIcon name="i-heroicons-arrow-left" class="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
                 กลับสู่หน้าหลัก
               </NuxtLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    try {
        const { $alertify } = useNuxtApp();
        await authStore.login(email.value, password.value);
        $alertify.success('เข้าสู่ระบบสำเร็จ');
        router.push('/');
    } catch (err) {
        error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
