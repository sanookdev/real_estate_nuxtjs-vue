<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-3xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-sm p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">แก้ไขประกาศ</h1>
        
        <form @submit.prevent="updateListing" class="space-y-6">
          <UFormGroup label="หัวข้อประกาศ" name="title">
            <UInput v-model="form.title" placeholder="เช่น ขายคอนโดหรู ใจกลางเมือง" />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="ราคา (บาท)" name="price">
              <UInput v-model="form.price" type="number" placeholder="ระบุราคา" />
            </UFormGroup>
            
            <UFormGroup label="ประเภทอสังหาฯ" name="type">
              <USelect v-model="form.type" :options="propertyTypes" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <UFormGroup label="สภาพทรัพย์สิน" name="property_condition">
              <div class="flex gap-4 mt-2">
                <URadio v-model="form.property_condition" value="new" label="มือหนึ่ง" />
                <URadio v-model="form.property_condition" value="used" label="มือสอง" />
              </div>
            </UFormGroup>
          </div>

          <div class="border border-gray-200 rounded-xl p-5 bg-gray-50 mb-6">
            <h3 class="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-green-600"></i> ที่ตั้งทรัพย์สิน
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Province -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                <USelectMenu
                  v-model="form.province" 
                  :options="provinces"
                  searchable
                  searchable-placeholder="ค้นหาจังหวัด..."
                  placeholder="เลือกจังหวัด"
                  @change="onProvinceChange"
                  class="w-full"
                />
              </div>

              <!-- District -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">เขต/อำเภอ</label>
                <USelectMenu
                  v-model="form.district" 
                  :options="districts"
                  searchable
                  searchable-placeholder="ค้นหาเขต/อำเภอ..."
                  placeholder="เลือกเขต/อำเภอ"
                  @change="onDistrictChange"
                  :disabled="!form.province"
                  class="w-full"
                />
              </div>

              <!-- Subdistrict -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">แขวง/ตำบล</label>
                <USelectMenu
                  v-model="form.subdistrict" 
                  :options="subdistricts"
                  searchable
                  searchable-placeholder="ค้นหาแขวง/ตำบล..."
                  placeholder="เลือกแขวง/ตำบล"
                  @change="onSubdistrictChange"
                  :disabled="!form.district"
                  class="w-full"
                />
              </div>

              <!-- Postal Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                <UInput v-model="form.postal_code" readonly placeholder="อัตโนมัติ" />
              </div>
            </div>

            <!-- Address Detail -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่เพิ่มเติม (ซอย, ถนน, หมู่บ้าน)</label>
              <UInput v-model="form.location" placeholder="ตัวอย่าง: ซอยสุขุมวิท 23, หมู่บ้านพฤกษา" />
            </div>
          </div>

          <UFormGroup label="ลิงก์ Google Map" name="google_map_link">
             <UInput v-model="form.google_map_link" placeholder="https://maps.google.com/..." icon="i-heroicons-map" />
          </UFormGroup>

          <UFormGroup label="รายละเอียดเพิ่มเติม" name="description">
            <UTextarea v-model="form.description" rows="5" placeholder="ระบุรายละเอียด..." />
          </UFormGroup>

          <UFormGroup label="เพิ่มรูปภาพ (เพิ่มเติม)" name="images">
            <input type="file" multiple @change="onFileChange" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            <p class="text-xs text-gray-500 mt-1">รูปภาพใหม่จะถูกเพิ่มต่อท้ายรูปภาพเดิม</p>
          </UFormGroup>

          <!-- New Images Preview -->
          <div v-if="newImagePreviews.length > 0" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">รูปภาพใหม่ที่เลือก (คลิก X เพื่อลบ)</p>
            <div class="flex gap-2 flex-wrap">
              <div v-for="(preview, index) in newImagePreviews" :key="'new-' + index" class="relative group w-24 h-24">
                <img :src="preview" class="w-full h-full object-cover rounded-lg border-2 border-green-400" />
                <span class="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-0.5">ใหม่</span>
                <button 
                  type="button"
                  @click="removeNewImage(index)"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-md"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Existing Images Preview with Delete Button -->
          <div v-if="existingImages.length > 0" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">รูปภาพปัจจุบัน (คลิก X เพื่อลบ)</p>
            <div class="flex gap-2 flex-wrap">
              <div v-for="(img, index) in existingImages" :key="index" class="relative group w-24 h-24">
                <img :src="getImageUrl(img)" class="w-full h-full object-cover rounded-lg border" />
                <button 
                  type="button"
                  @click="removeImage(index)"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-md"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8">
            <UButton to="/admin" color="gray" variant="ghost">ยกเลิก</UButton>
            <UButton type="submit" color="green" size="lg" :loading="loading">บันทึกการแก้ไข</UButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '~/stores/auth';
import { getProvinces, getDistricts, getSubdistricts, getPostalCode } from '~/utils/thailandAddresses';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const newImages = ref([]);
const newImagePreviews = ref([]);
const existingImages = ref([]);

// Helper function for image URLs (supports Supabase)
const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If already a full URL (Supabase), use as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Legacy local path
    return `${apiUrl}/uploads/${imagePath}`;
};

// Address Data State
const provinces = ref([]);
const districts = ref([]);
const subdistricts = ref([]);

