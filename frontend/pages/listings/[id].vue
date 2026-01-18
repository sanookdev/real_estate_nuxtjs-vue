<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-green-600"></i>
      </div>

      <!-- Not Found -->
      <div v-else-if="!listing" class="text-center py-20 bg-white rounded-xl">
        <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-500">ไม่พบประกาศที่ต้องการ</p>
        <NuxtLink to="/listings" class="inline-block mt-4 text-green-600 hover:text-green-700">← กลับไปหน้ารายการ</NuxtLink>
      </div>

      <!-- Listing Detail -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Images -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm relative">
            <!-- SOLD Banner -->
            <div v-if="listing.status === 'sold'" class="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-3 z-10 font-bold text-lg shadow-lg">
              🏷️ ขายแล้ว (SOLD)
            </div>
            <!-- Hot Badge -->
            <div v-if="listing.is_pinned" class="absolute top-4 left-4 z-20 flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse" :class="{ 'top-16': listing.status === 'sold' }">
              <span class="text-sm">🔥</span>
              <span>HOT</span>
            </div>
            <img 
              :src="getImageUrl(currentImage)" 
              class="w-full h-full object-cover"
              :class="{ 'pt-12': listing.status === 'sold' }"
            />
          </div>
          
          <div v-if="listing.images && listing.images.length > 1" class="flex gap-3 mt-4 overflow-x-auto pb-2">
            <div 
              v-for="(img, index) in listing.images" 
              :key="index" 
              @click="currentImage = img"
              class="w-24 h-16 rounded-lg overflow-hidden cursor-pointer border-2 shrink-0 transition-all"
              :class="currentImage === img ? 'border-green-500' : 'border-transparent hover:border-gray-300'"
            >
              <img :src="getImageUrl(img)" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-2xl p-6 mt-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-file-alt text-green-600"></i> รายละเอียด
            </h3>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ listing.description || 'ไม่มีรายละเอียดเพิ่มเติม' }}</p>
          </div>

          <!-- Facilities -->
          <div v-if="parsedFacilities && parsedFacilities.length" class="bg-white rounded-2xl p-6 mt-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-star text-green-600"></i> สิ่งอำนวยความสะดวก
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="facility in parsedFacilities" :key="facility" class="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                ✓ {{ facility }}
              </span>
            </div>
          </div>

          <!-- Nearby Places -->
          <div v-if="listing.nearby_places" class="bg-white rounded-2xl p-6 mt-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-map-signs text-green-600"></i> สถานที่ใกล้เคียง
            </h3>
            <p class="text-gray-600 whitespace-pre-line">{{ listing.nearby_places }}</p>
          </div>
        </div>

        <!-- Right Column - Info -->
        <div class="space-y-6">
          <!-- Owner/Admin Actions -->
          <div v-if="canEdit" class="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
             <h3 class="font-bold text-gray-900 mb-2">จัดการประกาศ</h3>
             <NuxtLink :to="`/listings/edit/${listing.id}`" class="flex items-center justify-center gap-2 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 rounded-lg transition-colors">
               <i class="fas fa-pencil-alt"></i> แก้ไขข้อมูล
             </NuxtLink>
          </div>

          <!-- Main Info Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <div class="flex gap-2 mb-4">
              <span class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ listing.type }}
              </span>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="listing.property_condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
              >
                {{ listing.property_condition === 'new' ? 'มือหนึ่ง' : 'มือสอง' }}
              </span>
            </div>
            
            <h1 class="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-between">
              {{ listing.title }}
              <button 
                @click="toggleFavorite" 
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors border shadow-sm"
                :class="isFavorited ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-300'"
              >
                <i class="fas fa-heart text-xl"></i>
              </button>
            </h1>
            <p class="text-gray-500 flex items-center gap-1 mb-4">
              <i class="fas fa-map-marker-alt"></i> {{ listing.location }}
            </p>
            <p class="text-3xl font-bold text-green-700 mb-4">฿{{ Number(listing.price).toLocaleString() }}</p>
            
            <p class="text-xs text-gray-400">
              ลงประกาศ: {{ formatDate(listing.created_at) }}
            </p>
          </div>

          <!-- Address Details -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-green-600"></i> ที่อยู่ทรัพย์
            </h3>
            <div class="space-y-3 text-gray-600">
              <p v-if="listing.location">
                <span class="text-gray-500">ที่ตั้ง:</span> 
                <span class="font-medium text-gray-900">{{ listing.location }}</span>
              </p>
              <div class="grid grid-cols-2 gap-3">
                <div v-if="listing.subdistrict" class="bg-gray-50 rounded-lg p-3">
                  <span class="text-xs text-gray-500 block">ตำบล/แขวง</span>
                  <span class="font-medium text-gray-900">{{ listing.subdistrict }}</span>
                </div>
                <div v-if="listing.district" class="bg-gray-50 rounded-lg p-3">
                  <span class="text-xs text-gray-500 block">อำเภอ/เขต</span>
                  <span class="font-medium text-gray-900">{{ listing.district }}</span>
                </div>
                <div v-if="listing.province" class="bg-gray-50 rounded-lg p-3">
                  <span class="text-xs text-gray-500 block">จังหวัด</span>
                  <span class="font-medium text-gray-900">{{ listing.province }}</span>
                </div>
                <div v-if="listing.postal_code" class="bg-gray-50 rounded-lg p-3">
                  <span class="text-xs text-gray-500 block">รหัสไปรษณีย์</span>
                  <span class="font-medium text-gray-900">{{ listing.postal_code }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Google Map -->
          <div v-if="listing.google_map_link" class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-map text-green-600"></i> แผนที่
            </h3>
            <a 
              :href="listing.google_map_link" 
              target="_blank"
              class="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
            >
              <i class="fas fa-external-link-alt"></i> เปิดดูใน Google Maps
            </a>
          </div>

          <!-- Contact Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-user text-green-600"></i> ติดต่อผู้ขาย
            </h3>
            <div class="space-y-3">
              <p class="text-gray-600">
                <span class="font-medium text-gray-900">ผู้ลงประกาศ:</span> {{ listing.username }}
              </p>
              <p class="text-gray-600">
                <span class="font-medium text-gray-900">อีเมล:</span> {{ listing.email }}
              </p>
              <p v-if="listing.phone" class="text-gray-600">
                <span class="font-medium text-gray-900">โทรศัพท์:</span> 
                <a :href="`tel:${listing.phone}`" class="text-green-600 hover:text-green-700 font-medium">
                  {{ listing.phone }}
                </a>
              </p>
            </div>
            <a 
              v-if="listing.phone"
              :href="`tel:${listing.phone}`"
              class="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-6 transition-colors"
            >
              <i class="fas fa-phone"></i> โทรหาผู้ขาย
            </a>
            <a 
              v-else
              :href="`mailto:${listing.email}?subject=สนใจทรัพย์: ${listing.title}`"
              class="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-6 transition-colors"
            >
              <i class="fas fa-envelope"></i> ติดต่อทางอีเมล
            </a>
          </div>

          <!-- Back Button -->
          <NuxtLink to="/listings" class="flex items-center justify-center gap-2 w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors">
            <i class="fas fa-arrow-left"></i> กลับไปหน้ารายการ
          </NuxtLink>
        </div>
      </div>
      <!-- Related Listings -->
      <div v-if="relatedListings.length > 0" class="mt-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-green-600 pl-4">
          ประกาศที่ใกล้เคียง
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="related in relatedListings" 
            :key="related.id" 
            :to="`/listings/${related.id}`"
            class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="getListingImage(related)" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span class="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                {{ related.type }}
              </span>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-gray-900 mb-1 truncate">{{ related.title }}</h3>
              <p class="text-sm text-gray-500 mb-2 truncate"><i class="fas fa-map-marker-alt"></i> {{ related.location }}</p>
              <p class="text-lg font-bold text-green-700">฿{{ Number(related.price).toLocaleString() }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Popular Locations Links -->
      <div class="mt-16 bg-white rounded-2xl p-8 shadow-sm">
        <h3 class="text-xl font-bold text-gray-900 mb-6">ทำเลยอดนิยม</h3>
        <div class="flex flex-wrap gap-3">
          <NuxtLink 
            v-for="loc in popularLocations" 
            :key="loc.name"
            :to="`/listings?province=${loc.province}`"
            class="px-4 py-2 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-700 rounded-lg border border-gray-200 transition-colors"
          >
            {{ loc.name }}
          </NuxtLink>
          <NuxtLink 
            to="/listings" 
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            ดูทั้งหมด
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const listing = ref(null);
const loading = ref(true);
const currentImage = ref(null);
const relatedListings = ref([]);

const canEdit = computed(() => {
    if (!listing.value || !authStore.user) return false;
    return authStore.user.id === listing.value.user_id || 
           authStore.user.role === 'admin' || 
           authStore.user.role === 'superadmin';
});

const popularLocations = [
  { name: 'กรุงเทพมหานคร', province: 'กรุงเทพมหานคร' },
  { name: 'ภูเก็ต', province: 'ภูเก็ต' },
  { name: 'เชียงใหม่', province: 'เชียงใหม่' },
  { name: 'ชลบุรี (พัทยา)', province: 'ชลบุรี' },
  { name: 'นนทบุรี', province: 'นนทบุรี' }
];

const parsedFacilities = computed(() => {
    if (!listing.value || !listing.value.facilities) return [];
    if (typeof listing.value.facilities === 'string') {
        try {
            return JSON.parse(listing.value.facilities);
        } catch {
            return [];
        }
    }
    return listing.value.facilities;
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/800x600/166534/ffffff?text=Property';
    // If already a full URL (Supabase), use as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Legacy local path
    return `${apiUrl}/uploads/${imagePath}`;
};

const getListingImage = (listing) => {
    if (listing.images && listing.images.length > 0) {
        return getImageUrl(listing.images[0]);
    }
    return 'https://placehold.co/400x300/166534/ffffff?text=Property';
};

onMounted(async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/listings/${route.params.id}`);
        listing.value = response.data;
        if (listing.value.images && listing.value.images.length > 0) {
            currentImage.value = listing.value.images[0];
        }

        const allResponse = await axios.get(`${apiUrl}/api/listings`);
        if (allResponse.data && allResponse.data.listings) {
            relatedListings.value = allResponse.data.listings
                .filter(item => item.type === listing.value.type && item.id !== listing.value.id)
                .slice(0, 4); 
        }

        await fetchFavorites();

    } catch (error) {
        console.error('Error fetching listing', error);
    } finally {
        loading.value = false;
    }
});

const favorites = ref([]);
const isFavorited = computed(() => {
    return listing.value && favorites.value.includes(listing.value.id);
});

const fetchFavorites = async () => {
  if (authStore.user) {
    try {
      const response = await axios.get(`${apiUrl}/api/favorites`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      favorites.value = response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
};

const toggleFavorite = async () => {
    if (!authStore.user) {
        router.push('/login'); // We need useRouter first
        return;
    }
    
    if (!listing.value) return;

    try {
        const response = await axios.post(`${apiUrl}/api/favorites/toggle`, 
            { listingId: listing.value.id },
            { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        
        if (response.data.favorited) {
            if (!favorites.value.includes(listing.value.id)) favorites.value.push(listing.value.id);
        } else {
            const index = favorites.value.indexOf(listing.value.id);
            if (index > -1) favorites.value.splice(index, 1);
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        const { $alertify } = useNuxtApp();
        $alertify.error('เกิดข้อผิดพลาดในการบันทึกรายการโปรด');
    }
};
</script>
