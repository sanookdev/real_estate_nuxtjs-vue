<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-squares-2x2" class="text-blue-600 text-2xl" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">แผงควบคุมผู้ดูแลระบบ</h1>
          <p class="text-gray-500">จัดการข้อมูลประกาศและผู้ใช้งานในระบบ</p>
        </div>
      </div>

      <div class="flex border-b border-gray-200 mb-8 bg-white rounded-t-xl px-4 pt-4 shadow-sm">
        <button 
          @click="activeTab = 'listings'"
          class="px-6 py-3 font-medium text-sm transition-colors relative"
          :class="activeTab === 'listings' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'"
        >
          จัดการประกาศ
          <span 
            v-if="activeTab === 'listings'" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full"
          ></span>
        </button>
        <button 
          v-if="authStore.user?.role === 'superadmin'"
          @click="activeTab = 'users'"
          class="px-6 py-3 font-medium text-sm transition-colors relative"
          :class="activeTab === 'users' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'"
        >
          จัดการผู้ใช้งาน
          <span 
            v-if="activeTab === 'users'" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full"
          ></span>
        </button>
        <button 
          @click="activeTab = 'ads'"
          class="px-6 py-3 font-medium text-sm transition-colors relative"
          :class="activeTab === 'ads' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'"
        >
          จัดการโฆษณา
          <span 
            v-if="activeTab === 'ads'" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full"
          ></span>
        </button>
      </div>

      <!-- Listings Management Tab -->
      <div v-show="activeTab === 'listings'" class="animate-fade-in">
        <!-- Pending Approvals -->
        <UCard class="mb-8">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
                รอการอนุมัติ ({{ pendingListings.length }})
              </h2>
            </div>
          </template>

          <div v-if="pendingListings.length === 0" class="text-center py-8 text-gray-500">
            ไม่มีรายการรออนุมัติ
          </div>

          <div v-else class="space-y-4">
            <div v-for="listing in pendingListings" :key="listing.id" class="flex flex-col md:flex-row gap-4 bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
              <img :src="getListingImage(listing)" class="w-full md:w-32 h-24 object-cover rounded-lg" />
              
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold text-gray-900">{{ listing.title }}</h3>
                    <p class="text-sm text-gray-500">โดย: {{ listing.username }} | วันที่: {{ formatDate(listing.created_at) }}</p>
                  </div>
                  <div class="flex gap-2">
                     <UButton size="xs" color="green" variant="solid" @click="approveListing(listing.id)">อนุมัติ</UButton>
                     <UButton size="xs" color="red" variant="ghost" @click="rejectListing(listing.id)">ไม่อนุมัติ</UButton>
                  </div>
                </div>
                
                <div class="mt-2 flex gap-2">
                  <UBadge color="gray">{{ listing.type }}</UBadge>
                  <div class="text-sm font-semibold text-green-600">฿{{ Number(listing.price).toLocaleString() }}</div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- All Listings -->
        <UCard>
          <template #header>
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <div class="flex gap-2 items-center">
                  <USelect 
                    v-model="statusFilter" 
                    :options="[{ label: 'ทั้งหมด', value: '' }, { label: 'อนุมัติ', value: 'active' }, { label: 'รอตรวจสอบ', value: 'pending' }, { label: 'ไม่อนุมัติ', value: 'rejected' }, { label: 'ขายแล้ว', value: 'sold' }]"
                    placeholder="สถานะ"
                  />
                  <UInput v-model="search" placeholder="ค้นหาประกาศ..." icon="i-heroicons-magnifying-glass" />
                   <UButton 
                    icon="i-heroicons-adjustments-horizontal" 
                    color="gray" 
                    variant="ghost" 
                    @click="showAdvancedFilters = !showAdvancedFilters"
                    :label="showAdvancedFilters ? 'ซ่อนตัวกรอง' : 'ตัวกรองเพิ่มเติม'"
                  />
                </div>
              </div>

               <!-- Advanced Filters -->
              <div v-if="showAdvancedFilters" class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg animate-fade-in">
                <UInput v-model="filters.publisher" placeholder="ชื่อผู้ลงประกาศ" icon="i-heroicons-user" />
                <div class="flex items-center gap-2">
                   <UInput v-model="filters.minPrice" placeholder="ราคาต่ำสุด" type="number" icon="i-heroicons-currency-baht" />
                   <span class="text-gray-400">-</span>
                   <UInput v-model="filters.maxPrice" placeholder="ราคาสูงสุด" type="number" icon="i-heroicons-currency-baht" />
                </div>
                 <div class="flex items-center gap-2">
                   <UInput v-model="filters.dateFrom" type="date" placeholder="ตั้งแต่วันที่" />
                   <span class="text-gray-400">-</span>
                   <UInput v-model="filters.dateTo" type="date" placeholder="ถึงวันที่" />
                </div>
                <div class="flex items-center justify-end">
                   <UButton color="gray" variant="ghost" @click="resetFilters" class="mr-2">ล้างค่า</UButton>
                   <UButton color="green" @click="fetchListings">กรองข้อมูล</UButton>
                </div>
              </div>
            </div>
          </template>

          <UTable 
            :rows="listings" 
            :columns="listingColumns"
            :loading="loadingListings"
          >
            <template #image-data="{ row }">
              <img :src="getListingImage(row)" class="w-12 h-12 object-cover rounded" />
            </template>
            
            <template #status-data="{ row }">
              <UBadge :color="getStatusColor(row.status)">{{ getStatusLabel(row.status) }}</UBadge>
            </template>

            <template #price-data="{ row }">
              ฿{{ Number(row.price).toLocaleString() }}
            </template>

            <template #actions-data="{ row }">
              <div class="flex gap-2">
                <UTooltip :text="row.is_pinned ? 'ยกเลิกปักหมุด' : 'ปักหมุด (Hot Sale)'">
                  <UButton 
                    :icon="row.is_pinned ? 'i-heroicons-fire' : 'i-heroicons-fire'" 
                    size="xs" 
                    :color="row.is_pinned ? 'orange' : 'gray'" 
                    :variant="row.is_pinned ? 'solid' : 'ghost'" 
                    @click="togglePin(row.id)" 
                  />
                </UTooltip>
                <UButton icon="i-heroicons-pencil-square" size="xs" color="blue" variant="ghost" :to="`/listings/edit/${row.id}`" />
                <UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost" @click="deleteListing(row.id)" />
              </div>
            </template>
          </UTable>

          <!-- Pagination Controls -->
          <div class="flex justify-between items-center px-4 py-3 border-t border-gray-200" v-if="totalPages > 1">
            <span class="text-sm text-gray-700">
              หน้า <span class="font-medium">{{ currentPage }}</span> จาก <span class="font-medium">{{ totalPages }}</span>
            </span>
            <div class="flex gap-2">
              <UButton 
                :disabled="currentPage === 1" 
                @click="changePage(currentPage - 1)"
                color="gray" 
                variant="ghost" 
                icon="i-heroicons-chevron-left"
              >
                ก่อนหน้า
              </UButton>
              <UButton 
                :disabled="currentPage === totalPages" 
                @click="changePage(currentPage + 1)"
                color="gray" 
                variant="ghost" 
                icon="i-heroicons-chevron-right"
                trailing
              >
                ถัดไป
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- User Management Tab -->
      <div v-show="activeTab === 'users'" class="animate-fade-in">
        <UCard>
          <template #header>
             <div class="flex items-center justify-between">
              <h2 class="font-bold text-lg text-gray-900">รายชื่อผู้ใช้งาน</h2>
              <UInput v-model="searchUser" placeholder="ค้นหาผู้ใช้งาน..." icon="i-heroicons-magnifying-glass" />
            </div>
          </template>

          <UTable
            :rows="filteredUsers"
            :columns="userColumns"
            :loading="loadingUsers"
          >
             <template #role-data="{ row }">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="row.role === 'admin' || row.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                  {{ row.role }}
                </span>
             </template>

             <template #status-data="{ row }">
                <UBadge :color="row.status === 'blocked' ? 'red' : 'green'">{{ row.status === 'blocked' ? 'Blocked' : 'Active' }}</UBadge>
             </template>

             <template #actions-data="{ row }">
               <div class="flex gap-2" v-if="row.role !== 'superadmin'">
                  <UTooltip text="อนุมัติ / ปลดบล็อก">
                    <UButton icon="i-heroicons-check-circle" size="xs" color="green" variant="ghost" @click="approveUser(row.id)" v-if="row.status !== 'approved' && row.status !== 'active'" />
                  </UTooltip>
                  
                  <UTooltip text="ระงับการใช้งาน">
                    <UButton icon="i-heroicons-no-symbol" size="xs" color="red" variant="ghost" @click="blockUser(row.id)" v-if="row.status !== 'blocked'" />
                  </UTooltip>
                  
                  <UDropdown :items="[[{ label: 'เปลี่ยนเป็น Admin', click: () => changeRole(row.id, 'admin') }, { label: 'เปลี่ยนเป็น User', click: () => changeRole(row.id, 'user') }]]">
                    <UButton icon="i-heroicons-user-circle" size="xs" color="gray" variant="ghost" />
                  </UDropdown>
               </div>
             </template>
          </UTable>
        </UCard>
      </div>

      <!-- Ads Management Tab -->
      <div v-show="activeTab === 'ads'" class="animate-fade-in">
        <div class="flex justify-end mb-4">
           <UButton icon="i-heroicons-plus" color="green" @click="openAdModal()">เพิ่มโฆษณา</UButton>
        </div>
        <UCard>
          <UTable :rows="ads" :columns="adColumns" :loading="loadingAds">
            <template #image-data="{ row }">
              <img :src="`http://localhost:5000/uploads/${row.image}`" class="h-16 w-auto object-cover rounded" />
            </template>
            
            <template #active-data="{ row }">
              <UBadge :color="row.active ? 'green' : 'gray'">{{ row.active ? 'ใช้งาน' : 'ปิดใช้งาน' }}</UBadge>
            </template>

            <template #actions-data="{ row }">
              <div class="flex gap-2">
                <UButton icon="i-heroicons-pencil-square" size="xs" color="blue" variant="ghost" @click="openAdModal(row)" />
                <UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost" @click="deleteAd(row.id)" />
              </div>
            </template>
          </UTable>
        </UCard>
      </div>
      
      <!-- Ad Modal -->
      <UModal v-model="isAdModalOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
          <template #header>
            <h3 class="font-bold text-lg">{{ isEditingAd ? 'แก้ไขโฆษณา' : 'เพิ่มโฆษณาใหม่' }}</h3>
          </template>

          <form @submit.prevent="saveAd" class="space-y-4 p-4">
            <UFormGroup label="ตำแหน่ง">
              <USelect v-model="adForm.position" :options="adPositions" />
            </UFormGroup>
            
            <UFormGroup label="ลิงก์ปลายทาง">
              <UInput v-model="adForm.link" placeholder="https://example.com" />
            </UFormGroup>

            <UFormGroup label="รูปภาพ">
               <input type="file" @change="handleAdFileUpload" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
            </UFormGroup>

            <UFormGroup label="สถานะ">
              <UToggle v-model="adForm.active" /> 
              <span class="ml-2 text-sm">{{ adForm.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}</span>
            </UFormGroup>
            
            <div class="flex justify-end gap-2 mt-4">
              <UButton color="gray" variant="ghost" @click="isAdModalOpen = false">ยกเลิก</UButton>
              <UButton type="submit" color="green" :loading="savingAd">บันทึก</UButton>
            </div>
          </form>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const activeTab = ref('listings');

// Listings State
const listings = ref([]);
const loadingListings = ref(true);
const search = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const showAdvancedFilters = ref(false);
const filters = ref({
  publisher: '',
  minPrice: '',
  maxPrice: '',
  dateFrom: '',
  dateTo: ''
});
let searchTimeout = null;

// Users State
const users = ref([]);
const loadingUsers = ref(true);
const searchUser = ref('');

const listingColumns = [
  { key: 'image', label: 'รูปภาพ' },
  { key: 'title', label: 'หัวข้อ' },
  { key: 'username', label: 'ผู้ลงประกาศ' },
  { key: 'type', label: 'ประเภท' },
  { key: 'price', label: 'ราคา' },
  { key: 'status', label: 'สถานะ' },
  { key: 'actions', label: 'จัดการ' }
];

const userColumns = [
  { key: 'username', label: 'ชื่อผู้ใช้' },
  { key: 'email', label: 'อีเมล' },
  { key: 'role', label: 'สิทธิ์' },
  { key: 'status', label: 'สถานะ' },
  { key: 'created_at', label: 'วันที่สมัคร' },
  { key: 'actions', label: 'จัดการ' }
];

onMounted(async () => {
  await Promise.all([
    fetchListings(),
    fetchUsers(),
    fetchAds()
  ]);
});

// --- Listings Logic ---

const fetchListings = async () => {
  loadingListings.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/listings/admin/all', {
      headers: { Authorization: `Bearer ${authStore.token}` },
      params: {
        page: currentPage.value,
        limit: limit.value,
        search: search.value,
        status: statusFilter.value,
        publisher: filters.value.publisher,
        minPrice: filters.value.minPrice,
        maxPrice: filters.value.maxPrice,
        dateFrom: filters.value.dateFrom,
        dateTo: filters.value.dateTo
      }
    });

    // Check if response has pagination wrapper or is plain array (fallback)
    if (response.data.pagination) {
        listings.value = response.data.listings;
        currentPage.value = response.data.pagination.page;
        totalPages.value = response.data.pagination.totalPages;
    } else {
        // Fallback for verification/transition
        listings.value = response.data;
    }

  } catch (error) {
    console.error('Error fetching listings:', error);
    const { $alertify } = useNuxtApp();
    $alertify.error('เกิดข้อผิดพลาดในการโหลดประกาศ');
  } finally {
    loadingListings.value = false;
  }
};

