<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 pt-24">
    <UCard class="max-w-md w-full text-center" :ui="{ header: { padding: 'p-4 sm:p-6' }, body: { padding: 'p-4 sm:p-6' }, footer: { padding: 'p-4 sm:p-6' } }">
      <template #header>
        <div class="flex justify-center mb-4">
          <div v-if="loading" class="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div v-else-if="success" class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
             <UIcon name="i-heroicons-check" class="text-green-600 text-2xl" />
          </div>
          <div v-else class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
             <UIcon name="i-heroicons-x-mark" class="text-red-600 text-2xl" />
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ loading ? 'กำลังตรวจสอบ...' : (success ? 'ยืนยันอีเมลสำเร็จ' : 'ยืนยันอีเมลไม่สำเร็จ') }}
        </h1>
      </template>

      <p class="text-gray-500 mb-6">
        {{ message }}
      </p>

      <div v-if="!loading">
        <UButton to="/login" color="green" block>
          ไปที่หน้าเข้าสู่ระบบ
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


const route = useRoute();
const loading = ref(true);
const success = ref(false);
const message = ref('กรุณารอสักครู่...');

onMounted(async () => {
  const token = route.query.token;
  if (!token) {
    loading.value = false;
    success.value = false;
    message.value = 'ไม่พบ Token สำหรับยืนยันตัวตน';
    return;
  }

  try {
    await axios.post(`${apiUrl}/api/auth/verify-email`, { token });
    success.value = true;
    message.value = 'อีเมลของคุณได้รับการยืนยันแล้ว คุณสามารถเข้าสู่ระบบได้ทันที';
  } catch (error) {
    success.value = false;
    message.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการยืนยันอีเมล';
  } finally {
    loading.value = false;
  }
});
</script>
