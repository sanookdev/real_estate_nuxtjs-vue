<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 pt-24">
    <UCard class="max-w-md w-full" :ui="{ header: { padding: 'p-4 sm:p-6' }, body: { padding: 'p-4 sm:p-6' }, footer: { padding: 'p-4 sm:p-6' } }">
      <template #header>
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">สมัครสมาชิก</h1>
          <p class="text-gray-500 mt-2">สร้างบัญชีใหม่เพื่อเริ่มต้น</p>
        </div>
      </template>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <UFormGroup label="ชื่อผู้ใช้" name="username">
          <UInput 
            v-model="username" 
            type="text" 
            placeholder="เลือกชื่อผู้ใช้" 
            icon="i-heroicons-user"
            size="lg"
          />
        </UFormGroup>
        
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
            placeholder="สร้างรหัสผ่าน" 
            icon="i-heroicons-lock-closed"
            size="lg"
          />
        </UFormGroup>
        
        <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <UIcon name="i-heroicons-exclamation-circle" />
          {{ error }}
        </div>
        
        <div v-if="success" class="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" />
          {{ success }}
        </div>
        
        <UButton 
          type="submit" 
          block 
          size="lg"
          color="green"
          :loading="loading"
        >
          {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
        </UButton>
      </form>
      
      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          มีบัญชีอยู่แล้ว? 
          <NuxtLink to="/login" class="text-green-600 hover:text-green-700 font-medium">เข้าสู่ระบบ</NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);
const authStore = useAuthStore();

const handleRegister = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';
    try {
        await authStore.register(username.value, email.value, password.value);
        success.value = 'สมัครสมาชิกสำเร็จ! กรุณารอการอนุมัติจากผู้ดูแลระบบ';
        username.value = '';
        email.value = '';
        password.value = '';
    } catch (err) {
        error.value = err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ';
    } finally {
        loading.value = false;
    }
};
</script>
