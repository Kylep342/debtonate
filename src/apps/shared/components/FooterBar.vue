<script setup lang="ts">
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
</script>

<template>
  <footer
    id="footer-bar"
    :class="['bg-secondary', 'sticky', 'bottom-0', 'z-30']"
  >
    <div :class="['flex', 'items-center', 'px-4', 'py-1', 'text-xs']">
      <div :class="['flex-1', 'text-left', 'flex', 'items-center', 'gap-2']">
        <a
          href="https://github.com/Kylep342/debtonate"
          target="_blank"
          class="hover:underline"
        >source</a>
        <span>|</span>
        <button
          type="button"
          class="hover:underline cursor-pointer bg-transparent border-none p-0 text-xs text-inherit"
          @click="globalOptions.openGlossary"
        >
          glossary
        </button>
      </div>
      <div :class="['flex-1', 'text-right']">
        <a
          href="https://forms.gle/5hdgxA4jKGQA5U8J9"
          target="_blank"
          class="hover:underline"
        >report a bug</a>
      </div>
    </div>
  </footer>
</template>
