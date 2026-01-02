<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
     <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden z-0">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 z-0"></div>
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      
      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
    </div>

    <!-- Glassmorphism Card -->
    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mx-auto h-16 w-16 bg-green-100/20 rounded-2xl flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-lock-closed" class="text-3xl text-green-400" />
          </div>
          <h2 class="text-3xl font-bold text-white tracking-tight">ตั้งรหัสผ่านใหม่</h2>
          <p class="mt-2 text-sm text-gray-400">กำหนดรหัสผ่านใหม่ของคุณ</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
           <!-- New Password Input -->
            <div class="group">
              <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-1 ml-1 group-focus-within:text-green-400 transition-colors">รหัสผ่านใหม่</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-key" class="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  id="newPassword"
                  v-model="newPassword"
                  type="password"
                  required
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                  placeholder="รหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร"
                />
              </div>
            </div>

             <!-- Confirm Password Input -->
            <div class="group">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1 ml-1 group-focus-within:text-green-400 transition-colors">ยืนยันรหัสผ่านใหม่</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  required
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </div>
            </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg"
          >
             <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <UIcon 
                v-if="!loading" 
                name="i-heroicons-check" 
                class="h-5 w-5 text-green-100 group-hover:text-white transition-colors" 
              />
               <UIcon 
                v-else 
                name="i-heroicons-arrow-path" 
                class="h-5 w-5 text-green-100 animate-spin" 
              />
            </span>
             {{ loading ? 'กำลังดำเนินการ...' : 'บันทึกรหัสผ่านใหม่' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const route = useRoute();
const router = useRouter();

const handleSubmit = async () => {
    if (newPassword.value !== confirmPassword.value) {
         const { $alertify } = useNuxtApp();
         $alertify.error('รหัสผ่านไม่ตรงกัน');
         return;
    }

    if (newPassword.value.length < 6) {
        const { $alertify } = useNuxtApp();
        $alertify.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
    }

    const token = route.query.token;
    if (!token) {
        const { $alertify } = useNuxtApp();
        $alertify.error('Link ไม่ถูกต้อง');
        return;
    }

  loading.value = true;
  try {
    await axios.post(`${apiUrl}/api/auth/reset-password`, { 
        token: token,
        newPassword: newPassword.value 
    });
    
    const { $alertify } = useNuxtApp();
    $alertify.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่');
    router.push('/login');

  } catch (error) {
    console.error('Error reset password:', error);
    const { $alertify } = useNuxtApp();
    $alertify.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
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
</style>