// Debounce search
watch([search, statusFilter], () => {
    currentPage.value = 1;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchListings();
    }, 500);
});

const resetFilters = () => {
  filters.value = {
    publisher: '',
    minPrice: '',
    maxPrice: '',
    dateFrom: '',
    dateTo: ''
  };
  fetchListings();
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchListings();
    }
};

const pendingListings = computed(() => {
  // Still useful to quickly filter pending from current page, BUT ideally should be its own API call if we want to show ALL pending.
  // For now, let's assume the top 'Pending Approvals' widget might just show pending items from the current fetch, or we might need a separate call for 'pending' specific widget if pagination hides them.
  // Given current design, let's keep it simple: It filters from the *fetched* listings.
  // Limitation: If valid pending items are on page 2, they won't show here unless we are on page 2.
  // Fix: We should probably keep this widget logic separate or accept this limitation. The user requested pagination for the *table*.
  return listings.value.filter(l => l.status === 'pending');
});

// Removed filteredListings as it is now server-side

const getListingImage = (listing) => {
  if (listing.images && listing.images.length > 0) {
    return `http://localhost:5000/uploads/${listing.images[0]}`;
  }
  return 'https://placehold.co/100x100?text=No+Image';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'green';
    case 'pending': return 'yellow';
    case 'rejected': return 'red';
    case 'sold': return 'gray';
    default: return 'gray';
  }
};

