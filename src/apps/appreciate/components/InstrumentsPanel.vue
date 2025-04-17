<script setup lang="ts">
import { Button } from '@/apps/shared/types/app';
import { useResize } from '@/apps/shared/composables/useResize';
import constants from '@/apps/appreciate/constants/constants';
import InstrumentCard from '@/apps/appreciate/components/InstrumentCard.vue';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';

const state = useAppreciateCoreStore();

const { scrollContainer } = useResize('resizeInstrumentsPanel');

const buttons: Array<Button> = [
  {
    text: constants.BTN_CREATE,
    onClick: state.openInstrumentForm,
    classes: ['btn-success', 'text-center'],
  },
];
</script>

<template>
  <base-card :id="'instrumentManagementPanel'" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel :buttons="buttons" :title="constants.INSTRUMENTS" :class="['border-b-2']" />
    </template>
    <template #cardBody>
      <div ref="scrollContainer" :class="[
        'border-r-2',
        'overflow-y-auto',
        'flex',
        'flex-col',
        'min-h-0'
      ]">
        <ul>
          <li v-for="(instrument) in state.instrumentsWithTotals" :key="instrument.id">
            <InstrumentCard :instrument="instrument" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
