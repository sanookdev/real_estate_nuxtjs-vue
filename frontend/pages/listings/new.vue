<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-plus text-green-600 text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">ลงประกาศใหม่</h1>
            <p class="text-gray-500">กรอกรายละเอียดทรัพย์สินของคุณ</p>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อประกาศ *</label>
            <input 
              type="text" 
              v-model="form.title" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required 
              placeholder="ตัวอย่าง: คอนโดหรูใจกลางเมือง" 
            />
          </div>
          
          <!-- Price & Type -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท) *</label>
              <input 
                type="number" 
                v-model="form.price" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required 
                placeholder="5000000" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทอสังหาฯ</label>
              <select v-model="form.type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="Condo">คอนโด (Condo)</option>
                <option value="House">บ้านเดี่ยว (House)</option>
                <option value="Land">ที่ดิน (Land)</option>
                <option value="Commercial">อาคารพาณิชย์ (Commercial)</option>
              </select>
            </div>
          </div>

          <!-- Location Section -->
          <div class="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <h3 class="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-green-600"></i> ที่ตั้งทรัพย์สิน
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Province -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">จังหวัด *</label>
                <USelectMenu
                  v-model="form.province" 
                  :options="provinces"
                  searchable
                  searchable-placeholder="ค้นหาจังหวัด..."
                  placeholder="เลือกจังหวัด"
                  @change="onProvinceChange"
                  class="w-full"
                  required
                />
              </div>

              <!-- District -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">เขต/อำเภอ *</label>
                <USelectMenu
                  v-model="form.district" 
                  :options="districts"
                  searchable
                  searchable-placeholder="ค้นหาเขต/อำเภอ..."
                  placeholder="เลือกเขต/อำเภอ"
                  @change="onDistrictChange"
                  :disabled="!form.province"
                  class="w-full"
                  required
                />
              </div>

              <!-- Subdistrict -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">แขวง/ตำบล *</label>
                <USelectMenu
                  v-model="form.subdistrict" 
                  :options="subdistricts"
                  searchable
                  searchable-placeholder="ค้นหาแขวง/ตำบล..."
                  placeholder="เลือกแขวง/ตำบล"
                  @change="onSubdistrictChange"
                  :disabled="!form.district"
                  class="w-full"
                  required
                />
              </div>

              <!-- Postal Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                <input 
                  type="text" 
                  v-model="form.postal_code" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  readonly
                  placeholder="รหัสไปรษณีย์จะกรอกอัตโนมัติ"
                />
              </div>
            </div>

            <!-- Address Detail -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่เพิ่มเติม (ซอย, ถนน, หมู่บ้าน)</label>
              <input 
                type="text" 
                v-model="form.address_detail" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ตัวอย่าง: ซอยสุขุมวิท 23, หมู่บ้านพฤกษา" 
              />
            </div>
          </div>

          <!-- Google Map -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ลิ้งก์ Google Map</label>
            <input 
              type="text" 
              v-model="form.google_map_link" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="วางลิ้งก์ Google Map ที่นี่" 
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม</label>
            <textarea 
              v-model="form.description" 
              rows="5"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="ใส่รายละเอียดเกี่ยวกับทรัพย์สิน..."
            ></textarea>
          </div>

          <!-- Condition & Facilities -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">สภาพทรัพย์สิน</label>
              <select v-model="form.property_condition" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="new">มือหนึ่ง (New)</option>
                <option value="used">มือสอง (Second Hand)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">สิ่งอำนวยความสะดวก</label>
              <div class="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                <label v-for="facility in availableFacilities" :key="facility" class="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" :value="facility" v-model="form.facilities" class="rounded text-green-600 focus:ring-green-500">
                  {{ facility }}
                </label>
              </div>
            </div>
          </div>

          <!-- Nearby Places -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">สถานที่ใกล้เคียง</label>
            <textarea 
              v-model="form.nearby_places" 
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="ตัวอย่าง: เซ็นทรัลเวิลด์ (500ม.), BTS ชิดลม (200ม.)"
            ></textarea>
          </div>

          <!-- Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">รูปภาพ</label>
            <div class="relative">
              <input type="file" @change="handleFileChange" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <i class="fas fa-camera text-3xl text-gray-400 mb-2"></i>
                <p class="text-gray-500">{{ files.length ? `${files.length} ไฟล์ที่เลือก` : 'คลิกเพื่ออัพโหลดรูปภาพ' }}</p>
                <p class="text-xs text-gray-400 mt-1">รูปแรกจะเป็นรูปปก สูงสุด 10 รูป</p>
              </div>
            </div>
            <div v-if="imagePreviews.length" class="grid grid-cols-4 gap-2 mt-4">
              <div v-for="(preview, index) in imagePreviews" :key="index" class="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img :src="preview" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <NuxtLink to="/dashboard" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              ยกเลิก
            </NuxtLink>
            <button 
              type="submit" 
              class="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'กำลังโพสต์...' : 'ลงประกาศ' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { getProvinces, getDistricts, getSubdistricts, getPostalCode } from '~/utils/thailandAddresses';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const error = ref('');
const files = ref([]);

const availableFacilities = ['สระว่ายน้ำ', 'ฟิตเนส', 'ที่จอดรถ', 'รปภ. 24ชม.', 'สวนหย่อม', 'สนามเด็กเล่น', 'ลิฟต์', 'Wi-Fi', 'เฟอร์นิเจอร์', 'เครื่องปรับอากาศ'];

const form = reactive({
    title: '',
    price: '',
    type: 'Condo',
    province: '',
    district: '',
    subdistrict: '',
    postal_code: '',
    address_detail: '',
    description: '',
    property_condition: 'new',
    facilities: [],
    nearby_places: '',
    google_map_link: ''
});

// Address Data State
const provinces = ref([]);
const districts = ref([]);
const subdistricts = ref([]);

// Load provinces on mount
onMounted(async () => {
    try {
        provinces.value = await getProvinces();
    } catch (e) {
        console.error('Error loading provinces:', e);
    }
});

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

const imagePreviews = ref([]);

const handleFileChange = (e) => {
    files.value = e.target.files;
    imagePreviews.value = [];
    
    for (let i = 0; i < files.value.length; i++) {
        const file = files.value[i];
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
    }
};

const handleSubmit = async () => {
    loading.value = true;
    error.value = '';
    
    try {
        // Combine location into a single string for backward compatibility
        const locationParts = [];
        if (form.address_detail) locationParts.push(form.address_detail);
        if (form.subdistrict) locationParts.push(form.subdistrict);
        if (form.district) locationParts.push(form.district);
        if (form.province) locationParts.push(form.province);
        if (form.postal_code) locationParts.push(form.postal_code);
        const location = locationParts.join(', ');

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('price', form.price);
        formData.append('type', form.type);
        formData.append('location', location);
        formData.append('province', form.province);
        formData.append('district', form.district);
        formData.append('subdistrict', form.subdistrict);
        formData.append('postal_code', form.postal_code);
        formData.append('description', form.description);
        formData.append('property_condition', form.property_condition);
        formData.append('facilities', JSON.stringify(form.facilities));
        formData.append('nearby_places', form.nearby_places);
        formData.append('google_map_link', form.google_map_link);
        
        for (let i = 0; i < files.value.length; i++) {
            formData.append('images', files.value[i]);
        }

        await axios.post('http://localhost:5000/api/listings', formData, {
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        router.push('/dashboard');
    } catch (err) {
        console.error(err);
        error.value = err.response?.data?.message || 'ลงประกาศไม่สำเร็จ';
    } finally {
        loading.value = false;
    }
};
</script>
