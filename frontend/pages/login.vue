<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 pt-24">
    <UCard class="max-w-md w-full" :ui="{ header: { padding: 'p-4 sm:p-6' }, body: { padding: 'p-4 sm:p-6' }, footer: { padding: 'p-4 sm:p-6' } }">
      <template #header>
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
          <p class="text-gray-500 mt-2">ยินดีต้อนรับกลับมา</p>
        </div>
      </template>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <UFormGroup label="อีเมล" name="email">
          <UInput 
            v-model="email" 
            type="email" 
            placeholder="กรอกอีเมลของคุณ" 
            icon="i-heroicons-envelope"
            size="lg"
          />
        </UFormGroup>
        
        <UFormGroup label="รหัสผ่าน" name="password">
          <UInput 
            v-model="password" 
            type="password" 
            placeholder="กรอกรหัสผ่าน" 
            icon="i-heroicons-lock-closed"
            size="lg"
          />
        </UFormGroup>
        
        <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <UIcon name="i-heroicons-exclamation-circle" />
          {{ error }}
        </div>
        
        <UButton 
          type="submit" 
          block 
          size="lg"
          color="green"
          :loading="loading"
        >
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </UButton>
      </form>
      
      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          ยังไม่มีบัญชี? 
          <NuxtLink to="/register" class="text-green-600 hover:text-green-700 font-medium">สมัครสมาชิก</NuxtLink>
        </p>
      </div>
    </UCard>
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
        await authStore.login(email.value, password.value);
        router.push('/');
    } catch (err) {
        error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ';
    } finally {
        loading.value = false;
    }
};
</script>
