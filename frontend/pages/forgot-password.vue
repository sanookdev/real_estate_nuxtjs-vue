<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="mx-auto h-16 w-16 bg-green-100/20 rounded-2xl flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-key" class="text-3xl text-green-400" />
          </div>
          <h2 class="text-3xl font-bold text-white tracking-tight">ลืมรหัสผ่าน</h2>
          <p class="mt-2 text-sm text-gray-400">กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
           <!-- Email Input -->
            <div class="group">
              <label for="email" class="block text-sm font-medium text-gray-300 mb-1 ml-1 group-focus-within:text-green-400 transition-colors">อีเมล</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  required
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-gray-800/80 transition-all duration-300 backdrop-blur-sm"
                  placeholder="example@email.com"
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
                name="i-heroicons-paper-airplane" 
                class="h-5 w-5 text-green-100 group-hover:text-white transition-colors" 
              />
               <UIcon 
                v-else 
                name="i-heroicons-arrow-path" 
                class="h-5 w-5 text-green-100 animate-spin" 
              />
            </span>
             {{ loading ? 'กำลังดำเนินการ...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน' }}
          </button>

           <div class="text-center mt-6">
               <NuxtLink to="/login" class="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1 group">
                 <UIcon name="i-heroicons-arrow-left" class="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
                 กลับสู่หน้าเข้าสู่ระบบ
               </NuxtLink>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await axios.post('http://localhost:5000/api/auth/forgot-password', { email: email.value });
    const { $alertify } = useNuxtApp();
    $alertify.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณแล้ว');
    email.value = '';
  } catch (error) {
    console.error('Error forgot password:', error);
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

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
