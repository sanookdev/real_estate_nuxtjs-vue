<template>
  <div class="overflow-x-hidden">
    <!-- Fade Overlay for Search Animation -->
    <Transition name="fade">
      <div v-if="isSearching" class="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
        <div class="animate-pulse">
          <i class="fas fa-search text-6xl text-green-600 mb-4"></i>
        </div>
        <p class="text-xl text-gray-600 animate-pulse">กำลังค้นหา...</p>
      </div>
    </Transition>

    <!-- Hero Section with Parallax -->
    <section class="relative min-h-screen bg-cover bg-center bg-fixed flex items-center overflow-hidden hero-bg">
      <!-- Animated Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/60 to-black/70"></div>
      
      <!-- Floating Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div class="absolute bottom-32 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-float-medium"></div>
        <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-fast"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 w-full max-w-7xl mx-auto px-4 text-center text-white pt-20">
        <!-- Animated Title -->
        <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-on-load">
          <span class="block text-white">ค้นหาบ้านในฝัน</span>
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mt-2">
            ที่คุณวาดไว้
          </span>
        </h1>
        
        <p class="text-xl md:text-2xl font-light mb-10 text-green-100 max-w-2xl mx-auto animate-on-load delay-1">
          รวมอสังหาริมทรัพย์คุณภาพ คอนโด บ้าน ที่ดิน ในทำเลทอง ทั่วประเทศไทย
        </p>
        
        <!-- Search Box with Glass Effect -->
        <div class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-white/20 animate-on-load delay-2">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2 text-left">จังหวัด</label>
              <select v-model="searchProvince" class="w-full px-4 py-3 bg-white/90 backdrop-blur border-0 rounded-xl focus:ring-2 focus:ring-yellow-400 text-gray-900 transition-all hover:bg-white">
                <option value="">ทุกจังหวัด</option>
                <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2 text-left">ประเภท</label>
              <select v-model="searchType" class="w-full px-4 py-3 bg-white/90 backdrop-blur border-0 rounded-xl focus:ring-2 focus:ring-yellow-400 text-gray-900 transition-all hover:bg-white">
                <option value="">ทุกประเภท</option>
                <option v-for="type in propertyTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2 text-left">ราคา</label>
              <select v-model="searchPrice" class="w-full px-4 py-3 bg-white/90 backdrop-blur border-0 rounded-xl focus:ring-2 focus:ring-yellow-400 text-gray-900 transition-all hover:bg-white">
                <option value="">ทุกราคา</option>
                <option v-for="price in priceOptions" :key="price.value" :value="price.value">{{ price.label }}</option>
              </select>
            </div>
            <div class="flex items-end">
              <button 
                @click="handleSearch" 
                class="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-2 group"
              >
                <i class="fas fa-search group-hover:rotate-12 transition-transform"></i> ค้นหา
              </button>
            </div>
          </div>
        </div>
        
        <!-- Stats Counter -->
        <div class="flex flex-wrap justify-center gap-8 mt-12 animate-on-load delay-3">
          <div class="text-center group cursor-default">
            <p class="text-4xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">{{ listings.length }}+</p>
            <p class="text-white/80">ประกาศที่พร้อมขาย</p>
          </div>
          <div class="text-center group cursor-default">
            <p class="text-4xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">10+</p>
            <p class="text-white/80">จังหวัดทั่วไทย</p>
          </div>
          <div class="text-center group cursor-default">
            <p class="text-4xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">100%</p>
            <p class="text-white/80">ปลอดภัย & น่าเชื่อถือ</p>
          </div>
        </div>
        
        <!-- Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" @click="scrollToCategories">
          <i class="fas fa-chevron-down text-3xl text-white/50 hover:text-white transition-colors"></i>
        </div>
      </div>
    </section>

    <!-- Top Banner Ad -->
    <div 
      v-if="ads.banner_top" 
      class="max-w-7xl mx-auto px-4 mt-8 mb-8 opacity-0 translate-y-8 transition-all duration-700" 
      :class="{ 'opacity-100 translate-y-0': adsVisible }"
      v-intersection-observer="onAdsVisible"
    >
      <a :href="ads.banner_top.link" target="_blank" class="block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <img :src="`http://localhost:5000/uploads/${ads.banner_top.image}`" class="w-full h-32 md:h-48 object-cover" />
      </a>
    </div>

    <!-- Features Section with Bento Grid Ads -->
     <section class="py-12 bg-white">
      <div 
        class="max-w-7xl mx-auto px-4 opacity-0 translate-y-8 transition-all duration-700 delay-200"
         :class="{ 'opacity-100 translate-y-0': adsVisible }"
         v-intersection-observer="onAdsVisible"
      >
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Featured Ad (Big) -->
            <div class="lg:col-span-2 space-y-8">
               <div v-if="ads.bento_1" class="rounded-3xl overflow-hidden relative group h-96 shadow-lg">
                  <a :href="ads.bento_1.link" target="_blank" class="block h-full">
                     <img :src="`http://localhost:5000/uploads/${ads.bento_1.image}`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <span class="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-2">แนะนำ</span>
                     </div>
                  </a>
               </div>
            </div>

            <!-- Right: Small Ads Grid -->
            <div class="grid grid-rows-3 gap-4 h-96">
                <!-- Top Right -->
                <div v-if="ads.bento_2" class="rounded-2xl overflow-hidden shadow-md relative group">
                   <a :href="ads.bento_2.link" target="_blank" class="block h-full">
                      <img :src="`http://localhost:5000/uploads/${ads.bento_2.image}`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </a>
                </div>
                 <!-- Middle Right -->
                <div v-if="ads.bento_3" class="rounded-2xl overflow-hidden shadow-md relative group">
                    <a :href="ads.bento_3.link" target="_blank" class="block h-full">
                      <img :src="`http://localhost:5000/uploads/${ads.bento_3.image}`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </a>
                </div>
                 <!-- Bottom Right -->
                <div v-if="ads.bento_4" class="rounded-2xl overflow-hidden shadow-md relative group">
                    <a :href="ads.bento_4.link" target="_blank" class="block h-full">
                      <img :src="`http://localhost:5000/uploads/${ads.bento_4.image}`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </a>
                </div>
            </div>
         </div>
      </div>
    </section>
    <!-- Featured Properties -->
    <section class="py-20 bg-gray-50 relative">
      <div class="max-w-7xl mx-auto px-4" v-intersection-observer="onListingsVisible">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 
              class="text-4xl font-bold text-gray-900 opacity-0 -translate-x-8 transition-all duration-700"
              :class="{ 'opacity-100 translate-x-0': listingsVisible }"
            >
              ทรัพย์สินแนะนำ
            </h2>
            <p 
              class="text-gray-500 mt-2 opacity-0 -translate-x-8 transition-all duration-700 delay-100"
              :class="{ 'opacity-100 translate-x-0': listingsVisible }"
            >
              คัดสรรอสังหาริมทรัพย์คุณภาพเพื่อคุณ
            </p>
          </div>
          <NuxtLink 
            to="/listings" 
            class="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 group opacity-0 translate-x-8 transition-all duration-700"
            :class="{ 'opacity-100 translate-x-0': listingsVisible }"
          >
            ดูทั้งหมด 
            <i class="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </NuxtLink>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-600"></div>
          </div>
        </div>
        
        <div v-else-if="listings.length === 0" class="text-center py-12 bg-white rounded-xl">
          <p class="text-xl text-gray-500">ไม่พบรายการประกาศ</p>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="(listing, index) in listings.slice(0, 8)" 
            :key="listing.id" 
            :to="`/listings/${listing.id}`"
            class="group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 opacity-0 translate-y-8"
            :class="{ 'opacity-100 translate-y-0': listingsVisible }"
            :style="{ transitionDelay: `${index * 100 + 200}ms` }"
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
              
              <!-- Favorite Button with Micro-interaction -->
              <button 
                @click.prevent="toggleFavorite(listing.id)" 
                class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
              >
                <i 
                  class="fas fa-heart transition-colors"
                  :class="favorites.includes(listing.id) ? 'text-red-500' : 'text-gray-400'"
                ></i>
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
                <i class="fas fa-map-marker-alt text-green-600"></i>
                {{ listing.province || listing.location }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
   <!-- Parallax Area Gallery -->
    <section class="min-h-[80vh] relative overflow-hidden flex items-center justify-center py-24">
      <!-- Expanding Background (Slide Up Effect) -->
      <div 
        class="absolute inset-0 bg-[url('/images/hero-banner.png')] bg-cover bg-center transition-all duration-1000 ease-out z-0"
        :class="areasVisible ? 'translate-y-0 opacity-100 rounded-none' : 'translate-y-full opacity-50 rounded-t-[100px]'"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-green-950/90 mix-blend-multiply"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 relative z-10 w-full" v-intersection-observer="onAreasVisible">
        <div class="text-center mb-16">
          <h2 
            class="text-4xl md:text-5xl font-bold text-white mb-4 opacity-0 translate-y-8 transition-all duration-700"
            :class="{ 'opacity-100 translate-y-0': areasVisible }"
          >
            ทำเลยอดนิยม
          </h2>
          <p 
            class="text-xl text-gray-400 opacity-0 translate-y-8 transition-all duration-700 delay-100"
            :class="{ 'opacity-100 translate-y-0': areasVisible }"
          >
            ค้นพบทรัพย์สินในทำเลศักยภาพทั่วประเทศ
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(area, index) in popularAreas" 
            :key="area.name"
            @click="searchByProvince(area.province)"
            class="group relative h-80 rounded-3xl overflow-hidden cursor-pointer opacity-0 translate-y-8 transition-all duration-700"
            :class="{ 'opacity-100 translate-y-0': areasVisible }"
            :style="{ transitionDelay: `${index * 150 + 200}ms` }"
          >
            <!-- Card Image -->
            <div 
              class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              :style="{ backgroundImage: `url('${area.image}')` }"
            ></div>
            
            <!-- Glassmorphism Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <!-- Content -->
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 class="text-2xl font-bold text-white mb-1">{{ area.name }}</h3>
                <p class="text-white/80 text-sm mb-2">{{ area.listings }} ประกาศ</p>
                <div class="flex items-center text-yellow-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>ดูทั้งหมด</span>
                  <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Categories Section with Micro-interactions -->
    <section class="py-20 bg-white relative overflow-hidden" ref="categoriesSection">
      <div class="max-w-7xl mx-auto px-4" v-intersection-observer="onCategoriesVisible">
        <h2 
          class="text-4xl font-bold text-center text-gray-900 mb-4 opacity-0 translate-y-8 transition-all duration-700"
          :class="{ 'opacity-100 translate-y-0': categoriesVisible }"
        >
          เลือกชมตามหมวดหมู่
        </h2>
        <p 
          class="text-center text-gray-500 mb-12 opacity-0 translate-y-8 transition-all duration-700 delay-100"
          :class="{ 'opacity-100 translate-y-0': categoriesVisible }"
        >
          ค้นหาอสังหาริมทรัพย์ที่คุณต้องการได้ง่ายๆ
        </p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="(cat, index) in categories" 
            :key="cat.value"
            @click="searchByCategory(cat.value)"
            class="relative bg-white rounded-3xl p-8 text-center cursor-pointer transition-all duration-500 hover:shadow-2xl border-2 border-gray-100 hover:border-green-400 group opacity-0 translate-y-8 overflow-hidden"
            :class="{ 'opacity-100 translate-y-0': categoriesVisible }"
            :style="{ transitionDelay: `${index * 100 + 200}ms` }"
          >
            <!-- Hover Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-600/0 group-hover:from-green-400/10 group-hover:to-green-600/20 transition-all duration-500"></div>
            
            <div class="relative z-10">
              <div class="text-6xl mb-4 transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300">{{ cat.icon }}</div>
              <h3 class="font-bold text-xl text-gray-800 group-hover:text-green-600 transition-colors mb-2">{{ cat.label }}</h3>
              <p class="text-gray-400 text-sm">{{ getCategoryCount(cat.value) }} รายการ</p>
              
              <!-- Arrow indicator -->
              <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fas fa-arrow-right text-green-500 animate-bounce-x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

 



   

    <!-- CTA Section -->
    <section class="py-24 bg-gray-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-green-600/20 to-yellow-500/20"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div class="max-w-4xl mx-auto text-center px-4 relative z-10">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">รู้ก่อนใคร !</h2>
        <p class="text-xl text-gray-300 mb-10">ลงทะเบียนรับข่าวประกาศใหม่ทันที</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <input 
            v-model="email" 
            type="email"
            placeholder="อีเมลของคุณ" 
            class="px-6 py-4 rounded-xl text-gray-900 w-full sm:w-80 bg-white focus:ring-2 focus:ring-yellow-400 transition-all hover:shadow-lg"
          />
          <button class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 hover:shadow-xl">
            สมัครรับข่าวสาร
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { getProvinces } from '~/utils/thailandAddresses';

const router = useRouter();
const listings = ref([]);
const ads = ref({
  banner_top: null,
  bento_1: null,
  bento_2: null,
  bento_3: null,
  bento_4: null
});
const loading = ref(true);
const email = ref('');
const isSearching = ref(false);
const mounted = ref(false);
const favorites = ref([]);
const parallaxOffset = ref(0);

// Section refs
const categoriesSection = ref(null);
const howItWorksSection = ref(null);

// Intersection observer states - start as false to allow animation on scroll
const howItWorksVisible = ref(false);
const step1Visible = ref(false);
const step2Visible = ref(false);
const step3Visible = ref(false);
const categoriesVisible = ref(false);
const areasVisible = ref(false);
const listingsVisible = ref(false);
const testimonialsVisible = ref(false);
const featuresVisible = ref(false);
const adsVisible = ref(false); // Added adsVisible state

const searchProvince = ref('');
const searchType = ref('');
const searchPrice = ref('');

const provinces = getProvinces();

const propertyTypes = [
  { label: 'คอนโด', value: 'Condo' },
  { label: 'บ้านเดี่ยว', value: 'House' },
  { label: 'ที่ดิน', value: 'Land' },
  { label: 'อาคารพาณิชย์', value: 'Commercial' }
];

const priceOptions = [
  { label: 'ต่ำกว่า 1 ล้าน', value: 'under_1m' },
  { label: '1-3 ล้าน', value: '1m_3m' },
  { label: '3-5 ล้าน', value: '3m_5m' },
  { label: '5-10 ล้าน', value: '5m_10m' },
  { label: 'มากกว่า 10 ล้าน', value: 'above_10m' }
];

const categories = [
  { label: 'คอนโด', value: 'Condo', icon: '🏢' },
  { label: 'บ้านเดี่ยว', value: 'House', icon: '🏠' },
  { label: 'ที่ดิน', value: 'Land', icon: '🏞️' },
  { label: 'อาคารพาณิชย์', value: 'Commercial', icon: '🏬' }
];

const popularAreas = [
  { name: 'กรุงเทพมหานคร', province: 'กรุงเทพมหานคร', image: '/images/area_bangkok_1767161100914.png', listings: 8 },
  { name: 'ภูเก็ต', province: 'ภูเก็ต', image: '/images/area_phuket_1767161131329.png', listings: 3 },
  { name: 'เชียงใหม่', province: 'เชียงใหม่', image: '/images/area_chiangmai_1767161150909.png', listings: 2 },
  { name: 'พัทยา', province: 'ชลบุรี', image: '/images/area_pattaya_1767161168616.png', listings: 4 }
];

const testimonials = [
  { 
    name: 'คุณสมชาย ใจดี', 
    role: 'นักธุรกิจ', 
    text: 'พบบ้านในฝันได้ภายใน 2 สัปดาห์ ขอบคุณทีมงานที่ช่วยเหลือตลอดการซื้อขาย ประทับใจมากครับ!',
    image: '/images/testimonial_person_1_1767161052336.png'
  },
  { 
    name: 'คุณสุดา ประเสริฐ', 
    role: 'ผู้จัดการ', 
    text: 'ระบบใช้งานง่าย ค้นหาสะดวก ได้คอนโดในทำเลที่ต้องการ ราคาดีกว่าที่คิดเยอะเลยค่ะ',
    image: '/images/testimonial_person_2_1767161069644.png'
  },
  { 
    name: 'ครอบครัววงศ์สกุล', 
    role: 'ผู้ซื้อบ้าน', 
    text: 'หาบ้านให้ครอบครัวได้ตรงใจ ลูกๆ ชอบมาก พี่บริการดีมาก แนะนำเลยครับ',
    image: '/images/testimonial_person_3_1767161086628.png'
  }
];

const features = [
  { icon: 'fas fa-shield-alt', title: 'ปลอดภัย 100%', description: 'ทุกประกาศผ่านการตรวจสอบคุณภาพ มั่นใจได้ทุกรายการ' },
  { icon: 'fas fa-headset', title: 'บริการ 24/7', description: 'ทีมงานพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง ทุกวัน' },
  { icon: 'fas fa-tags', title: 'ราคาดีที่สุด', description: 'คัดสรรทรัพย์สินราคาคุ้มค่า ตรงใจผู้ซื้อ' }
];

const getCategoryCount = (type) => {
  return listings.value.filter(l => l.type === type).length;
};

const getListingImage = (listing) => {
  if (listing.images && listing.images.length > 0) {
    return `http://localhost:5000/uploads/${listing.images[0]}`;
  }
  return 'https://placehold.co/600x400/166534/ffffff?text=Property';
};

const fetchFavorites = async () => {
  const authStore = useAuthStore();
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
  const authStore = useAuthStore();
  if (!authStore.user) {
    router.push('/login');
    return;
  }
  
  try {
    const response = await axios.post('http://localhost:5000/api/favorites/toggle', 
      { listingId: id },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    );
    
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

const scrollToCategories = () => {
  categoriesSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const handleSearch = () => {
  isSearching.value = true;
  const query = {};
  if (searchProvince.value) query.province = searchProvince.value;
  if (searchType.value) query.type = searchType.value;
  if (searchPrice.value) query.priceRange = searchPrice.value;
  
  setTimeout(() => {
    router.push({ path: '/listings', query });
  }, 800);
};

const searchByCategory = (value) => {
  isSearching.value = true;
  setTimeout(() => {
    router.push({ path: '/listings', query: { type: value } });
  }, 800);
};

const searchByProvince = (province) => {
  isSearching.value = true;
  setTimeout(() => {
    router.push({ path: '/listings', query: { province } });
  }, 800);
};

// Intersection observer callbacks
const onHowItWorksVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) howItWorksVisible.value = true;
};

const onStep1Visible = ([{ isIntersecting }]) => {
  if (isIntersecting) step1Visible.value = true;
};

const onStep2Visible = ([{ isIntersecting }]) => {
  if (isIntersecting) step2Visible.value = true;
};

const onStep3Visible = ([{ isIntersecting }]) => {
  if (isIntersecting) step3Visible.value = true;
};

const onCategoriesVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) categoriesVisible.value = true;
};

const onAreasVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) areasVisible.value = true;
};

const onListingsVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) listingsVisible.value = true;
};

const onTestimonialsVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) testimonialsVisible.value = true;
};

const onFeaturesVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) featuresVisible.value = true;
};

// Added onAdsVisible callback
const onAdsVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) adsVisible.value = true;
};

// Parallax scroll handler
const handleScroll = () => {
  parallaxOffset.value = window.scrollY;
};

// Custom directive for intersection observer
const vIntersectionObserver = {
  mounted(el, binding) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(binding.value, { threshold: 0.1 });
      observer.observe(el);
      el._observer = observer;
    }
  },
  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect();
    }
  }
};

onMounted(async () => {
  // Add scroll listener for parallax - client side only
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
  }

  try {
    await fetchFavorites();
    
    // Fetch listings
    try {
      const listingsRes = await axios.get('http://localhost:5000/api/listings');
      listings.value = listingsRes.data;
    } catch (e) {
      console.error('Error fetching listings:', e);
    }
    
    // Fetch ads
    try {
      const adsRes = await axios.get('http://localhost:5000/api/ads/active');
      const adList = adsRes.data;
      ads.value = {
        banner_top: adList.find(a => a.position === 'banner-top'),
        bento_1: adList.find(a => a.position === 'bento-1'),
        bento_2: adList.find(a => a.position === 'bento-2'),
        bento_3: adList.find(a => a.position === 'bento-3'),
        bento_4: adList.find(a => a.position === 'bento-4')
      };
    } catch (e) {
      console.error('Error fetching ads:', e);
    }
  } catch (error) {
    console.error('Error fetching listings:', error);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hero Animations */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce-x {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

.animate-slide-up { animation: slide-up 1s ease-out forwards; }
.animate-slide-up-delay-1 { animation: slide-up 1s ease-out 0.3s forwards; }
.animate-slide-up-delay-2 { animation: slide-up 1s ease-out 0.6s forwards; }
.animate-fade-in-delay { animation: fade-in 1s ease-out 1s forwards; }
.animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
.animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
.animate-bounce-x { animation: bounce-x 1s ease-in-out infinite; }

/* Hero Section - Background set in CSS for SSR compatibility */
.hero-bg {
  background-image: url('/images/hero-banner.png');
  background-color: #166534; /* Fallback green color */
}

/* CSS-only animations that work on page load without JS */
@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-on-load {
  animation: fade-slide-up 0.8s ease-out forwards;
}

.animate-on-load.delay-1 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-on-load.delay-2 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animate-on-load.delay-3 {
  animation-delay: 0.6s;
  opacity: 0;
}

/* Floating animations */
@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
}

@keyframes float-medium {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(-3deg); }
}

@keyframes float-fast {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
.animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
.animate-float-fast { animation: float-fast 4s ease-in-out infinite; }

/* Parallax background */
.bg-fixed {
  background-attachment: fixed;
}

@media (max-width: 768px) {
  .bg-fixed {
    background-attachment: scroll;
  }
}
</style>
