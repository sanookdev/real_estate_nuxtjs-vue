<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <!-- Glassmorphism Hero Header -->
    <div class="relative py-16 overflow-hidden mb-8">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-zinc-800 to-neutral-900">
        <div class="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <!-- Glass Card -->
      <div class="relative max-w-7xl mx-auto px-4">
        <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div 
              class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-4 opacity-0 translate-y-4 transition-all duration-700"
              :class="{ 'opacity-100 translate-y-0': mounted }"
            >
              <UIcon name="i-heroicons-squares-2x2" class="text-emerald-400" />
              <span class="text-emerald-200 text-sm font-medium tracking-wider uppercase">Dashboard</span>
            </div>
            <h1 
              class="text-3xl md:text-4xl font-bold text-white mb-2 opacity-0 translate-y-4 transition-all duration-700 delay-100"
              :class="{ 'opacity-100 translate-y-0': mounted }"
            >
              แดชบอร์ดของ<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">ฉัน</span>
            </h1>
            <div 
              v-if="authStore.user" 
              class="mt-2 flex items-center gap-2 opacity-0 translate-y-4 transition-all duration-700 delay-200"
              :class="{ 'opacity-100 translate-y-0': mounted }"
            >
              <span class="text-gray-400">สถานะ:</span>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium backdrop-blur"
                :class="{
                  'bg-green-500/20 text-green-300 border border-green-500/30': authStore.user.status === 'approved',
                  'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30': authStore.user.status === 'pending',
                  'bg-red-500/20 text-red-300 border border-red-500/30': authStore.user.status === 'blocked'
                }"
              >
                {{ authStore.user.status === 'approved' ? 'อนุมัติแล้ว' : authStore.user.status === 'pending' ? 'รอการอนุมัติ' : 'ถูกระงับ' }}
              </span>
            </div>
          </div>
          <NuxtLink 
            v-if="authStore.user && authStore.user.status === 'approved'" 
            to="/listings/new" 
            class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 opacity-0 translate-y-4 transition-all duration-700 delay-300"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            <i class="fas fa-plus"></i> ลงประกาศใหม่
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-4">

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
          <div v-for="listing in listings" :key="listing.id" class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
            <!-- Sold Ribbon -->
            <div v-if="listing.status === 'sold'" class="absolute top-4 right-0 bg-red-600 text-white px-4 py-1 text-sm font-bold z-10 shadow-lg" style="transform: rotate(0deg);">
              ขายแล้ว
            </div>
            
            <div class="h-48 overflow-hidden relative">
              <img 
                :src="listing.images && listing.images.length ? `http://localhost:5000/uploads/${listing.images[0]}` : 'https://placehold.co/600x400/166534/ffffff?text=Property'" 
                class="w-full h-full object-cover"
                :class="{ 'grayscale opacity-70': listing.status === 'inactive' }"
              />
              <!-- Inactive Overlay -->
              <div v-if="listing.status === 'inactive'" class="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span class="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">ไม่เผยแพร่</span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg text-gray-900 mb-1 truncate">{{ listing.title }}</h3>
              <p class="text-xl font-bold text-green-700 mb-3">฿{{ Number(listing.price).toLocaleString() }}</p>
              
              <!-- Status Dropdown -->
              <div class="mb-3">
                <label class="block text-xs text-gray-500 mb-1">สถานะการเผยแพร่</label>
                <select 
                  v-model="listing.status"
                  @change="updateListingStatus(listing.id, listing.status)"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="{
                    'bg-green-50 text-green-700': listing.status === 'active',
                    'bg-gray-100 text-gray-600': listing.status === 'inactive',
                    'bg-red-50 text-red-700': listing.status === 'sold',
                    'bg-yellow-50 text-yellow-700': listing.status === 'pending'
                  }"
                  :disabled="listing.status === 'pending'"
                >
                  <option value="active">✅ เผยแพร่ (Public)</option>
                  <option value="inactive">🔒 ไม่เผยแพร่ (Unpublic)</option>
                  <option value="sold">🏷️ ขายแล้ว (Sold)</option>
                  <option v-if="listing.status === 'pending'" value="pending">⏳ รอการอนุมัติ</option>
                </select>
                <!-- Pending Notice -->
                <p v-if="listing.status === 'pending'" class="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  <i class="fas fa-info-circle"></i>
                  รอ Admin อนุมัติก่อนจึงจะเผยแพร่ได้
                </p>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-2">
                <NuxtLink 
                  :to="`/listings/edit/${listing.id}`"
                  class="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  <i class="fas fa-edit mr-1"></i> แก้ไข
                </NuxtLink>
                <NuxtLink 
                  :to="`/listings/${listing.id}`"
                  class="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  <i class="fas fa-eye mr-1"></i> ดู
                </NuxtLink>
                <button 
                  @click="deleteListing(listing.id)" 
                  class="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  <i class="fas fa-trash"></i>
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
const mounted = ref(false);

onMounted(async () => {
    if (!authStore.token) {
        router.push('/login');
        return;
    }
    await fetchListings();
    // Trigger fade animation
    setTimeout(() => {
        mounted.value = true;
    }, 100);
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

const updateListingStatus = async (id, status) => {
    try {
        await axios.patch(`http://localhost:5000/api/listings/${id}/my-status`, 
            { status },
            { headers: { Authorization: `Bearer ${authStore.token}` } }
        );
        // Update local state
        const listing = listings.value.find(l => l.id === id);
        if (listing) listing.status = status;
    } catch (error) {
        console.error('Error updating status:', error);
        const errorMsg = error.response?.data?.message || 'อัพเดทสถานะไม่สำเร็จ';
        alert(errorMsg);
        // Refresh to get correct status
        await fetchListings();
    }
};
</script>