const form = reactive({
  title: '',
  price: '',
  type: 'Condo',
  location: '',
  province: '',
  district: '',
  subdistrict: '',
  postal_code: '',
  description: '',
  property_condition: 'new',
  google_map_link: ''
});

const propertyTypes = [
  { label: 'คอนโด', value: 'Condo' },
  { label: 'บ้านเดี่ยว', value: 'House' },
  { label: 'ที่ดิน', value: 'Land' },
  { label: 'อาคารพาณิชย์', value: 'Commercial' }
];

onMounted(async () => {
  if (!authStore.user) {
      router.push('/login');
      return;
  }
  
  // Load provinces first
  provinces.value = await getProvinces();
  
  await fetchListing();
});

const fetchListing = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/listings/${route.params.id}`);
    
    if (data.user_id !== authStore.user.id && authStore.user.role !== 'admin' && authStore.user.role !== 'superadmin') {
        const { $alertify } = useNuxtApp();
        $alertify.alert('แจ้งเตือน', 'คุณไม่มีสิทธิ์แก้ไขประกาศนี้', function(){
            router.push('/');
        });
        return;
    }

    form.title = data.title;
    form.price = data.price;
    form.type = data.type;
    form.location = data.location; // Keeps full string 
    form.description = data.description;
    form.property_condition = data.property_condition || 'new';
    form.google_map_link = data.google_map_link || '';
    
    // Address fields
    form.province = data.province || '';
    form.district = data.district || '';
    form.subdistrict = data.subdistrict || '';
    form.postal_code = data.postal_code || '';
    
    // Trigger cascades for address selectors
    if (form.province) {
        districts.value = await getDistricts(form.province);
        if (form.district) {
            subdistricts.value = await getSubdistricts(form.province, form.district);
        }
    }
    
    if (data.images && Array.isArray(data.images)) {
        existingImages.value = data.images;
    }
  } catch (error) {
    console.error('Error fetching listing:', error);
    const { $alertify } = useNuxtApp();
    $alertify.error('ไม่พบประกาศ');
    router.push('/listings');
  }
};

// Handle province change
const onProvinceChange = async () => {
    form.district = '';
    form.subdistrict = '';
    form.postal_code = '';
    districts.value = [];
    subdistricts.value = [];
    
    if (form.province) {
        districts.value = await getDistricts(form.province);
    }
};

// Handle district change
const onDistrictChange = async () => {
    form.subdistrict = '';
    form.postal_code = '';
    subdistricts.value = [];
    
    if (form.province && form.district) {
        subdistricts.value = await getSubdistricts(form.province, form.district);
    }
};

// Handle subdistrict change
const onSubdistrictChange = async () => {
    if (form.province && form.district && form.subdistrict) {
        form.postal_code = await getPostalCode(form.province, form.district, form.subdistrict);
    }
};

const onFileChange = (e) => {
  const files = Array.from(e.target.files);
  newImages.value = files;
  
  // Generate preview URLs
  newImagePreviews.value = files.map(file => URL.createObjectURL(file));
};

// Remove image from existing images list
const removeImage = (index) => {
  existingImages.value.splice(index, 1);
};

// Remove new image from upload list
const removeNewImage = (index) => {
  // Revoke the blob URL to free memory
  URL.revokeObjectURL(newImagePreviews.value[index]);
  newImages.value.splice(index, 1);
  newImagePreviews.value.splice(index, 1);
};

const updateListing = async () => {
  loading.value = true;
  try {
    // Construct location string
    const locationParts = [];
    // If the user entered a manual location detail, use it or prepend it
    // For simplicity, let's just use the selected parts if form.location is empty or update it
    // Actually, form.location in edit mode might be "Bangkok, Thailand" from before.
    // Let's preserve form.location as "Address Details" and append the selectors if needed?
    // User requirement: "Address Detail" usually means specific Soi/Street.
    // Let's join them: Address Detail, Subdistrict, District, Province, Zip
    
    const parts = [];
    if (form.location) parts.push(form.location); // Treat existing location field as details
    if (form.subdistrict) parts.push(form.subdistrict);
    if (form.district) parts.push(form.district);
    if (form.province) parts.push(form.province);
    if (form.postal_code) parts.push(form.postal_code);
    
    const fullLocation = parts.join(', ');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('price', form.price);
    formData.append('type', form.type);
    formData.append('location', fullLocation); // Updated composite location
    formData.append('description', form.description);
    formData.append('property_condition', form.property_condition);
    formData.append('google_map_link', form.google_map_link);
    
    // Append separate address fields
    formData.append('province', form.province);
    formData.append('district', form.district);
    formData.append('subdistrict', form.subdistrict);
    formData.append('postal_code', form.postal_code);
    
    // Send existing images to keep (after user deleted some)
    formData.append('existingImages', JSON.stringify(existingImages.value));

    newImages.value.forEach(file => {
      formData.append('images', file);
    });

    await axios.put(`${apiUrl}/api/listings/${route.params.id}`, formData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const { $alertify } = useNuxtApp();
    $alertify.success('บันทึกการแก้ไขเรียบร้อยแล้ว');
    router.push(`/listings/${route.params.id}`);
  } catch (error) {
    console.error('Error updating listing:', error);
    const { $alertify } = useNuxtApp();
    $alertify.error('บันทึกไม่สำเร็จ: ' + error.response?.data?.message);
  } finally {
    loading.value = false;
  }
};
</script>
