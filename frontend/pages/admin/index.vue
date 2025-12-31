<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">แผงควบคุมผู้ดูแลระบบ</h1>
          <div class="flex items-center gap-2 text-gray-500">
            <p>จัดการผู้ใช้และระบบ</p>
            <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 border border-gray-200">
              Role: {{ authStore.user?.role || 'unknown' }}
            </span>
          </div>
        </div>
        <NuxtLink 
          v-if="authStore.user && authStore.user.role === 'superadmin'"
          to="/admin/settings" 
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <i class="fas fa-cog"></i> ตั้งค่าระบบ
        </NuxtLink>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-users text-blue-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ users.length }}</div>
              <div class="text-gray-500 text-sm">ผู้ใช้ทั้งหมด</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user-check text-green-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ approvedCount }}</div>
              <div class="text-gray-500 text-sm">ผู้ใช้ที่อนุมัติ</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i class="fas fa-clock text-yellow-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ pendingCount }}</div>
              <div class="text-gray-500 text-sm">รอการอนุมัติ</div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <i class="fas fa-ban text-red-600"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ blockedCount }}</div>
              <div class="text-gray-500 text-sm">ถูกระงับ</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-green-600"></i>
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">รายชื่อผู้ใช้</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">ID</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">ชื่อผู้ใช้</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">อีเมล</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">บทบาท</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">สถานะ</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900">{{ user.id }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.username }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-purple-100 text-purple-800': user.role === 'superadmin',
                      'bg-blue-100 text-blue-800': user.role === 'admin',
                      'bg-gray-100 text-gray-800': user.role === 'user'
                    }"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': user.status === 'approved',
                      'bg-yellow-100 text-yellow-800': user.status === 'pending',
                      'bg-red-100 text-red-800': user.status === 'blocked'
                    }"
                  >
                    {{ user.status === 'approved' ? 'อนุมัติ' : user.status === 'pending' ? 'รอดำเนินการ' : 'ถูกระงับ' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button 
                      v-if="user.status === 'pending'" 
                      @click="approveUser(user.id)" 
                      class="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded transition-colors"
                    >
                      <i class="fas fa-check"></i> อนุมัติ
                    </button>
                    <button 
                      v-if="user.status !== 'blocked'" 
                      @click="blockUser(user.id)" 
                      class="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1 rounded transition-colors"
                    >
                      <i class="fas fa-ban"></i> ระงับ
                    </button>
                    <button 
                      v-if="user.status === 'blocked'" 
                      @click="approveUser(user.id)" 
                      class="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded transition-colors"
                    >
                      <i class="fas fa-unlock"></i> ปลดระงับ
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const users = ref([]);
const loading = ref(true);

const approvedCount = computed(() => users.value.filter(u => u.status === 'approved').length);
const pendingCount = computed(() => users.value.filter(u => u.status === 'pending').length);
const blockedCount = computed(() => users.value.filter(u => u.status === 'blocked').length);

onMounted(async () => {
    if (!authStore.user || (authStore.user.role !== 'admin' && authStore.user.role !== 'superadmin')) {
        router.push('/');
        return;
    }
    await fetchUsers();
});

const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        users.value = response.data;
    } catch (error) {
        console.error('Error fetching users', error);
    } finally {
        loading.value = false;
    }
};

const approveUser = async (id) => {
    try {
        await axios.put(`http://localhost:5000/api/users/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        const user = users.value.find(u => u.id === id);
        if (user) user.status = 'approved';
    } catch (error) {
        alert('ดำเนินการไม่สำเร็จ');
    }
};

const blockUser = async (id) => {
    if (!confirm('คุณต้องการระงับผู้ใช้นี้หรือไม่?')) return;
    try {
        await axios.put(`http://localhost:5000/api/users/${id}/block`, {}, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        const user = users.value.find(u => u.id === id);
        if (user) user.status = 'blocked';
    } catch (error) {
        alert('ดำเนินการไม่สำเร็จ');
    }
};
</script>
