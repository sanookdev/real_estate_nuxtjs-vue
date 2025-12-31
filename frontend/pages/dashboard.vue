<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">แดชบอร์ดของฉัน</h1>
          <div v-if="authStore.user" class="mt-2">
            <span class="text-gray-600">สถานะ: </span>
            <span 
              class="px-2 py-1 rounded text-sm font-medium"
              :class="{
                'bg-green-100 text-green-800': authStore.user.status === 'approved',
                'bg-yellow-100 text-yellow-800': authStore.user.status === 'pending',
                'bg-red-100 text-red-800': authStore.user.status === 'blocked'
              }"
            >
              {{ authStore.user.status === 'approved' ? 'อนุมัติแล้ว' : authStore.user.status === 'pending' ? 'รอการอนุมัติ' : 'ถูกระงับ' }}
            </span>
          </div>
        </div>
        <NuxtLink 
          v-if="authStore.user && authStore.user.status === 'approved'" 
          to="/listings/new" 
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <i class="fas fa-plus"></i> ลงประกาศใหม่
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-green-600"></i>
      </div>

      <!-- Content -->
      <div v-else>
        <h2 class="text-xl font-bold text-gray-900 mb-4">ประกาศของฉัน</h2>
        
        <!-- Empty State -->
        <div v-if="listings.length === 0" class="bg-white rounded-xl p-8 text-center shadow-sm">
          <i class="fas fa-home text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">คุณยังไม่ได้ลงประกาศใดๆ</p>
          <NuxtLink 
            v-if="authStore.user && authStore.user.status === 'approved'"
            to="/listings/new" 
            class="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            เริ่มลงประกาศตอนนี้ →
          </NuxtLink>
        </div>

        <!-- Listings Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="listing in listings" :key="listing.id" class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div class="h-48 overflow-hidden">
              <img 
                :src="listing.images && listing.images.length ? `http://localhost:5000/uploads/${listing.images[0]}` : 'https://placehold.co/600x400/166534/ffffff?text=Property'" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg text-gray-900 mb-1 truncate">{{ listing.title }}</h3>
              <p class="text-xl font-bold text-green-700 mb-2">฿{{ Number(listing.price).toLocaleString() }}</p>
              <div class="flex justify-between items-center">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': listing.status === 'active',
                    'bg-yellow-100 text-yellow-800': listing.status === 'pending',
                    'bg-red-100 text-red-800': listing.status === 'expired' || listing.status === 'sold'
                  }"
                >
                  {{ listing.status }}
                </span>
                <button 
                  @click="deleteListing(listing.id)" 
                  class="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  <i class="fas fa-trash"></i> ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const listings = ref([]);
const loading = ref(true);

onMounted(async () => {
    if (!authStore.token) {
        router.push('/login');
        return;
    }
    await fetchListings();
});

const fetchListings = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/listings/user/my-listings', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        listings.value = response.data;
    } catch (error) {
        console.error('Error fetching my listings', error);
    } finally {
        loading.value = false;
    }
};

const deleteListing = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบประกาศนี้?')) return;
    try {
        await axios.delete(`http://localhost:5000/api/listings/${id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        listings.value = listings.value.filter(l => l.id !== id);
    } catch (error) {
        alert('ลบประกาศไม่สำเร็จ');
    }
};
</script>
