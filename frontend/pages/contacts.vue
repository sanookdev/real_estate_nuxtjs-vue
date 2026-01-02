<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <!-- Glassmorphism Hero Section -->
    <div class="relative py-20 overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
        <div class="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div class="absolute top-1/3 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <!-- Glass Card -->
      <div class="relative max-w-4xl mx-auto px-4 text-center">
        <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
          <div 
            class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6 opacity-0 translate-y-4 transition-all duration-700"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            <UIcon name="i-heroicons-chat-bubble-left-right" class="text-blue-300" />
            <span class="text-blue-200 text-sm font-medium tracking-wider uppercase">Get In Touch</span>
          </div>
          <h1 
            class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight opacity-0 translate-y-4 transition-all duration-700 delay-100"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            ติดต่อ<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-200">เรา</span>
          </h1>
          <p 
            class="text-blue-100/80 text-lg max-w-xl mx-auto opacity-0 translate-y-4 transition-all duration-700 delay-200"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            เราพร้อมดูแลและให้คำปรึกษาตลอด 24 ชั่วโมง
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Info -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">ช่องทางการติดต่อ</h2>
          
          <div class="space-y-6">
            <UCard v-if="settingsStore.settings.contact_address">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-green-100 rounded-lg text-green-600">
                  <UIcon name="i-heroicons-map-pin" class="text-2xl" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">ที่อยู่สำนักงาน</h3>
                  <p class="text-gray-600 whitespace-pre-line">{{ settingsStore.settings.contact_address }}</p>
                </div>
              </div>
            </UCard>

            <UCard v-if="settingsStore.settings.contact_phone">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-green-100 rounded-lg text-green-600">
                  <UIcon name="i-heroicons-phone" class="text-2xl" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">เบอร์โทรศัพท์</h3>
                  <p class="text-gray-600">{{ settingsStore.settings.contact_phone }}</p>
                </div>
              </div>
            </UCard>

            <UCard v-if="settingsStore.settings.contact_email">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-green-100 rounded-lg text-green-600">
                  <UIcon name="i-heroicons-envelope" class="text-2xl" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">อีเมล</h3>
                  <p class="text-gray-600">{{ settingsStore.settings.contact_email }}</p>
                </div>
              </div>
            </UCard>
          </div>

          <div class="mt-8 flex gap-4 justify-center lg:justify-start">
             <UButton 
               v-if="settingsStore.settings.contact_facebook" 
               class="bg-[#1877F2] hover:bg-[#166fe5] text-white border-none shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1"
               size="lg"
               icon="i-simple-icons-facebook" 
               :to="settingsStore.settings.contact_facebook" 
               target="_blank"
             >
               Facebook Page
             </UButton>
             <UButton 
               v-if="settingsStore.settings.contact_line" 
               class="bg-[#06C755] hover:bg-[#05b34c] text-white border-none shadow-lg shadow-green-500/30 transition-all duration-300 hover:-translate-y-1"
               size="lg"
               icon="i-simple-icons-line" 
               :to="`https://line.me/ti/p/~${settingsStore.settings.contact_line.replace('@','')}`" 
               target="_blank"
             >
               Add Line Friend
             </UButton>
          </div>
        </div>

        <!-- Contact Form -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">ส่งข้อความถึงเรา</h3>
              <div class="flex items-center gap-1 text-xs text-gray-400">
                <UIcon name="i-heroicons-shield-check" class="text-green-500" />
                <span>Protected by reCAPTCHA</span>
              </div>
            </div>
          </template>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="ชื่อ" name="name" required>
                <UInput v-model="form.name" placeholder="ชื่อจริง" icon="i-heroicons-user" />
              </UFormGroup>
              <UFormGroup label="นามสกุล" name="surname">
                <UInput v-model="form.surname" placeholder="นามสกุล" />
              </UFormGroup>
            </div>

            <UFormGroup label="อีเมล" name="email" required>
              <UInput v-model="form.email" type="email" placeholder="name@example.com" icon="i-heroicons-envelope" />
            </UFormGroup>

            <UFormGroup label="เบอร์โทรศัพท์" name="phone">
              <UInput v-model="form.phone" type="tel" placeholder="08x-xxx-xxxx" icon="i-heroicons-phone" />
            </UFormGroup>

            <UFormGroup label="หัวข้อที่ติดต่อ" name="subject">
              <USelect v-model="form.subject" :options="subjects" placeholder="เลือกหัวข้อ..." />
            </UFormGroup>

            <UFormGroup label="ข้อความ" name="message" required>
              <UTextarea v-model="form.message" placeholder="รายละเอียด..." :rows="4" />
            </UFormGroup>

            <!-- Honeypot Field (Hidden from humans, bots will fill it) -->
            <div class="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
              <label for="website">Website</label>
              <input 
                type="text" 
                id="website" 
                name="website" 
                v-model="honeypot" 
                autocomplete="off" 
                tabindex="-1"
              />
            </div>

            <!-- Google reCAPTCHA v2 Checkbox -->
            <UFormGroup label="ตรวจสอบว่าคุณไม่ใช่หุ่นยนต์" name="recaptcha" required>
              <div class="flex justify-center">
                <div 
                  ref="recaptchaContainer" 
                  class="g-recaptcha" 
                  :data-sitekey="recaptchaSiteKey"
                  data-callback="onRecaptchaVerify"
                  data-expired-callback="onRecaptchaExpired"
                ></div>
              </div>
              <p v-if="recaptchaError" class="text-red-500 text-xs mt-1 text-center">{{ recaptchaError }}</p>
            </UFormGroup>

            <div v-if="success" class="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
              <UIcon name="i-heroicons-check-circle" />
              {{ success }}
            </div>

            <div v-if="error" class="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <UIcon name="i-heroicons-exclamation-circle" />
              {{ error }}
            </div>

            <UButton type="submit" block size="lg" color="green" :loading="loading" :disabled="!recaptchaToken">
              <UIcon name="i-heroicons-paper-airplane" class="mr-2" />
              ส่งข้อความ
            </UButton>
          </form>
        </UCard>
      </div>
    </div>
    <!-- Map Section -->
    <div class="h-96 w-full bg-gray-200 mt-12">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.795995536128!2d100.558778!3d13.730769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQzJzUxLjAiTiAxMDDCsDMzJzMxLjUiRQ!5e0!3m2!1sen!2sth!4v1634567890123!5m2!1sen!2sth" 
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useSettingsStore } from '~/stores/settings';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const recaptchaSiteKey = config.public.recaptchaSiteKey;

