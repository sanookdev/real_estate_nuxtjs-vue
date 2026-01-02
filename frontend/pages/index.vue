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
          <span class="block text-white">ที่ดิน และอสังหาริมทรัพย์</span>
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mt-2">
            ทะเลทอง ราคาสวย ไปกันต่อ
          </span>
        </h1>
        
        <p class="text-xl md:text-2xl font-light mb-10 text-green-100 max-w-2xl mx-auto animate-on-load delay-1">
          อสังหาริมทรัพย์คุณภาพ คอนโด บ้าน ที่ดิน ในทำเลทอง
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

    <!-- 🔥 HOT SALE Section -->
    <section 
      v-if="pinnedListings.length > 0" 
      class="py-32 relative overflow-hidden"
      v-intersection-observer="onHotSaleVisible"
    >
      <!-- Stronger Soft Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100"></div>
      
        <!-- Restored Fire Particles (Subtle) -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute bottom-0 left-1/4 w-4 h-4 bg-orange-300 rounded-full animate-fire-particle opacity-40"></div>
        <div class="absolute bottom-0 left-1/3 w-3 h-3 bg-red-300 rounded-full animate-fire-particle-2 opacity-30"></div>
        <div class="absolute bottom-0 left-1/2 w-5 h-5 bg-amber-300 rounded-full animate-fire-particle-3 opacity-40"></div>
        <div class="absolute bottom-0 left-2/3 w-4 h-4 bg-orange-200 rounded-full animate-fire-particle opacity-50"></div>
        <div class="absolute bottom-0 right-1/4 w-3 h-3 bg-red-200 rounded-full animate-fire-particle-2 opacity-30"></div>
        
        <!-- Large ambient glows -->
        <div class="absolute top-1/3 left-10 w-96 h-96 bg-orange-300/10 rounded-full blur-[100px] animate-pulse"></div>
        <div class="absolute top-1/4 right-20 w-[500px] h-[500px] bg-amber-300/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-16 md:mb-24">
          <div 
            class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-50 backdrop-blur-md border border-orange-200/50 px-6 py-2.5 rounded-full mb-8 opacity-0 translate-y-8 transition-all duration-1000 shadow-sm"
            :class="{ 'opacity-100 translate-y-0': hotSaleVisible }"
          >
            <span class="text-xl animate-pulse">🔥</span>
            <span class="font-bold tracking-widest uppercase text-xs text-orange-800">Hot Deals</span>
          </div>
          
          <h2 
            class="text-5xl md:text-6xl font-bold mb-6 opacity-0 translate-y-8 transition-all duration-1000 delay-100 text-gray-900 tracking-tight"
            :class="{ 'opacity-100 translate-y-0': hotSaleVisible }"
          >
            ประกาศ<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">ยอดนิยม</span>
          </h2>
          <p 
            class="text-gray-600 text-xl max-w-2xl mx-auto opacity-0 translate-y-8 transition-all duration-1000 delay-200 leading-relaxed font-light"
            :class="{ 'opacity-100 translate-y-0': hotSaleVisible }"
          >
            ค้นพบทรัพย์สินคุณภาพเยี่ยมในราคาสุดพิเศษ ที่เราคัดสรรมาเพื่อคุณโดยเฉพาะ โอกาสดีๆ ที่ไม่ควรพลาด
          </p>
        </div>

        <!-- Hot Sale Cards Grid -->
        <div class="relative">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <NuxtLink 
              v-for="(listing, index) in paginatedHotSaleListings" 
              :key="listing.id" 
              :to="`/listings/${listing.id}`"
              class="group block bg-white rounded-3xl overflow-hidden shadow-lg 
              hover:shadow-xl transition-all duration-500 hover:-translate-y-2 
              opacity-0 translate-y-8 relative border border-gray-100"
              :class="{ 'opacity-100 translate-y-0': hotSaleVisible }"
            >
              <!-- Fire Badge -->
              <div class="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30 animate-pulse">
                <span class="text-sm">🔥</span>
                <span>HOT</span>
              </div>
              
              <!-- Hover Overlay with Soft Glow -->
              <div class="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-200/60 group-hover:shadow-[0_0_20px_rgba(251,146,60,0.3)] transition-all duration-500 z-10 pointer-events-none"></div>
              
              <div class="relative h-52 overflow-hidden">
                <img 
                  :src="getListingImage(listing)" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <p class="text-2xl font-bold text-white drop-shadow-lg">฿{{ Number(listing.price).toLocaleString() }}</p>
                </div>
              </div>
              
              <div class="p-5">
                <span class="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {{ listing.type }}
                </span>
                <h3 class="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-orange-600 transition-colors">
                  {{ listing.title }}
                </h3>
                <p class="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <i class="fas fa-map-marker-alt text-orange-500"></i>
                  {{ listing.province || listing.location }}
                </p>
                <p class="text-xs text-gray-400 flex items-center gap-1">
                  <i class="fas fa-calendar-alt"></i>
                  {{ formatDate(listing.created_at) }}
                </p>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination Controls for Hot Sale -->
          <div v-if="totalHotSalePages > 1" class="flex justify-center items-center gap-4 mt-8 opacity-0 translate-y-4 transition-all duration-700 delay-300" :class="{ 'opacity-100 translate-y-0': hotSaleVisible }">
            <button 
              @click="prevHotSalePage" 
              :disabled="hotSalePage === 1"
              class="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="flex gap-2">
              <span 
                v-for="p in totalHotSalePages" 
                :key="p" 
                class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                :class="p === hotSalePage ? 'bg-orange-500 scale-125' : 'bg-gray-300'"
              ></span>
            </div>
            <button 
              @click="nextHotSalePage" 
              :disabled="hotSalePage === totalHotSalePages"
              class="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

     <!-- Featured Properties -->
    <section class="py-32 bg-gray-50 relative overflow-hidden">
       <!-- Subtle Pattern -->
      <div class="absolute inset-0 opacity-[0.4]" style="background-image: radial-gradient(#e5e7eb 1px, transparent 1px); background-size: 32px 32px;"></div>
      
      <div class="max-w-7xl mx-auto px-4 relative z-10" v-intersection-observer="onListingsVisible">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div class="max-w-2xl">
            <span 
              class="inline-block text-green-600 font-bold tracking-widest uppercase text-sm mb-4 opacity-0 translate-y-4 transition-all duration-700"
              :class="{ 'opacity-100 translate-y-0': listingsVisible }"
            >
              Selected For You
            </span>
            <h2 
              class="text-4xl md:text-5xl font-bold text-gray-900 opacity-0 translate-y-8 transition-all duration-1000 delay-100 leading-tight"
              :class="{ 'opacity-100 translate-y-0': listingsVisible }"
            >
              ทรัพย์สินแนะนำ
            </h2>
            <p 
              class="text-gray-500 text-lg mt-4 opacity-0 translate-y-8 transition-all duration-1000 delay-200 font-light"
              :class="{ 'opacity-100 translate-y-0': listingsVisible }"
            >
              คัดสรรอสังหาริมทรัพย์คุณภาพ เพื่อการอยู่อาศัยและการลงทุนที่คุ้มค่า
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
            class="group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl 
            transition-all duration-500 hover:-translate-y-2 opacity-0 translate-y-2"
            :class="{ 'opacity-100 translate-y-0': listingsVisible }"
           
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
              <p class="text-sm text-gray-500 flex items-center gap-1 mb-2">
                <i class="fas fa-map-marker-alt text-green-600"></i>
                {{ listing.province || listing.location }}
              </p>
              <p class="text-xs text-gray-400 flex items-center gap-1">
                <i class="fas fa-calendar-alt"></i>
                {{ formatDate(listing.created_at) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!-- 🎨 Premium Ads Gallery Section -->
    <section 
      v-if="ads.banner_top || ads.bento_1 || ads.bento_2" 
      class="relative py-32 overflow-hidden"
      ref="adSectionRef"
      v-intersection-observer="onAdsVisible"
    >
      <!-- Sophisticated Background -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900"></div>
        <!-- Animated Orbs -->
        <div class="absolute top-20 left-20 w-[500px] h-[500px] bg-gradient-to-r from-amber-500/20 to-orange-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/15 to-teal-500/10 rounded-full blur-[80px] animate-pulse" style="animation-delay: 2s;"></div>
        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center mb-14">
          <div 
            class="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20 px-5 py-2.5 rounded-full mb-5 opacity-0 -translate-y-4 transition-all duration-700"
            :class="{ 'opacity-100 translate-y-0': adsVisible }"
          >
            <div class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
            <span class="text-amber-200/90 text-xs font-semibold tracking-[0.2em] uppercase">Featured Partners</span>
            <div class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
          <h2 
            class="text-4xl md:text-5xl font-bold mb-4 opacity-0 -translate-y-4 transition-all duration-700 delay-100"
            :class="{ 'opacity-100 translate-y-0': adsVisible }"
          >
            <span class="text-white">โฆษณา</span><span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400">พิเศษ</span>
          </h2>
          <p 
            class="text-slate-400 text-base max-w-xl mx-auto opacity-0 -translate-y-4 transition-all duration-700 delay-200"
            :class="{ 'opacity-100 translate-y-0': adsVisible }"
          >
            โปรโมชั่นและข้อเสนอสุดพิเศษจากพันธมิตรที่ได้รับการคัดสรร
          </p>
        </div>

        <!-- Premium Masonry Bento Grid -->
        <div 
          class="grid grid-cols-4 md:grid-cols-12 auto-rows-[140px] gap-4 opacity-0 translate-y-8 transition-all duration-1000 delay-300"
          :class="{ 'opacity-100 translate-y-0': adsVisible }"
        >
          <!-- Banner Top - Full Width -->
          <a 
            v-if="ads.banner_top"
            :href="ads.banner_top.link" 
            target="_blank" 
            class="col-span-4 md:col-span-12 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img 
              :src="`${apiUrl}/uploads/${ads.banner_top.image}`" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/60"></div>
            <!-- Content -->
            <div class="absolute inset-0 flex items-end p-6 md:p-8">
              <div class="flex items-center gap-4">
                <span class="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/30">
                  Featured
                </span>
                <span class="text-white/70 text-sm hidden md:inline">คลิกเพื่อดูรายละเอียด</span>
              </div>
            </div>
            <!-- Hover Glow -->
            <div class="absolute inset-0 border-2 border-amber-400/0 rounded-2xl transition-all duration-500 group-hover:border-amber-400/50 group-hover:shadow-[0_0_40px_rgba(251,191,36,0.15)]"></div>
          </a>

          <!-- Bento 1 - Large Left -->
          <a 
            v-if="ads.bento_1"
            :href="ads.bento_1.link" 
            target="_blank" 
            class="col-span-4 md:col-span-7 row-span-3 relative rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img 
              :src="`${apiUrl}/uploads/${ads.bento_1.image}`" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <!-- Glass Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <!-- Decorative Corner -->
            <div class="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-xl"></div>
            <!-- Content -->
            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span class="inline-block px-3 py-1 mb-3 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30">
                Premium Partner
              </span>
              <h3 class="text-white text-xl md:text-2xl font-bold mb-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                โปรโมชั่นพิเศษสำหรับคุณ
              </h3>
              <p class="text-white/60 text-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                คลิกเพื่อดูรายละเอียด →
              </p>
            </div>
            <!-- Hover Border -->
            <div class="absolute inset-0 border-2 border-emerald-400/0 rounded-2xl transition-all duration-500 group-hover:border-emerald-400/40"></div>
          </a>

          <!-- Bento 2 - Top Right -->
          <a 
            v-if="ads.bento_2"
            :href="ads.bento_2.link" 
            target="_blank" 
            class="col-span-2 md:col-span-5 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img 
              :src="`${apiUrl}/uploads/${ads.bento_2.image}`" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <div class="flex items-center gap-2 text-white text-sm font-medium">
                <span class="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400"></span>
                <span>ข้อเสนอพิเศษ</span>
              </div>
            </div>
            <div class="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-cyan-400/40 transition-colors duration-500"></div>
          </a>

          <!-- Bento 3 - Middle Right -->
          <a 
            v-if="ads.bento_3"
            :href="ads.bento_3.link" 
            target="_blank" 
            class="col-span-2 md:col-span-2 row-span-1 relative rounded-xl overflow-hidden group cursor-pointer"
          >
            <img 
              :src="`${apiUrl}/uploads/${ads.bento_3.image}`" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
            <div class="absolute inset-0 border border-white/10 rounded-xl group-hover:border-rose-400/40 transition-colors duration-500"></div>
          </a>

          <!-- Bento 4 - Bottom Right -->
          <a 
            v-if="ads.bento_4"
            :href="ads.bento_4.link" 
            target="_blank" 
            class="col-span-2 md:col-span-3 row-span-1 relative rounded-xl overflow-hidden group cursor-pointer"
          >
            <img 
              :src="`${apiUrl}/uploads/${ads.bento_4.image}`" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
            <div class="absolute inset-0 border border-white/10 rounded-xl group-hover:border-violet-400/40 transition-colors duration-500"></div>
          </a>
        </div>

        <!-- CTA Below Grid -->
        <div 
          class="text-center mt-10 opacity-0 translate-y-4 transition-all duration-700 delay-700"
          :class="{ 'opacity-100 translate-y-0': adsVisible }"
        >
          <p class="text-slate-500 text-sm">
            ต้องการลงโฆษณากับเรา? 
            <NuxtLink to="/contacts" class="text-amber-400 hover:text-amber-300 font-medium transition-colors">ติดต่อเรา</NuxtLink>
          </p>
        </div>
      </div>

      <!-- Bottom Transition -->
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      <div class="absolute -bottom-px left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 80L48 72C96 64 192 48 288 42.7C384 37 480 43 576 48C672 53 768 59 864 58.7C960 59 1056 53 1152 50.7C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>
   
   <!-- Parallax Area Gallery -->
    <section class="min-h-screen relative overflow-hidden flex items-center justify-center py-32">
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
    <section class="py-32 bg-white relative overflow-hidden" ref="categoriesSection">
      <!-- Decorative Blobs -->
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gray-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 relative z-10" v-intersection-observer="onCategoriesVisible">
        <div class="text-center mb-16 md:mb-24">
           <span 
              class="inline-block text-green-600 font-bold tracking-widest uppercase text-sm mb-4 opacity-0 translate-y-4 transition-all duration-700"
              :class="{ 'opacity-100 translate-y-0': categoriesVisible }"
            >
              Categories
            </span>
            <h2 
              class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 opacity-0 translate-y-8 transition-all duration-1000 delay-100"
              :class="{ 'opacity-100 translate-y-0': categoriesVisible }"
            >
              เลือกชมตามหมวดหมู่
            </h2>
            <p 
              class="text-gray-500 text-xl max-w-2xl mx-auto opacity-0 translate-y-8 transition-all duration-1000 delay-200 font-light"
              :class="{ 'opacity-100 translate-y-0': categoriesVisible }"
            >
              ค้นหาอสังหาริมทรัพย์ที่คุณต้องการได้ง่ายๆ แบ่งตามประเภทการใช้งาน
            </p>
        </div>
        
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
    <!-- CTA Section (Premium Dark) -->
    <section class="py-32 relative overflow-hidden bg-slate-900">
      <!-- Sophisticated Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-black"></div>
      
      <!-- Subtle Ambient Light -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div class="max-w-4xl mx-auto text-center px-4 relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm mb-8">
          <span class="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span class="text-slate-300 text-xs font-medium tracking-widest uppercase">Newsletter</span>
        </div>

        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          ไม่พลาดทุกโอกาส<span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">การลงทุน</span>
        </h2>
        
        <p class="text-lg text-slate-400 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
          รับทราบประกาศใหม่ อสังหาริมทรัพย์ระดับพรีเมียมก่อนใคร ส่งตรงถึงอีเมลล์ของคุณทันที !
        </p>
        
        <div class="relative max-w-lg mx-auto">
          <!-- Glass Input Container -->
          <div class="p-1.5 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-xl flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-500/50">
            <input 
              v-model="email" 
              type="email"
              placeholder="กรอกอีเมลของคุณ" 
              class="flex-1 px-6 py-3 rounded-full bg-transparent text-white placeholder-slate-500 border-none outline-none focus:ring-0 w-full"
            />
            <button class="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 whitespace-nowrap">
              สมัครรับข่าวสาร
            </button>
          </div>
          <p class="text-slate-600 text-xs mt-6">
            *เราเคารพความเป็นส่วนตัวของคุณ ข้อมูลจะไม่ถูกเปิดเผย
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { getProvinces } from '~/utils/thailandAddresses';

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;


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
const adSectionRef = ref(null);
const adParallax = ref(0);

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
const adsVisible = ref(false);
const hotSaleVisible = ref(false); // Hot Sale section
const pinnedListings = ref([]); // Pinned listings for Hot Sale
const hotSalePage = ref(1);
const hotSaleItemsPerPage = 4;

const paginatedHotSaleListings = computed(() => {
  const start = (hotSalePage.value - 1) * hotSaleItemsPerPage;
  const end = start + hotSaleItemsPerPage;
  return pinnedListings.value.slice(start, end);
});

const totalHotSalePages = computed(() => {
  return Math.ceil(pinnedListings.value.length / hotSaleItemsPerPage);
});

const nextHotSalePage = () => {
  if (hotSalePage.value < totalHotSalePages.value) hotSalePage.value++;
};

const prevHotSalePage = () => {
  if (hotSalePage.value > 1) hotSalePage.value--;
};

const searchProvince = ref('');
const searchType = ref('');
const searchPrice = ref('');

const provinces = ref([]);

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
    return `${apiUrl}/uploads/${listing.images[0]}`;
  }
  return 'https://placehold.co/600x400/166534/ffffff?text=Property';
};

