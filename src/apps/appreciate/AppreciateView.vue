<script setup lang="ts">
import { watch } from 'vue';

import constants from './constants/constants';
import useAppreciateCoreStore from './stores/core';
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from '@/apps/shared/components/FooterBar.vue';
import InstrumentsPanel from './components/InstrumentsPanel.vue';
import InstrumentForm from './components/forms/InstrumentForm.vue';
import OptionsForm from './components/forms/OptionsForm.vue';

const state = useAppreciateCoreStore();

watch(() => state.instrumentFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.INSTRUMENT_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.INSTRUMENT_FORM_ID).close();
  }
});

watch(() => state.optionsFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.OPTIONS_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.OPTIONS_FORM_ID).close();
  }
});
</script>

<template>
  <div
    :class="['h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar />
    <InstrumentForm />
    <OptionsForm />
    <div :class="['flex-1', 'flex', 'bg-base-100', 'overflow-hidden', 'w-screen']">
      <InstrumentsPanel />
    </div>
    <FooterBar />
  </div>
</template>
