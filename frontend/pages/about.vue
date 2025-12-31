<template>
  <div class="min-h-screen bg-gray-50 pt-24">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-green-800 to-green-900 py-16 text-center text-white">
      <h1 class="text-4xl font-bold mb-4">เกี่ยวกับเรา</h1>
      <p class="text-green-100 text-lg max-w-2xl mx-auto">
        AssetSale คือแพลตฟอร์มสื่อกลางซื้อขายอสังหาริมทรัพย์ที่ทันสมัยที่สุดในประเทศไทย
        มุ่งมั่นยกระดับประสบการณ์การซื้อขายบ้านให้ง่าย โปร่งใส และปลอดภัย
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-16">
      <!-- Vision & Mission -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <div class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">วิสัยทัศน์ของเรา</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">เชื่อมโยงผู้คนกับบ้านในฝัน</h2>
          <p class="text-gray-600 mb-6 leading-relaxed">
            เราเชื่อว่าการซื้อบ้านไม่ใช่แค่การทำธุรกรรม แต่คือการเริ่มต้นบทใหม่ของชีวิต เราจึงพัฒนาเทคโนโลยีที่ช่วยให้การค้นหาบ้านเป็นเรื่องง่าย รวดเร็ว และตรงใจที่สุด พร้อมระบบคัดกรองคุณภาพเพื่อให้คุณมั่นใจในทุกการตัดสินใจ
          </p>
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div class="text-3xl font-bold text-green-600 mb-1">10+</div>
              <div class="text-sm text-gray-500">ปีแห่งความเชี่ยวชาญ</div>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div class="text-3xl font-bold text-green-600 mb-1">5000+</div>
              <div class="text-sm text-gray-500">ปิดการขายสำเร็จ</div>
            </div>
          </div>
        </div>
        <div class="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Team Meeting" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <p class="text-white font-medium">ทีมงานมืออาชีพพร้อมดูแลคุณ</p>
          </div>
        </div>
      </div>

      <!-- Values -->
      <h2 class="text-3xl font-bold text-center text-gray-900 mb-10">สิ่งที่เราให้ความสำคัญ</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <UCard class="text-center h-full hover:-translate-y-1 transition-transform duration-300">
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <UIcon name="i-heroicons-shield-check" class="text-3xl" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">ความน่าเชื่อถือ</h3>
          <p class="text-gray-500 text-sm">ทรัพย์สินทุกรายการผ่านการตรวจสอบเอกสารสิทธิ์และความถูกต้องอย่างละเอียดก่อนลงประกาศ</p>
        </UCard>
        
        <UCard class="text-center h-full hover:-translate-y-1 transition-transform duration-300">
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
             <UIcon name="i-heroicons-sparkles" class="text-3xl" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">เทคโนโลยีทันสมัย</h3>
          <p class="text-gray-500 text-sm">ระบบค้นหาอัจฉริยะ การแสดงผลแบบ 3D และเครื่องมือเปรียบเทียบราคาที่แม่นยำที่สุด</p>
        </UCard>
        
        <UCard class="text-center h-full hover:-translate-y-1 transition-transform duration-300">
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
             <UIcon name="i-heroicons-heart" class="text-3xl" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">บริการด้วยใจ</h3>
          <p class="text-gray-500 text-sm">ทีมงาน Support พร้อมให้ความช่วยเหลือและคำแนะนำที่เป็นกลางตลอด 24 ชั่วโมง</p>
        </UCard>
      </div>

      <!-- CTA -->
      <div class="bg-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-green-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div class="relative z-10">
          <h2 class="text-3xl font-bold mb-4">พร้อมที่จะเป็นเจ้าของบ้านในฝัน?</h2>
          <p class="text-gray-400 mb-8 max-w-xl mx-auto">เริ่มต้นค้นหาทรัพย์สินที่ใช่สำหรับคุณ หรือลงประกาศขายกับเราได้ง่ายๆ วันนี้</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
             <UButton to="/listings" size="xl" color="green">ค้นหาบ้าน</UButton>
             <UButton to="/contacts" size="xl" color="white" variant="outline">ติดต่อเรา</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this static page
</script>