const fetchFavorites = async () => {
  const authStore = useAuthStore();
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

const toggleFavorite = async (id) => {
  const authStore = useAuthStore();
  if (!authStore.user) {
    router.push('/login');
    return;
  }
  
  try {
    const response = await axios.post(`${apiUrl}/api/favorites/toggle`, 
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

// Hot Sale section visibility
const onHotSaleVisible = ([{ isIntersecting }]) => {
  if (isIntersecting) hotSaleVisible.value = true;
};

// Format date to Thai locale
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Parallax scroll handler
const handleScroll = () => {
  if (typeof window === 'undefined') return;
  
  parallaxOffset.value = window.scrollY;
  
  // Calculate parallax for ads section
  if (adSectionRef.value) {
    const rect = adSectionRef.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Only calculate when section is in view
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Calculate scroll progress through the section
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      adParallax.value = progress * 100; // 0-100 range for parallax offset
    }
  }
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

  // Load provinces (client-side only)
  provinces.value = await getProvinces();

  try {
    await fetchFavorites();
    
    // Fetch listings
    try {
      const listingsRes = await axios.get(`${apiUrl}/api/listings`);
      listings.value = listingsRes.data.listings || [];
    } catch (e) {
      console.error('Error fetching listings:', e);
    }
    
    // Fetch ads
    try {
      const adsRes = await axios.get(`${apiUrl}/api/ads/active`);
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

    // Fetch pinned listings for Hot Sale section
    try {
      const pinnedRes = await axios.get(`${apiUrl}/api/listings/pinned`);
      pinnedListings.value = pinnedRes.data;
    } catch (e) {
      console.error('Error fetching pinned listings:', e);
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

/* 🔥 Hot Sale Section Animations */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

@keyframes fire-particle {
  0% { 
    transform: translateY(0) scale(1); 
    opacity: 0.8; 
  }
  50% { 
    transform: translateY(-150px) scale(0.8) translateX(20px); 
    opacity: 0.4; 
  }
  100% { 
    transform: translateY(-300px) scale(0.3) translateX(-10px); 
    opacity: 0; 
  }
}

@keyframes fire-particle-2 {
  0% { 
    transform: translateY(0) scale(1); 
    opacity: 0.7; 
  }
  50% { 
    transform: translateY(-180px) scale(0.7) translateX(-30px); 
    opacity: 0.3; 
  }
  100% { 
    transform: translateY(-350px) scale(0.2) translateX(20px); 
    opacity: 0; 
  }
}

@keyframes fire-particle-3 {
  0% { 
    transform: translateY(0) scale(1); 
    opacity: 0.6; 
  }
  50% { 
    transform: translateY(-120px) scale(0.9) translateX(15px); 
    opacity: 0.5; 
  }
  100% { 
    transform: translateY(-250px) scale(0.4) translateX(-25px); 
    opacity: 0; 
  }
}

.animate-fire-particle {
  animation: fire-particle 3s ease-out infinite;
}

.animate-fire-particle-2 {
  animation: fire-particle-2 4s ease-out infinite;
  animation-delay: 0.5s;
}

.animate-fire-particle-3 {
  animation: fire-particle-3 3.5s ease-out infinite;
  animation-delay: 1s;
}
</style>

