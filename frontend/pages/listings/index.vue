<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <!-- Glassmorphism Hero Banner -->
    <div class="relative py-16 overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900">
        <div class="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div class="absolute top-1/2 right-1/4 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <!-- Glass Card -->
      <div class="relative max-w-4xl mx-auto px-4 text-center">
        <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div 
            class="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-4 opacity-0 translate-y-4 transition-all duration-700"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            <UIcon name="i-heroicons-magnifying-glass" class="text-amber-300" />
            <span class="text-amber-200 text-sm font-medium tracking-wider uppercase">Explore Properties</span>
          </div>
          <h1 
            class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight opacity-0 translate-y-4 transition-all duration-700 delay-100"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            ค้นหา<span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">อสังหาริมทรัพย์</span>
          </h1>
          <p 
            class="text-amber-100/80 text-lg opacity-0 translate-y-4 transition-all duration-700 delay-200"
            :class="{ 'opacity-100 translate-y-0': mounted }"
          >
            พบกับทรัพย์สินคุณภาพกว่า {{ listings.length }} รายการ
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-72 shrink-0">
          <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-gray-900">ตัวกรอง</h2>
              <button @click="resetFilters" class="text-sm text-green-600 hover:text-green-700">ล้างทั้งหมด</button>
            </div>

            <!-- Search -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="filters.search"
                  placeholder="ค้นหาชื่อ หรือที่ตั้ง..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <!-- Type -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
              <div class="space-y-2">
                <label v-for="type in propertyTypes" :key="type.value" class="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    :value="type.value" 
                    v-model="filters.type"
                    class="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span class="text-gray-600 group-hover:text-gray-900">{{ type.icon }} {{ type.label }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">ช่วงราคา</label>
              <select v-model="filters.priceRange" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">ทุกราคา</option>
                <option v-for="range in priceRanges" :key="range.value" :value="range.value">
                  {{ range.label }}
                </option>
              </select>
            </div>

            <!-- Location -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">จังหวัด</label>
              <select v-model="filters.province" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">ทุกจังหวัด</option>
                <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
              </select>
            </div>

            <!-- Condition -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">สภาพ</label>
              <div class="flex gap-2">
                <button 
                  @click="filters.condition = ''"
                  class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                  :class="filters.condition === '' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  ทั้งหมด
                </button>
                <button 
                  @click="filters.condition = 'new'"
                  class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                  :class="filters.condition === 'new' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  มือหนึ่ง
                </button>
                <button 
                  @click="filters.condition = 'used'"
                  class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                  :class="filters.condition === 'used' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  มือสอง
                </button>
              </div>
            </div>

            <!-- Results Count -->
            <div class="pt-4 border-t border-gray-100">
              <p class="text-sm text-gray-500 text-center">
                พบ <span class="font-bold text-green-600">{{ filteredListings.length }}</span> รายการ
              </p>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Sort Bar -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p class="text-gray-600">
              แสดง <span class="font-bold">{{ paginatedListings.length }}</span> จาก {{ filteredListings.length }} รายการ
              <span v-if="totalPages > 1" class="text-gray-400"> (หน้า {{ currentPage }}/{{ totalPages }})</span>
            </p>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">เรียงตาม:</span>
              <select v-model="sortBy" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="newest">ล่าสุด</option>
                <option value="price_low">ราคาต่ำ → สูง</option>
                <option value="price_high">ราคาสูง → ต่ำ</option>
              </select>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-12">
            <i class="fas fa-spinner fa-spin text-4xl text-green-600"></i>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredListings.length === 0" class="bg-white rounded-xl p-12 text-center shadow-sm">
            <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg mb-2">ไม่พบประกาศที่ตรงกับเงื่อนไข</p>
            <button @click="resetFilters" class="text-green-600 hover:text-green-700 font-medium">ล้างตัวกรองทั้งหมด</button>
          </div>

          <!-- Listings Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <NuxtLink 
              v-for="listing in paginatedListings" 
              :key="listing.id" 
              :to="`/listings/${listing.id}`"
              class="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <!-- Image -->
              <div class="relative h-52 overflow-hidden">
                <img 
                  :src="listing.images && listing.images.length ? `http://localhost:5000/uploads/${listing.images[0]}` : 'https://placehold.co/600x400/166534/ffffff?text=Property'" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <!-- Badges -->
                <div class="absolute top-3 left-3 flex gap-2">
                  <span class="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    {{ listing.type }}
                  </span>
                </div>
                
                 <!-- Favorite Button -->
                <button 
                  @click.prevent="toggleFavorite(listing.id)" 
                  class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
                >
                  <i 
                    class="fas fa-heart transition-colors"
                    :class="favorites.includes(listing.id) ? 'text-red-500' : 'text-gray-400'"
                  ></i>
                </button>

                <div class="absolute bottom-12 right-3">
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-bold shadow"
                    :class="listing.property_condition === 'new' ? 'bg-yellow-400 text-yellow-900' : 'bg-white text-gray-700'"
                  >
                    {{ listing.property_condition === 'new' ? '✨ มือหนึ่ง' : '🔄 มือสอง' }}
                  </span>
                </div>
                <!-- Price Tag -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p class="text-2xl font-bold text-white">฿{{ Number(listing.price).toLocaleString() }}</p>
                </div>
              </div>

              <!-- Content -->
              <div class="p-5">
                <h3 class="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-green-600 transition-colors">
                  {{ listing.title }}
                </h3>
                <p class="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <i class="fas fa-map-marker-alt text-green-600"></i>
                  {{ listing.location }}
                </p>
                <div class="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span class="flex items-center gap-1">
                    <i class="fas fa-calendar-plus"></i>
                    ลงประกาศ: {{ formatDate(listing.created_at) }}
                  </span>
                  <span v-if="listing.updated_at !== listing.created_at" class="flex items-center gap-1">
                    <i class="fas fa-sync-alt"></i>
                    อัพเดต: {{ formatDate(listing.updated_at) }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div class="flex items-center gap-2">
              <button 
                @click="goToPage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg font-medium transition-colors"
                :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'"
              >
                <i class="fas fa-chevron-left"></i> ก่อนหน้า
              </button>
              
              <div class="flex gap-1">
                <button 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="goToPage(page)"
                  class="w-10 h-10 rounded-lg font-medium transition-colors"
                  :class="page === currentPage ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                @click="goToPage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg font-medium transition-colors"
                :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'"
              >
                ถัดไป <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { getProvinces } from '~/utils/thailandAddresses';
import { useAuthStore } from '~/stores/auth';

const router = useRouter(); // Was already imported but ensure correct
const route = useRoute();
const authStore = useAuthStore();
const listings = ref([]);
const favorites = ref([]);
const loading = ref(true);
const mounted = ref(false);
const sortBy = ref('newest');

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

const filters = reactive({
  search: '',
  type: '',
  priceRange: '',
  province: '',
  condition: ''
});

const provinces = ref([]);

const propertyTypes = [
  { value: '', label: 'ทั้งหมด', icon: '🏘️' },
  { value: 'Condo', label: 'คอนโด', icon: '🏢' },
  { value: 'House', label: 'บ้านเดี่ยว', icon: '🏠' },
  { value: 'Land', label: 'ที่ดิน', icon: '🏞️' },
  { value: 'Commercial', label: 'อาคารพาณิชย์', icon: '🏬' }
];

const priceRanges = [
  { value: 'under_1m', label: 'ต่ำกว่า 1 ล้านบาท' },
  { value: '1m_3m', label: '1 - 3 ล้านบาท' },
  { value: '3m_5m', label: '3 - 5 ล้านบาท' },
  { value: '5m_10m', label: '5 - 10 ล้านบาท' },
  { value: 'above_10m', label: 'มากกว่า 10 ล้านบาท' }
];



const filteredListings = computed(() => {
  let result = listings.value.filter(listing => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchTitle = (listing.title || '').toLowerCase().includes(searchLower);
      const matchLocation = (listing.location || '').toLowerCase().includes(searchLower);
      if (!matchTitle && !matchLocation) return false;
    }

    // Type filter
    if (filters.type && listing.type !== filters.type) return false;

    // Province filter
    if (filters.province && listing.province !== filters.province) return false;

    // Condition filter
    if (filters.condition && listing.property_condition !== filters.condition) return false;

    // Price range filter
    const price = Number(listing.price);
    if (filters.priceRange) {
      if (filters.priceRange === 'under_1m' && price >= 1000000) return false;
      if (filters.priceRange === '1m_3m' && (price < 1000000 || price > 3000000)) return false;
      if (filters.priceRange === '3m_5m' && (price < 3000000 || price > 5000000)) return false;
      if (filters.priceRange === '5m_10m' && (price < 5000000 || price > 10000000)) return false;
      if (filters.priceRange === 'above_10m' && price <= 10000000) return false;
    }

    return true;
  });

  // Sorting
  if (sortBy.value === 'price_low') {
    result = result.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy.value === 'price_high') {
    result = result.sort((a, b) => Number(b.price) - Number(a.price));
  } else {
    result = result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return result;
});

