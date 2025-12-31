<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-heart" class="text-red-500 text-2xl" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">รายการที่ถูกใจ</h1>
          <p class="text-gray-500">อสังหาริมทรัพย์ที่คุณบันทึกไว้</p>
        </div>
      </div>

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

const authStore = useAuthStore();
const favorites = ref([]);
const loading = ref(true);

onMounted(async () => {
  if (!authStore.user) return;
  await fetchFavorites();
});

const fetchFavorites = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/favorites/details', {
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
    return `http://localhost:5000/uploads/${listing.images[0]}`;
  }
  return 'https://placehold.co/600x400/166534/ffffff?text=Property';
};

const removeFavorite = (id) => {
  const { $alertify } = useNuxtApp();
  $alertify.confirm('ยืนยันการลบ', 'คุณต้องการลบรายการนี้ออกจากรายการโปรดใช่หรือไม่?',
    async function() {
      try {
        await axios.post('http://localhost:5000/api/favorites/toggle', 
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
