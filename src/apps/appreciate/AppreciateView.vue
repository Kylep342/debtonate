<script setup lang="ts">
import { watch } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import HeaderBar from '@/apps/appreciate/components/HeaderBar.vue';
import FooterBar from '@/apps/shared/components/FooterBar.vue';
import InstrumentsPanel from './components/InstrumentsPanel.vue';
import InstrumentForm from './components/forms/InstrumentForm.vue';

const state = useAppreciateCoreStore();

watch(() => state.instrumentFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.INSTRUMENT_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.INSTRUMENT_FORM_ID).close();
  }
});
</script>

<template>
  <div
    :class="['h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar />
    <InstrumentForm />
    <div :class="['flex-1', 'flex', 'bg-base-100', 'overflow-hidden', 'w-screen']">
      <InstrumentsPanel />
    </div>
    <FooterBar />
  </div>
</template>
