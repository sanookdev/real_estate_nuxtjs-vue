<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 py-24 px-4 sm:px-6 lg:px-8">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden z-0">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 z-0"></div>
      <div class="absolute top-24 left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute bottom-1/3 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-12 left-1/2 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
    </div>

    <!-- Glassmorphism Card -->
    <div class="max-w-md w-full space-y-8 relative z-10 mx-4 sm:mx-auto">
      <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
        
        <!-- Progress Steps -->
        <div class="flex items-center justify-center gap-2 mb-8">
          <div v-for="i in 3" :key="i" 
               class="flex items-center gap-2"
          >
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step >= i ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
            ]">
              <UIcon v-if="step > i" name="i-heroicons-check" class="w-5 h-5" />
              <span v-else>{{ i }}</span>
            </div>
            <div v-if="i < 3" :class="['w-8 h-0.5', step > i ? 'bg-green-500' : 'bg-gray-600']"></div>
          </div>
        </div>

        <!-- Step 1: Email -->
        <div v-if="step === 1">
          <div class="text-center mb-8">
            <div class="mx-auto h-16 w-16 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <UIcon name="i-heroicons-envelope" class="text-3xl text-white" />
            </div>
            <h2 class="text-2xl font-bold text-white">กรอกอีเมลของคุณ</h2>
            <p class="mt-2 text-sm text-gray-400">เราจะส่งรหัส OTP ไปยืนยัน</p>
          </div>

          <form @submit.prevent="handleSendOtp" class="space-y-6">
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-1 ml-1">อีเมล</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="email"
                  type="email"
                  required
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50"
            >
              {{ loading ? 'กำลังส่ง...' : 'ส่งรหัส OTP' }}
            </button>
          </form>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-else-if="step === 2">
          <div class="text-center mb-6">
            <div class="mx-auto h-16 w-16 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <UIcon name="i-heroicons-shield-check" class="text-3xl text-white" />
            </div>
            <h2 class="text-2xl font-bold text-white">ยืนยันอีเมล</h2>
            <p class="mt-2 text-sm text-gray-400">กรอกรหัส OTP 6 หลักที่ส่งไปยัง</p>
            <p class="text-green-400 font-medium">{{ email }}</p>
          </div>

          <form @submit.prevent="handleVerifyOtp" class="space-y-6">
            <!-- OTP Input -->
            <div class="flex justify-center gap-2">
              <input
                v-for="(_, index) in 6"
                :key="index"
                :ref="el => otpInputs[index] = el"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                inputmode="numeric"
                class="w-11 h-13 text-center text-xl font-bold bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                @input="handleOtpInput(index, $event)"
                @keydown="handleKeydown(index, $event)"
                @paste="handlePaste"
              />
            </div>

            <!-- Timer -->
            <div v-if="countdown > 0" class="text-center text-gray-400 text-sm">
              หมดอายุใน <span class="text-green-400 font-mono text-lg">{{ formatTime(countdown) }}</span>
            </div>
            <div v-else class="text-center">
              <p class="text-red-400 text-sm mb-2">รหัส OTP หมดอายุ</p>
              <button 
                type="button" 
                @click="handleResendOtp" 
                :disabled="resending"
                class="text-green-400 hover:text-green-300 font-medium"
              >
                {{ resending ? 'กำลังส่ง...' : 'ส่งรหัสใหม่' }}
              </button>
            </div>

            <!-- Lockout Warning -->
            <div v-if="locked" class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <UIcon name="i-heroicons-lock-closed" class="h-6 w-6 text-red-400 mx-auto mb-2" />
              <p class="text-red-200 text-sm">{{ lockoutMessage }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading || locked || otpDigits.join('').length !== 6"
              class="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50"
            >
              {{ loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน OTP' }}
            </button>

            <!-- Resend button when timer active -->
            <div v-if="countdown > 0" class="text-center">
              <button 
                type="button" 
                @click="handleResendOtp" 
                :disabled="resending"
                class="text-sm text-gray-400 hover:text-green-400"
              >
                {{ resending ? 'กำลังส่ง...' : 'ส่งรหัส OTP ใหม่' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 3: Complete Profile -->
        <div v-else-if="step === 3">
          <div class="text-center mb-6">
            <div class="mx-auto h-16 w-16 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <UIcon name="i-heroicons-user-plus" class="text-3xl text-white" />
            </div>
            <h2 class="text-2xl font-bold text-white">สร้างบัญชีของคุณ</h2>
            <p class="mt-2 text-sm text-gray-400">กรอกข้อมูลเพื่อเสร็จสิ้นการสมัคร</p>
          </div>

          <form @submit.prevent="handleCompleteRegistration" class="space-y-5">
            <!-- Username -->
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-1 ml-1">ชื่อผู้ใช้</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-user" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="username"
                  type="text"
                  required
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="ตั้งชื่อผู้ใช้"
                />
              </div>
            </div>

            <!-- Phone -->
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-1 ml-1">เบอร์โทร (ไม่บังคับ)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-phone" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="phone"
                  type="tel"
                  class="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="08X-XXX-XXXX"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-1 ml-1">รหัสผ่าน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-lock-closed" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="block w-full pl-11 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-400">
                  <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-1 ml-1">ยืนยันรหัสผ่าน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UIcon name="i-heroicons-lock-closed" class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="block w-full pl-11 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  :class="{ 'border-red-500/50': confirmPassword && password !== confirmPassword }"
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-400">
                  <UIcon :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="h-5 w-5" />
                </button>
              </div>
              <p v-if="confirmPassword && password !== confirmPassword" class="mt-1 text-xs text-red-400 ml-1">รหัสผ่านไม่ตรงกัน</p>
            </div>

            <button
              type="submit"
              :disabled="loading || (confirmPassword && password !== confirmPassword)"
              class="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50"
            >
              {{ loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี' }}
            </button>
          </form>
        </div>

        <!-- Messages -->
        <div v-if="error" class="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <UIcon name="i-heroicons-exclamation-circle" class="h-5 w-5 text-red-400 shrink-0" />
          <p class="text-sm text-red-200">{{ error }}</p>
        </div>

        <div v-if="success" class="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-400 shrink-0" />
          <p class="text-sm text-green-200">{{ success }}</p>
        </div>

        <!-- Links -->
        <div class="text-center mt-6 space-y-2">
          <p class="text-sm text-gray-400">
            มีบัญชีอยู่แล้ว? 
            <NuxtLink to="/login" class="font-medium text-green-400 hover:text-green-300">เข้าสู่ระบบ</NuxtLink>
          </p>
          <NuxtLink to="/" class="text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1">
            <UIcon name="i-heroicons-arrow-left" class="w-3 h-3" /> กลับหน้าหลัก
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const router = useRouter();

// Step control
const step = ref(1);

// Step 1: Email
const email = ref('');

// Step 2: OTP
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const countdown = ref(0);
const locked = ref(false);
const lockoutMessage = ref('');
let timer = null;

// Step 3: Profile
const username = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const registrationToken = ref('');

// Common
const loading = ref(false);
const resending = ref(false);
const error = ref('');
const success = ref('');

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const startCountdown = (seconds) => {
  countdown.value = seconds;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

// Step 1: Send OTP
const handleSendOtp = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await axios.post(`${apiUrl}/api/auth/send-otp`, { email: email.value });
    startCountdown(response.data.expiresIn || 600);
    step.value = 2;
    
    setTimeout(() => otpInputs.value[0]?.focus(), 100);
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาด';
  } finally {
    loading.value = false;
  }
};

// OTP Input handlers
const handleOtpInput = (index, event) => {
  const value = event.target.value;
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = '';
    return;
  }
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus();
  }
};

const handleKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus();
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
  pastedData.split('').forEach((char, index) => {
    if (index < 6) otpDigits.value[index] = char;
  });
};

// Step 2: Verify OTP
const handleVerifyOtp = async () => {
  const otp = otpDigits.value.join('');
  if (otp.length !== 6) {
    error.value = 'กรุณากรอก OTP ให้ครบ 6 หลัก';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await axios.post(`${apiUrl}/api/auth/verify-otp`, {
      email: email.value,
      otp: otp
    });
    
    registrationToken.value = response.data.registrationToken;
    step.value = 3;
    if (timer) clearInterval(timer);
  } catch (err) {
    const data = err.response?.data;
    error.value = data?.message || 'เกิดข้อผิดพลาด';
    
    if (data?.locked) {
      locked.value = true;
      lockoutMessage.value = data.message;
    }
    
    if (data?.expired) {
      countdown.value = 0;
    }
    
    otpDigits.value = ['', '', '', '', '', ''];
    otpInputs.value[0]?.focus();
  } finally {
    loading.value = false;
  }
};

// Resend OTP
const handleResendOtp = async () => {
  resending.value = true;
  error.value = '';
  
  try {
    const response = await axios.post(`${apiUrl}/api/auth/resend-otp`, { email: email.value });
    success.value = response.data.message;
    startCountdown(response.data.expiresIn || 600);
    locked.value = false;
    otpDigits.value = ['', '', '', '', '', ''];
    otpInputs.value[0]?.focus();
    
    setTimeout(() => success.value = '', 3000);
  } catch (err) {
    const data = err.response?.data;
    error.value = data?.message || 'เกิดข้อผิดพลาด';
    if (data?.locked) {
      locked.value = true;
      lockoutMessage.value = data.message;
    }
  } finally {
    resending.value = false;
  }
};

// Step 3: Complete Registration
const handleCompleteRegistration = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'รหัสผ่านไม่ตรงกัน';
    return;
  }
  
  if (password.value.length < 6) {
    error.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await axios.post(`${apiUrl}/api/auth/complete-registration`, {
      registrationToken: registrationToken.value,
      username: username.value,
      phone: phone.value,
      password: password.value
    });
    
    success.value = response.data.message;
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาด';
  } finally {
    loading.value = false;
  }
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
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
