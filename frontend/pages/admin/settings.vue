<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-cog-6-tooth" class="text-green-600 text-2xl" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
          <p class="text-gray-500">จัดการข้อมูลเว็บไซต์และระบบ</p>
        </div>
      </div>
      
      <form @submit.prevent="saveSettings" class="space-y-6">
        <!-- General Settings -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-globe-alt" class="text-green-600" />
              <h2 class="font-bold text-gray-900">ข้อมูลเว็บไซต์</h2>
            </div>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="ชื่อเว็บไซต์" name="site_name">
              <UInput v-model="settings.site_name" placeholder="Asset Sale" icon="i-heroicons-computer-desktop" />
            </UFormGroup>

            <UFormGroup label="คำอธิบายเว็บไซต์ (SEO Description)" name="site_description">
              <UTextarea v-model="settings.site_description" placeholder="เว็บขายบ้านและคอนโดที่ดีที่สุด..." />
            </UFormGroup>
            
            <UFormGroup label="โลโก้ URL" name="site_logo">
              <UInput v-model="settings.site_logo" placeholder="https://example.com/logo.png" icon="i-heroicons-photo" />
            </UFormGroup>
          </div>
        </UCard>

        <!-- User Settings -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="text-green-600" />
              <h2 class="font-bold text-gray-900">ตั้งค่าสมาชิก</h2>
            </div>
          </template>
          
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">อนุมัติสมาชิกอัตโนมัติ</div>
              <div class="text-sm text-gray-500">หากเปิดใช้งาน สมาชิกใหม่จะสามารถเข้าใช้งานได้ทันทีโดยไม่ต้องรออนุมัติ</div>
            </div>
            <UContentSwitcher v-if="false" /> <!-- Placeholder to avoid import error if component missing, using Toggle instead -->
            <UToggle v-model="settings.auto_approve_users" color="green" />
          </div>
        </UCard>

        <!-- SMTP Settings -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="text-green-600" />
              <h2 class="font-bold text-gray-900">ตั้งค่า Email (SMTP)</h2>
            </div>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <UFormGroup label="SMTP Host" name="smtp_host">
              <UInput v-model="settings.smtp_host" placeholder="smtp.gmail.com" />
            </UFormGroup>
            
            <UFormGroup label="SMTP Port" name="smtp_port">
              <UInput v-model="settings.smtp_port" placeholder="587" />
            </UFormGroup>
            
            <UFormGroup label="SMTP User/Email" name="smtp_user">
              <UInput v-model="settings.smtp_user" placeholder="email@example.com" />
            </UFormGroup>
            
            <UFormGroup label="SMTP Password" name="smtp_pass">
              <UInput v-model="settings.smtp_pass" type="password" placeholder="••••••••" />
              <template #help>
                <span class="text-xs text-gray-500">สำหรับ Gmail ให้ใช้ App Password</span>
              </template>
            </UFormGroup>

            <UFormGroup label="Email ผู้ส่ง (From)" name="smtp_from">
              <UInput v-model="settings.smtp_from" placeholder="noreply@example.com" />
            </UFormGroup>
          </div>

          <UDivider label="ทดสอบการส่ง" class="mb-6" />

          <div class="flex gap-4">
            <UInput v-model="testEmail" placeholder="ระบุอีเมลสำหรับทดสอบ" class="flex-1" />
            <UButton 
              color="gray" 
              variant="solid" 
              @click="sendTestEmail" 
              :loading="testLoading"
              icon="i-heroicons-paper-airplane"
            >
              ส่งทดสอบ
            </UButton>
          </div>
        </UCard>

        <!-- Actions -->
        <div class="flex justify-end gap-3 sticky bottom-4 z-10 bg-gray-50/90 backdrop-blur p-4 rounded-xl border border-gray-200 shadow-sm">
          <UButton to="/admin" color="gray" variant="ghost">ยกเลิก</UButton>
          <UButton type="submit" color="green" size="lg" :loading="loading" icon="i-heroicons-check">บันทึกการตั้งค่า</UButton>
        </div>
      </form>
    </div>
    
    <UNotifications />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const testLoading = ref(false);
const testEmail = ref('');
const toast = useToast();

const settings = reactive({
    site_name: '',
    site_description: '',
    site_logo: '',
    auto_approve_users: false,
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    smtp_from: ''
});

onMounted(async () => {
    if (!authStore.user || authStore.user.role !== 'superadmin') {
        router.push('/');
        return;
    }
    await fetchSettings();
});

const fetchSettings = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/settings', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        
        // Convert 'true'/'false' strings to boolean for toggle
        const data = response.data;
        if (data.auto_approve_users === 'true' || data.auto_approve_users === true) {
            data.auto_approve_users = true;
        } else {
            data.auto_approve_users = false;
        }
        
        Object.assign(settings, data);
    } catch (error) {
        console.error('Error fetching settings', error);
        toast.add({ title: 'เกิดข้อผิดพลาดในการโหลดข้อมูล', color: 'red' });
    }
};

const saveSettings = async () => {
    loading.value = true;
    try {
        // Convert boolean to string if backend expects strings (Settings usually stored as text)
        const payload = { ...settings };
        payload.auto_approve_users = String(payload.auto_approve_users);

        await axios.put('http://localhost:5000/api/settings', payload, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        toast.add({ title: 'บันทึกการตั้งค่าเรียบร้อยแล้ว', color: 'green', icon: 'i-heroicons-check-circle' });
    } catch (error) {
        toast.add({ title: 'บันทึกไม่สำเร็จ', description: error.message, color: 'red' });
    } finally {
        loading.value = false;
    }
};

const sendTestEmail = async () => {
    if (!testEmail.value) {
        toast.add({ title: 'กรุณากรอกอีเมล', color: 'yellow' });
        return;
    }
    testLoading.value = true;
    try {
        await axios.post('http://localhost:5000/api/settings/test-email', 
            { email: testEmail.value },
            { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        toast.add({ title: 'ส่งอีเมลทดสอบเรียบร้อยแล้ว', color: 'green' });
    } catch (error) {
        toast.add({ title: 'ส่งอีเมลไม่สำเร็จ', description: error.response?.data?.message || error.message, color: 'red' });
    } finally {
        testLoading.value = false;
    }
};
</script>