const settingsStore = useSettingsStore();
const mounted = ref(false);
const recaptchaContainer = ref(null);

// Bot Protection Variables
const honeypot = ref('');
const recaptchaToken = ref('');
const recaptchaError = ref('');

// Define global callbacks for reCAPTCHA
if (process.client) {
  window.onRecaptchaVerify = (token) => {
    recaptchaToken.value = token;
    recaptchaError.value = '';
  };
  
  window.onRecaptchaExpired = () => {
    recaptchaToken.value = '';
    recaptchaError.value = 'รหัส reCAPTCHA หมดอายุ กรุณาลองใหม่';
  };
}

// Load reCAPTCHA script
const loadRecaptchaScript = () => {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="recaptcha"]')) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  await settingsStore.fetchSettings();
  
  // Load reCAPTCHA
  if (recaptchaSiteKey) {
    try {
      await loadRecaptchaScript();
    } catch (e) {
      console.error('Failed to load reCAPTCHA:', e);
    }
  }
  
  // Trigger fade animation
  setTimeout(() => {
    mounted.value = true;
  }, 100);
});

onUnmounted(() => {
  // Cleanup global callbacks
  if (process.client) {
    delete window.onRecaptchaVerify;
    delete window.onRecaptchaExpired;
  }
});

const loading = ref(false);
const success = ref('');
const error = ref('');

const subjects = [
  'สนใจซื้ออสังหาริมทรัพย์',
  'ต้องการฝากขาย',
  'สอบถามข้อมูลเพิ่มเติม',
  'แจ้งปัญหาการใช้งาน',
  'อื่นๆ'
];

const form = reactive({
  name: '',
  surname: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
});

const resetRecaptcha = () => {
  if (process.client && window.grecaptcha) {
    window.grecaptcha.reset();
    recaptchaToken.value = '';
  }
};

const handleSubmit = async () => {
  loading.value = true;
  success.value = '';
  error.value = '';
  
  // === BOT PROTECTION CHECKS ===
  
  // 1. Honeypot Check
  if (honeypot.value) {
    console.warn('Bot detected: Honeypot field filled');
    success.value = 'ส่งข้อความเรียบร้อยแล้ว!';
    loading.value = false;
    return;
  }
  
  // 2. Basic Validation
  if (!form.name || !form.email || !form.message) {
    error.value = 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, อีเมล, ข้อความ)';
    loading.value = false;
    return;
  }
  
  // 3. reCAPTCHA Check
  if (!recaptchaToken.value) {
    recaptchaError.value = 'กรุณาคลิกยืนยันว่าคุณไม่ใช่หุ่นยนต์';
    loading.value = false;
    return;
  }
  
  // === END BOT PROTECTION ===
  
  try {
    await axios.post(`${apiUrl}/api/contact`, {
      ...form,
      recaptchaToken: recaptchaToken.value
    });
    success.value = 'ส่งข้อความเรียบร้อยแล้ว! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด';
    // Clear form
    Object.keys(form).forEach(key => form[key] = '');
    resetRecaptcha();
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งข้อความ';
    resetRecaptcha();
  } finally {
    loading.value = false;
  }
};
</script>
