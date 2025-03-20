<script setup lang="ts">
import InstrumentCard from '@/apps/appreciate/components/InstrumentCard.vue';
import constants from '@/apps/appreciate/constants/constants';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import { useResize } from '@/apps/shared/composables/useResize';
import sharedConstants from '@/apps/shared/constants/constants';
import { Button } from '@/apps/shared/types/app';

const state = useAppreciateCoreStore();

const { scrollContainer } = useResize('resizeInstrumentsPanel');

const buttons: Array<Button> = [
  {
    text: sharedConstants.BTN_CREATE,
    onClick: state.openInstrumentForm,
    classes: ['btn-success', 'text-center'],
  },
];
</script>

<template>
  <base-card :id="'instrumentManagementPanel'" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel :buttons="buttons" :title="constants.INSTRUMENTS" :class="['sticky', 'fixed', 'border-b-2']" />
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
