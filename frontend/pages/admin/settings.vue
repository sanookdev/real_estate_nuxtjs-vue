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

            <!-- Site Logo Upload -->
            <UFormGroup label="โลโก้เว็บไซต์ (Site Logo)" name="site_logo_upload">
              <div class="flex items-center gap-4">
                <div v-if="settings.site_logo" class="shrink-0">
                  <img :src="`${apiUrl}/uploads/${settings.site_logo}`" alt="Current Logo" class="h-12 w-12 object-contain rounded border border-gray-200 p-1">
                </div>
                <input type="file" @change="onLogoChange" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100">
              </div>
              <p class="text-xs text-gray-500 mt-1">อัปโหลดไฟล์ภาพเพื่อเปลี่ยนโลโก้</p>
            </UFormGroup>
            
             <!-- Site Favicon Upload -->
            <UFormGroup label="ไอคอนเว็บไซต์ (Favicon)" name="site_favicon_upload">
              <div class="flex items-center gap-4">
                <div v-if="settings.site_favicon" class="shrink-0">
                  <img :src="`${apiUrl}/uploads/${settings.site_favicon}`" alt="Current Favicon" class="h-8 w-8 object-contain rounded border border-gray-200 p-1">
                </div>
                <input type="file" @change="onFaviconChange" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100">
              </div>
              <p class="text-xs text-gray-500 mt-1">อัปโหลดไฟล์ภาพไอคอน (.ico, .png) เพื่อเปลี่ยน Favicon</p>
            </UFormGroup>
            
            <UFormGroup label="คำอธิบายเว็บไซต์ (SEO Description)" name="site_description">
              <UTextarea v-model="settings.site_description" placeholder="เว็บขายบ้านและคอนโดที่ดีที่สุด..." />
            </UFormGroup>
          </div>
        </UCard>
        <!-- Content Settings -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="text-green-600" />
              <h2 class="font-bold text-gray-900">จัดการเนื้อหา</h2>
            </div>
          </template>
          
          <UFormGroup label="เกี่ยวกับเรา (About Us)" name="content_about_us">
             <UTextarea 
              v-model="settings.content_about_us" 
              placeholder="ใส่เนื้อหาเกี่ยวกับเราที่นี่..." 
              :rows="10"
              autoresize
            />
            <p class="text-xs text-gray-500 mt-1">สามารถใช้ HTML tag ได้เบื้องต้น</p>
          </UFormGroup>
        </UCard>

        <!-- Contact Settings -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="text-green-600" />
              <h2 class="font-bold text-gray-900">ช่องทางการติดต่อ</h2>
            </div>
          </template>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="Line ID" name="contact_line">
              <UInput v-model="settings.contact_line" placeholder="@yourlineid" icon="i-simple-icons-line" />
            </UFormGroup>

            <UFormGroup label="Facebook Page URL" name="contact_facebook">
              <UInput v-model="settings.contact_facebook" placeholder="https://facebook.com/yourpage" icon="i-simple-icons-facebook" />
            </UFormGroup>

            <UFormGroup label="เบอร์โทรศัพท์" name="contact_phone">
              <UInput v-model="settings.contact_phone" placeholder="081-234-5678" icon="i-heroicons-phone" />
            </UFormGroup>

            <UFormGroup label="อีเมลติดต่อ (Public)" name="contact_email">
              <UInput v-model="settings.contact_email" placeholder="contact@example.com" icon="i-heroicons-envelope" />
            </UFormGroup>
            
            <UFormGroup label="ที่อยู่สำนักงาน" name="contact_address" class="md:col-span-2">
              <UTextarea v-model="settings.contact_address" placeholder="ที่อยู่บริษัท..." :rows="3" />
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
import { useSettingsStore } from '~/stores/settings';
import axios from 'axios';
import { useRouter } from 'vue-router';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const router = useRouter();
const loading = ref(false); // For initial fetch
const saving = ref(false); // For saving settings
const testLoading = ref(false); // For sending test email (renamed from sending to match template)
const logoFile = ref(null);
const faviconFile = ref(null);

const settings = reactive({
    site_name: '',
    site_description: '',
    site_logo: '',
    site_favicon: '',
    auto_approve_users: false,
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    smtp_from: '',
    content_about_us: '',
    contact_line: '',
    contact_facebook: '',
    contact_phone: '',
    contact_email: '',
    contact_address: ''
});

const testEmail = ref('');

onMounted(async () => {
    if (!authStore.user || authStore.user.role !== 'superadmin') {
        router.push('/');
        return;
    }
    await fetchSettings();
});

const fetchSettings = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${apiUrl}/api/settings`, {
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
        const { $alertify } = useNuxtApp();
        $alertify.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
        loading.value = false;
    }
};

const onLogoChange = (event) => {
    logoFile.value = event.target.files[0];
};

const onFaviconChange = (event) => {
    faviconFile.value = event.target.files[0];
};

const saveSettings = async () => {
    saving.value = true;
    try {
        const formData = new FormData();
        
        // Append all text settings
        for (const key in settings) {
            // Convert boolean to string for FormData if backend expects strings
            if (typeof settings[key] === 'boolean') {
                formData.append(key, String(settings[key]));
            } else {
                formData.append(key, settings[key]);
            }
        }
        
        // Append Logo if selected
        if (logoFile.value) {
            formData.append('site_logo', logoFile.value);
        }

        // Append Favicon if selected
        if (faviconFile.value) {
            formData.append('site_favicon', faviconFile.value);
        }

        const response = await axios.put(`${apiUrl}/api/settings`, formData, {
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        // Update local settings with response (which might contain new logo filename)
        if (response.data.settings) {
            Object.assign(settings, response.data.settings);
        }
        
        // Update global store
        await settingsStore.fetchSettings();

        const { $alertify } = useNuxtApp();
        $alertify.success('บันทึกการตั้งค่าเรียบร้อยแล้ว');
        logoFile.value = null; // Reset file input
        faviconFile.value = null;
    } catch (error) {
        console.error('Error saving settings', error);
        const { $alertify } = useNuxtApp();
        $alertify.error('บันทึกไม่สำเร็จ: ' + (error.response?.data?.message || error.message));
    } finally {
        saving.value = false;
    }
};

const sendTestEmail = async () => {
    if (!testEmail.value) {
        const { $alertify } = useNuxtApp();
        $alertify.warning('กรุณากรอกอีเมล');
        return;
    }
    testLoading.value = true;
    try {
        await axios.post(`${apiUrl}/api/settings/test-email`, 
            { email: testEmail.value },
            { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        const { $alertify } = useNuxtApp();
        $alertify.success('ส่งอีเมลทดสอบเรียบร้อยแล้ว');
    } catch (error) {
        const { $alertify } = useNuxtApp();
        $alertify.error('ส่งอีเมลไม่สำเร็จ: ' + (error.response?.data?.message || error.message));
    } finally {
        testLoading.value = false;
    }
};
</script>
