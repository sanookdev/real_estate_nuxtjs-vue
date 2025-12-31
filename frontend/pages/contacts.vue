<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-green-800 to-green-900 py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">ติดต่อเรา</h1>
        <p class="text-green-100 text-lg">เราพร้อมดูแลและให้คำปรึกษาตลอด 24 ชั่วโมง</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Info -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">ช่องทางการติดต่อ</h2>
          
          <div class="space-y-6">
            <UCard>
              <div class="flex items-start gap-4">
                <div class="p-3 bg-green-100 rounded-lg text-green-600">
                  <UIcon name="i-heroicons-map-pin" class="text-2xl" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">ที่อยู่สำนักงาน</h3>
                  <p class="text-gray-600">123 อาคารแอสเซทเซล ชั้น 15<br>ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย<br>กรุงเทพฯ 10110</p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-4">
                <div class="p-3 bg-green-100 rounded-lg text-green-600">
                  <UIcon name="i-heroicons-phone" class="text-2xl" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">เบอร์โทรศัพท์</h3>
                  <p class="text-gray-600">02-123-4567 (สำนักงาน)</p>
                  <p class="text-gray-600">089-123-4567 (สายด่วน)</p>
                </div>
              </div>
            </UCard>

            <UCard>
              <div class="flex items-start gap-4">
                <div class="p-3 bg-green-100 rounded-lg text-green-600">
                  <UIcon name="i-heroicons-envelope" class="text-2xl" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">อีเมล</h3>
                  <p class="text-gray-600">info@assetsale.com</p>
                  <p class="text-gray-600">support@assetsale.com</p>
                </div>
              </div>
            </UCard>
          </div>

          <div class="mt-8 flex gap-4 justify-center lg:justify-start">
             <UButton color="blue" variant="soft" icon="i-fab-facebook" to="#" target="_blank">Facebook</UButton>
             <UButton color="green" variant="soft" icon="i-fab-line" to="#" target="_blank">Line</UButton>
          </div>
        </div>

        <!-- Contact Form -->
        <UCard>
          <template #header>
            <h3 class="text-xl font-bold text-gray-900">ส่งข้อความถึงเรา</h3>
          </template>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="ชื่อ" name="name">
                <UInput v-model="form.name" placeholder="ชื่อจริง" icon="i-heroicons-user" />
              </UFormGroup>
              <UFormGroup label="นามสกุล" name="surname">
                <UInput v-model="form.surname" placeholder="นามสกุล" />
              </UFormGroup>
            </div>

            <UFormGroup label="อีเมล" name="email">
              <UInput v-model="form.email" type="email" placeholder="name@example.com" icon="i-heroicons-envelope" />
            </UFormGroup>

            <UFormGroup label="เบอร์โทรศัพท์" name="phone">
              <UInput v-model="form.phone" type="tel" placeholder="08x-xxx-xxxx" icon="i-heroicons-phone" />
            </UFormGroup>

            <UFormGroup label="หัวข้อที่ติดต่อ" name="subject">
              <USelect v-model="form.subject" :options="subjects" placeholder="เลือกหัวข้อ..." />
            </UFormGroup>

            <UFormGroup label="ข้อความ" name="message">
              <UTextarea v-model="form.message" placeholder="รายละเอียด..." :rows="4" />
            </UFormGroup>

            <div v-if="success" class="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
              <UIcon name="i-heroicons-check-circle" />
              {{ success }}
            </div>

            <div v-if="error" class="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <UIcon name="i-heroicons-exclamation-circle" />
              {{ error }}
            </div>

            <UButton type="submit" block size="lg" color="green" :loading="loading">
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
import { ref, reactive } from 'vue';
import axios from 'axios';

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

const handleSubmit = async () => {
  loading.value = true;
  success.value = '';
  error.value = '';
  
  try {
    await axios.post('http://localhost:5000/api/contact', form);
    success.value = 'ส่งข้อความเรียบร้อยแล้ว! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด';
    // Clear form
    Object.keys(form).forEach(key => form[key] = '');
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งข้อความ';
  } finally {
    loading.value = false;
  }
};
</script>
