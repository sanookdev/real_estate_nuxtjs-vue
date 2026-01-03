<template>
  <div class="image-captcha">
    <!-- Question -->
    <div class="mb-4 text-center">
      <p class="text-gray-700 font-medium mb-2">{{ question }}</p>
      <p class="text-sm text-gray-500">กรุณาเลือกภาพที่ตรงกับคำถาม</p>
    </div>

    <!-- Image Grid -->
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="(img, index) in shuffledImages"
        :key="index"
        type="button"
        @click="selectImage(index)"
        class="relative aspect-square rounded-lg overflow-hidden border-3 transition-all duration-200 focus:outline-none"
        :class="[
          selectedIndex === index 
            ? 'border-green-500 ring-2 ring-green-500/50 scale-105' 
            : 'border-gray-200 hover:border-gray-300 hover:scale-102'
        ]"
      >
        <div class="w-full h-full flex items-center justify-center text-5xl bg-gray-50">
          {{ img.emoji }}
        </div>
        
        <!-- Selected Check -->
        <div 
          v-if="selectedIndex === index"
          class="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <UIcon name="i-heroicons-check" class="text-white text-sm" />
        </div>
      </button>
    </div>

    <!-- Result Message -->
    <div v-if="showResult" class="mt-3 text-center">
      <p v-if="isCorrect" class="text-green-600 text-sm flex items-center justify-center gap-1">
        <UIcon name="i-heroicons-check-circle" />
        ยืนยันสำเร็จ!
      </p>
      <p v-else class="text-red-600 text-sm flex items-center justify-center gap-1">
        <UIcon name="i-heroicons-x-circle" />
        ไม่ถูกต้อง ลองใหม่อีกครั้ง
      </p>
    </div>

    <!-- Refresh Button -->
    <div class="mt-3 text-center">
      <button 
        type="button" 
        @click="regenerate"
        class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
      >
        <UIcon name="i-heroicons-arrow-path" class="text-sm" />
        เปลี่ยนคำถาม
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const emit = defineEmits(['verified', 'failed']);