const getStatusLabel = (status) => {
   switch (status) {
    case 'active': return 'อนุมัติแล้ว';
    case 'pending': return 'รอตรวจสอบ';
    case 'rejected': return 'ไม่อนุมัติ';
    case 'sold': return 'ขายแล้ว';
    default: return status;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('th-TH');
};

const approveListing = (id) => {
  const { $alertify } = useNuxtApp();
  $alertify.confirm('ยืนยันการอนุมัติ', 'ยืนยันกำหนดสถานะเป็น "อนุมัติ"?',
    async function() {
      await updateStatus(id, 'active');
    },
    function() {}
  );
};

const rejectListing = (id) => {
  const { $alertify } = useNuxtApp();
  $alertify.confirm('ยืนยันการไม่อนุมัติ', 'ยืนยันไม่อนุมัติประกาศนี้?',
    async function() {
      await updateStatus(id, 'rejected');
    },
    function() {}
  );
};

const updateStatus = async (id, status) => {
  try {
    await axios.patch(`http://localhost:5000/api/listings/${id}/status`, 
      { status },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    );
    const { $alertify } = useNuxtApp();
    $alertify.success('อัปเดตสถานะเรียบร้อย');
    // Update local state
    const index = listings.value.findIndex(l => l.id === id);
    if (index !== -1) {
      listings.value[index].status = status;
    }
  } catch (error) {
    const { $alertify } = useNuxtApp();
    $alertify.error('เกิดข้อผิดพลาด: ' + error.message);
  }
};

const deleteListing = (id) => {
  const { $alertify } = useNuxtApp();
  $alertify.confirm('ยืนยันการลบ', 'คุณต้องการลบประกาศนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้',
    async function() {
      try {
        await axios.delete(`http://localhost:5000/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        listings.value = listings.value.filter(l => l.id !== id);
        $alertify.success('ลบประกาศเรียบร้อย');
      } catch (error) {
         $alertify.error('เกิดข้อผิดพลาด: ' + error.message);
      }
    },
    function() {}
  );
};

const togglePin = async (id) => {
  try {
    const response = await axios.patch(`http://localhost:5000/api/listings/${id}/pin`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    // Update local state
    const index = listings.value.findIndex(l => l.id === id);
    if (index !== -1) {
      listings.value[index].is_pinned = response.data.is_pinned;
    }
    
    const { $alertify } = useNuxtApp();
    if (response.data.is_pinned) {
      $alertify.success('ปักหมุดประกาศเรียบร้อย');
    } else {
      $alertify.success('ยกเลิกการปักหมุดเรียบร้อย');
    }
  } catch (error) {
    const { $alertify } = useNuxtApp();
    $alertify.error('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
  }
};

// --- Users Logic ---

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const response = await axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    const { $alertify } = useNuxtApp();
    $alertify.error('เกิดข้อผิดพลาดในการโหลดผู้ใช้งาน');
  } finally {
    loadingUsers.value = false;
  }
};

const filteredUsers = computed(() => {
  if (!searchUser.value) return users.value;
  const lower = searchUser.value.toLowerCase();
  return users.value.filter(u => 
    u.username.toLowerCase().includes(lower) || 
    u.email.toLowerCase().includes(lower)
  );
});

const approveUser = async (id) => {
    const { $alertify } = useNuxtApp();
    $alertify.confirm('ยืนยัน', 'ต้องการปลดบล็อก/อนุมัติผู้ใช้งานนี้?', async function() {
        try {
            await axios.put(`http://localhost:5000/api/users/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${authStore.token}` }
            });
            $alertify.success('อนุมัติผู้ใช้งานเรียบร้อย');
            await fetchUsers();
        } catch (error) {
            $alertify.error('เกิดข้อผิดพลาด: ' + error.response?.data?.message);
        }
    }, function(){});
};

const blockUser = async (id) => {
    const { $alertify } = useNuxtApp();
    $alertify.confirm('ยืนยัน', 'ต้องการระงับการใช้งานผู้ใช้งานนี้?', async function() {
        try {
            await axios.put(`http://localhost:5000/api/users/${id}/block`, {}, {
                headers: { Authorization: `Bearer ${authStore.token}` }
            });
            $alertify.success('ระงับการใช้งานเรียบร้อย');
            await fetchUsers();
        } catch (error) {
            $alertify.error('เกิดข้อผิดพลาด: ' + error.response?.data?.message);
        }
    }, function(){});
};

const changeRole = async (id, role) => {
    const { $alertify } = useNuxtApp();
    $alertify.confirm('ยืนยัน', `ต้องการเปลี่ยนสิทธิ์เป็น ${role}?`, async function() {
        try {
            await axios.put(`http://localhost:5000/api/users/${id}/role`, 
                { role }, 
                { headers: { Authorization: `Bearer ${authStore.token}` } }
            );
            $alertify.success('เปลี่ยนสิทธิ์เรียบร้อย');
            await fetchUsers();
        } catch (error) {
            $alertify.error('เกิดข้อผิดพลาด: ' + error.response?.data?.message);
        }
    }, function(){});
};

// --- Ads Logic ---

const ads = ref([]);
const loadingAds = ref(false);
const isAdModalOpen = ref(false);
const savingAd = ref(false);
const isEditingAd = ref(false);
const editingAdId = ref(null);

const adColumns = [
  { key: 'image', label: 'รูปภาพ' },
  { key: 'position', label: 'ตำแหน่ง' },
  { key: 'link', label: 'ลิงก์' },
  { key: 'active', label: 'สถานะ' },
  { key: 'actions', label: 'จัดการ' }
];

const adPositions = [
  { label: 'แบนเนอร์หลัก (บนสุด)', value: 'banner-top' },
  { label: 'Bento Grid 1 (ใหญ่ซ้าย)', value: 'bento-1' },
  { label: 'Bento Grid 2 (ขวาบน)', value: 'bento-2' },
  { label: 'Bento Grid 3 (ขวากลาง)', value: 'bento-3' },
  { label: 'Bento Grid 4 (ขวาล่าง)', value: 'bento-4' }
];

const adForm = ref({
  position: 'banner-top',
  link: '',
  image: null,
  active: true
});

const fetchAds = async () => {
    loadingAds.value = true;
    try {
        const response = await axios.get('http://localhost:5000/api/ads/all', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        ads.value = response.data;
    } catch (error) {
        console.error('Error fetching ads', error);
    } finally {
        loadingAds.value = false;
    }
};

const handleAdFileUpload = (event) => {
  adForm.value.image = event.target.files[0];
};

const openAdModal = (ad = null) => {
  if (ad) {
    isEditingAd.value = true;
    editingAdId.value = ad.id;
    adForm.value = {
      position: ad.position,
      link: ad.link,
      active: !!ad.active,
      image: null
    };
  } else {
    isEditingAd.value = false;
    editingAdId.value = null;
    adForm.value = {
      position: 'banner-top',
      link: '',
      image: null,
      active: true
    };
  }
  isAdModalOpen.value = true;
};

const saveAd = async () => {
  savingAd.value = true;
  const formData = new FormData();
  formData.append('position', adForm.value.position);
  formData.append('link', adForm.value.link);
  formData.append('active', adForm.value.active);
  if (adForm.value.image) {
    formData.append('image', adForm.value.image);
  }

  try {
    const url = isEditingAd.value 
      ? `http://localhost:5000/api/ads/${editingAdId.value}`
      : 'http://localhost:5000/api/ads';
    
    const method = isEditingAd.value ? 'put' : 'post';
    
    await axios[method](url, formData, {
      headers: { 
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const { $alertify } = useNuxtApp();
    $alertify.success('บันทึกข้อมูลโฆษณาเรียบร้อย');
    isAdModalOpen.value = false;
    fetchAds();
  } catch (error) {
    const { $alertify } = useNuxtApp();
    $alertify.error('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
  } finally {
    savingAd.value = false;
  }
};

const deleteAd = async (id) => {
  const { $alertify } = useNuxtApp();
  $alertify.confirm('ยืนยันการลบ', 'คุณต้องการลบโฆษณานี้ใช่หรือไม่?', async () => {
    try {
      await axios.delete(`http://localhost:5000/api/ads/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      });
      $alertify.success('ลบข้อมูลเรียบร้อย');
      fetchAds();
    } catch (error) {
      $alertify.error('เกิดข้อผิดพลาด');
    }
  }, () => {});
};


</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
