<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Button } from '@/apps/shared/types/app';

defineProps({
  text: {
    type: String,
    required: true
  },
  buttons: {
    type: Array as () => Array<Button>,
    required: true
  },
  classes: {
    type: Array as () => Array<string>,
    required: true
  }
});

const isOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleItemClick = (button: Button) => {
  closeMenu();
  button.onClick();
};

const handleDocumentClick = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    ref="menuRef"
    :class="['dropdown', 'dropdown-bottom', 'dropdown-end', { 'dropdown-open': isOpen }]"
  >
    <base-button
      :class="classes"
      @click.stop="toggleMenu"
    >
      {{ text }}
    </base-button>
    <ul
      tabindex="0"
      :class="['dropdown-content', 'menu', 'bg-base-100', 'rounded-box', 'z-[50]', 'w-max', 'min-w-[120px]', 'p-2', 'shadow']"
    >
      <li
        v-for="button in buttons"
        :key="button.text"
        @click.prevent="handleItemClick(button)"
      >
        <a>{{ button.text }}</a>
      </li>
    </ul>
  </div>
</template>
