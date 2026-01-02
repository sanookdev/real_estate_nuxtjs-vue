<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-md mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-lock-closed" class="text-3xl text-green-600" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900">เปลี่ยนรหัสผ่าน</h1>
          <p class="text-gray-500 mt-2">กำหนดรหัสผ่านใหม่เพื่อความปลอดภัย</p>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-6">
          <UFormGroup label="รหัสผ่านปัจจุบัน" name="oldPassword">
            <UInput v-model="form.oldPassword" type="password" placeholder="ระบุรหัสผ่านปัจจุบัน" icon="i-heroicons-key" />
          </UFormGroup>

          <UFormGroup label="รหัสผ่านใหม่" name="newPassword">
            <UInput v-model="form.newPassword" type="password" placeholder="รหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร" icon="i-heroicons-lock-closed" />
          </UFormGroup>

          <UFormGroup label="ยืนยันรหัสผ่านใหม่" name="confirmPassword">
            <UInput v-model="form.confirmPassword" type="password" placeholder="ยืนยันรหัสผ่านใหม่" icon="i-heroicons-lock-closed" />
          </UFormGroup>

          <UButton type="submit" block color="green" size="lg" :loading="loading">
            เปลี่ยนรหัสผ่าน
          </UButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

definePageMeta({
  middleware: ['auth']
});

const handleChangePassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    const { $alertify } = useNuxtApp();
    $alertify.error('รหัสผ่านใหม่ไม่ตรงกัน');
    return;
  }

  if (form.newPassword.length < 6) {
    const { $alertify } = useNuxtApp();
    $alertify.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    return;
  }

  loading.value = true;
  try {
    await axios.post(`${apiUrl}/api/auth/change-password`, 
      {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    );

    const { $alertify } = useNuxtApp();
    $alertify.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
    
    // Clear form
    form.oldPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';
    
    // Optional: Redirect to home or logout
    router.push('/');
  } catch (error) {
    console.error('Error changing password:', error);
    const { $alertify } = useNuxtApp();
    $alertify.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
  } finally {
    loading.value = false;
  }
};
</script>
