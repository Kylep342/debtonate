<script setup lang="ts">
import HeaderBar from '@/apps/appreciate/components/HeaderBar.vue';
import FooterBar from '@/apps/shared/components/FooterBar.vue';

</script>

<template>
  <div
    :class="['h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar />
    <br>
    <br>
    <FooterBar />
  </div>
</template>