// Pagination
const itemsPerPage = 10;
const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.ceil(filteredListings.value.length / itemsPerPage);
});

const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredListings.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  // Show max 5 page buttons
  let start = Math.max(1, current - 2);
  let end = Math.min(total, start + 4);
  
  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Scroll to top of listings
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }
};

// Reset page when filters change
watch([filters, sortBy], () => {
  currentPage.value = 1;
});

const resetFilters = () => {
  filters.search = '';
  filters.type = '';
  filters.priceRange = '';
  filters.province = '';
  filters.condition = '';
  currentPage.value = 1;
};

onMounted(async () => {
  // Load provinces (client-side only)
  provinces.value = await getProvinces();

  // Read query params and apply to filters
  if (route.query.type) filters.type = route.query.type;
  if (route.query.province) filters.province = route.query.province;
  if (route.query.priceRange) filters.priceRange = route.query.priceRange;
  if (route.query.condition) filters.condition = route.query.condition;
  if (route.query.search) filters.search = route.query.search;

  try {
    const response = await axios.get('http://localhost:5000/api/listings');
    listings.value = response.data;
    await fetchFavorites();
  } catch (error) {
    console.error('Failed to fetch listings', error);
  } finally {
    loading.value = false;
    // Trigger fade animation
    setTimeout(() => {
      mounted.value = true;
    }, 100);
  }
});

const fetchFavorites = async () => {
  if (authStore.user) {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      favorites.value = response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
};

const toggleFavorite = async (id) => {
  if (!authStore.user) {
    router.push('/login');
    return;
  }
  
  try {
    const response = await axios.post('http://localhost:5000/api/favorites/toggle', 
      { listingId: id },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    );
    
    // Response logic: toggle assumes API returns boolean or just toggle local state
    // Our API returns { favorited: true/false }
    if (response.data.favorited) {
      if (!favorites.value.includes(id)) favorites.value.push(id);
    } else {
      const index = favorites.value.indexOf(id);
      if (index > -1) favorites.value.splice(index, 1);
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    const { $alertify } = useNuxtApp();
    $alertify.error('เกิดข้อผิดพลาดในการบันทึกรายการโปรด');
  }
};
</script>