// Image sets with categories
const imageCategories = [
  { 
    name: 'สัตว์', 
    question: 'เลือกภาพที่เป็นสัตว์',
    correct: [
      { emoji: '🐱', label: 'แมว' },
      { emoji: '🐶', label: 'หมา' },
      { emoji: '🐘', label: 'ช้าง' },
      { emoji: '🦁', label: 'สิงโต' },
      { emoji: '🐼', label: 'แพนด้า' },
      { emoji: '🐸', label: 'กบ' },
      { emoji: '🦋', label: 'ผีเสื้อ' },
      { emoji: '🐦', label: 'นก' },
    ],
    wrong: [
      { emoji: '🚗', label: 'รถ' },
      { emoji: '🏠', label: 'บ้าน' },
      { emoji: '🌳', label: 'ต้นไม้' },
      { emoji: '🍎', label: 'แอปเปิ้ล' },
      { emoji: '⚽', label: 'ลูกบอล' },
      { emoji: '📱', label: 'โทรศัพท์' },
      { emoji: '🎸', label: 'กีตาร์' },
      { emoji: '🎂', label: 'เค้ก' },
    ]
  },
  { 
    name: 'ผลไม้', 
    question: 'เลือกภาพที่เป็นผลไม้',
    correct: [
      { emoji: '🍎', label: 'แอปเปิ้ล' },
      { emoji: '🍊', label: 'ส้ม' },
      { emoji: '🍋', label: 'มะนาว' },
      { emoji: '🍇', label: 'องุ่น' },
      { emoji: '🍓', label: 'สตรอเบอรี่' },
      { emoji: '🍉', label: 'แตงโม' },
      { emoji: '🥭', label: 'มะม่วง' },
      { emoji: '🍑', label: 'พีช' },
    ],
    wrong: [
      { emoji: '🥕', label: 'แครอท' },
      { emoji: '🥦', label: 'บล็อคโคลี่' },
      { emoji: '🌽', label: 'ข้าวโพด' },
      { emoji: '🐱', label: 'แมว' },
      { emoji: '🚗', label: 'รถ' },
      { emoji: '🏠', label: 'บ้าน' },
      { emoji: '📱', label: 'โทรศัพท์' },
      { emoji: '⚽', label: 'ลูกบอล' },
    ]
  },
  { 
    name: 'ยานพาหนะ', 
    question: 'เลือกภาพที่เป็นยานพาหนะ',
    correct: [
      { emoji: '🚗', label: 'รถ' },
      { emoji: '🚌', label: 'รถบัส' },
      { emoji: '🏍️', label: 'มอเตอร์ไซค์' },
      { emoji: '✈️', label: 'เครื่องบิน' },
      { emoji: '🚢', label: 'เรือ' },
      { emoji: '🚂', label: 'รถไฟ' },
      { emoji: '🚁', label: 'เฮลิคอปเตอร์' },
      { emoji: '🛵', label: 'สกู๊ตเตอร์' },
    ],
    wrong: [
      { emoji: '🐱', label: 'แมว' },
      { emoji: '🍎', label: 'แอปเปิ้ล' },
      { emoji: '🏠', label: 'บ้าน' },
      { emoji: '🌳', label: 'ต้นไม้' },
      { emoji: '📱', label: 'โทรศัพท์' },
      { emoji: '🎸', label: 'กีตาร์' },
      { emoji: '⚽', label: 'ลูกบอล' },
      { emoji: '🎂', label: 'เค้ก' },
    ]
  },
  { 
    name: 'อาหาร', 
    question: 'เลือกภาพที่เป็นอาหาร',
    correct: [
      { emoji: '🍕', label: 'พิซซ่า' },
      { emoji: '🍔', label: 'แฮมเบอร์เกอร์' },
      { emoji: '🍜', label: 'ก๋วยเตี๋ยว' },
      { emoji: '🍣', label: 'ซูชิ' },
      { emoji: '🍝', label: 'พาสต้า' },
      { emoji: '🌮', label: 'ทาโก้' },
      { emoji: '🍲', label: 'หม้อไฟ' },
      { emoji: '🥗', label: 'สลัด' },
    ],
    wrong: [
      { emoji: '🐱', label: 'แมว' },
      { emoji: '🚗', label: 'รถ' },
      { emoji: '🏠', label: 'บ้าน' },
      { emoji: '📱', label: 'โทรศัพท์' },
      { emoji: '⚽', label: 'ลูกบอล' },
      { emoji: '🎸', label: 'กีตาร์' },
      { emoji: '🌳', label: 'ต้นไม้' },
      { emoji: '💎', label: 'เพชร' },
    ]
  }
];

const currentCategory = ref(null);
const shuffledImages = ref([]);
const correctIndex = ref(-1);
const selectedIndex = ref(-1);
const showResult = ref(false);
const isCorrect = ref(false);

const question = computed(() => {
  return currentCategory.value?.question || 'กำลังโหลด...';
});

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const generateCaptcha = () => {
  // Reset state
  selectedIndex.value = -1;
  showResult.value = false;
  isCorrect.value = false;
  
  // Pick random category
  currentCategory.value = imageCategories[Math.floor(Math.random() * imageCategories.length)];
  
  // Pick 1 correct and 8 wrong images
  const correctImg = currentCategory.value.correct[Math.floor(Math.random() * currentCategory.value.correct.length)];
  const wrongImgs = shuffle(currentCategory.value.wrong).slice(0, 8);
  
  // Combine and shuffle, remembering correct position
  const allImages = shuffle([correctImg, ...wrongImgs]).slice(0, 9);
  correctIndex.value = allImages.findIndex(img => 
    currentCategory.value.correct.some(c => c.emoji === img.emoji)
  );
  
  shuffledImages.value = allImages;
};

const selectImage = (index) => {
  selectedIndex.value = index;
  showResult.value = true;
  
  // Check if correct
  const selectedEmoji = shuffledImages.value[index].emoji;
  isCorrect.value = currentCategory.value.correct.some(c => c.emoji === selectedEmoji);
  
  if (isCorrect.value) {
    emit('verified', true);
  } else {
    emit('failed');
    // Auto regenerate after wrong answer
    setTimeout(() => {
      generateCaptcha();
    }, 1500);
  }
};

const regenerate = () => {
  emit('verified', false);
  generateCaptcha();
};

onMounted(() => {
  generateCaptcha();
});

// Expose regenerate for parent component
defineExpose({ regenerate, isVerified: isCorrect });
</script>

<style scoped>
.border-3 {
  border-width: 3px;
}
.scale-102 {
  transform: scale(1.02);
}
</style>
