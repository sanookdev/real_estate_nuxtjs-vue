<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <!-- Glassmorphism Hero Header -->
    <div class="relative py-16 overflow-hidden mb-8">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-800 to-red-900">
        <div class="absolute top-0 right-1/4 w-72 h-72 bg-rose-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div class="absolute top-1/3 left-1/2 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <!-- Glass Card -->
      <div class="relative max-w-4xl mx-auto px-4 text-center">
        <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
          <div 
            class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-4 opacity-0 translate-y-4 transition-all duration-700"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            <UIcon name="i-heroicons-heart" class="text-rose-300" />
            <span class="text-rose-200 text-sm font-medium tracking-wider uppercase">My Favorites</span>
          </div>
          <h1 
            class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight opacity-0 translate-y-4 transition-all duration-700 delay-100"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            รายการที่<span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-200">ถูกใจ</span>
          </h1>
          <p 
            class="text-rose-100/80 text-lg opacity-0 translate-y-4 transition-all duration-700 delay-200"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            อสังหาริมทรัพย์ที่คุณบันทึกไว้
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">

      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-green-600" />
      </div>

      <div v-else-if="favorites.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm">
        <UIcon name="i-heroicons-heart" class="text-6xl text-gray-200 mb-4" />
        <p class="text-xl text-gray-500 mb-4">ยังไม่มีรายการที่ถูกใจ</p>
        <UButton to="/listings" color="green" variant="solid">ค้นหาอสังหาริมทรัพย์</UButton>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink 
          v-for="(listing) in favorites" 
          :key="listing.id" 
          :to="`/listings/${listing.id}`"
          class="group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div class="relative h-52 overflow-hidden">
            <img 
              :src="getListingImage(listing)" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute top-3 left-3 flex gap-2">
              <span 
                class="text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur"
                :class="listing.property_condition === 'new' ? 'bg-green-500/90 text-white' : 'bg-gray-900/80 text-white'"
              >
                {{ listing.property_condition === 'new' ? '✨ มือหนึ่ง' : '🔄 มือสอง' }}
              </span>
            </div>
            
            <button 
              @click.prevent="removeFavorite(listing.id)" 
              class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-red-500"
              title="ลบออกจากรายการโปรด"
            >
              <UIcon name="i-heroicons-trash" />
            </button>
            
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              <p class="text-2xl font-bold text-white">฿{{ Number(listing.price).toLocaleString() }}</p>
            </div>
          </div>
          
          <div class="p-5">
            <span class="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
              {{ listing.type }}
            </span>
            <h3 class="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-green-600 transition-colors">
              {{ listing.title }}
            </h3>
            <p class="text-sm text-gray-500 flex items-center gap-1">
              <UIcon name="i-heroicons-map-pin" class="text-green-600" />
              {{ listing.province || listing.location }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


const authStore = useAuthStore();
const favorites = ref([]);
const loading = ref(true);
const mounted = ref(false);

onMounted(async () => {
  if (!authStore.user) return;
  await fetchFavorites();
  // Trigger fade animation
  setTimeout(() => {
    mounted.value = true;
  }, 100);
});

const fetchFavorites = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/api/favorites/details`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    favorites.value = response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
  } finally {
    loading.value = false;
  }
};

const getListingImage = (listing) => {
  if (listing.images && listing.images.length > 0) {
    const img = listing.images[0];
    // If already a full URL (Supabase), use as-is
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    // Legacy local path
    return `${apiUrl}/uploads/${img}`;
  }
  return 'https://placehold.co/600x400/166534/ffffff?text=Property';
};

const removeFavorite = (id) => {
  const { $alertify } = useNuxtApp();
  $alertify.confirm('ยืนยันการลบ', 'คุณต้องการลบรายการนี้ออกจากรายการโปรดใช่หรือไม่?',
    async function() {
      try {
        await axios.post(`${apiUrl}/api/favorites/toggle`, 
          { listingId: id },
          { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        favorites.value = favorites.value.filter(f => f.id !== id);
        $alertify.success('ลบรายการเรียบร้อย');
      } catch (error) {
        console.error('Error removing favorite:', error);
        $alertify.error('เกิดข้อผิดพลาด');
      }
    },
    function() { }
  );
};
</script>
