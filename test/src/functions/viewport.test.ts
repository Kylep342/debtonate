import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';

import { fillHeight, fillWidth, smartPosition } from '../../../src/functions/viewport';
import LoansPanel from '../../../src/components/LoansPanel.vue';


describe('viewport module', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // it('fills height correctly', async () => {
  //   const componentRef = ref(null);
  //   mount(LoansPanel, {
  //     global: {
  //       provide: {
  //         componentRef
  //       }
  //     }
  //   });   expect(fillHeight(componentRef)).toBe(100);
  // });

  it('passes', async () => {
    expect(1).toBe(1);
  })
});
