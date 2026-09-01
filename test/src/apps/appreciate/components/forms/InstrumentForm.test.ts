import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import InstrumentForm from '@/apps/appreciate/components/forms/InstrumentForm.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import BaseEntityForm from '@/apps/shared/components/forms/BaseEntityForm.vue';

describe('InstrumentForm Component (Appreciate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders BaseEntityForm with instrument fields', () => {
    const store = useAppreciateCoreStore();
    (store as any).instrumentFormTitle = 'Create Instrument';
    (store as any).instrumentFormActive = true;
    (store as any).currentInstrumentId = null;

    const wrapper = mount(InstrumentForm, {
      global: {
        stubs: {
          BaseEntityForm: true
        }
      }
    });

    const form = wrapper.findComponent(BaseEntityForm);
    expect(form.exists()).toBe(true);
    expect(form.props('title')).toBe('Create Instrument');
  });

  it('submits instrument form with converted interest rate', async () => {
    const store = useAppreciateCoreStore();
    (store as any).instrumentFormTitle = 'Create Instrument';
    (store as any).instrumentFormActive = true;
    (store as any).currentInstrumentId = null;

    const wrapper = mount(InstrumentForm, {
      global: {
        components: {
          BaseEntityForm
        }
      }
    });

    const baseForm = wrapper.findComponent(BaseEntityForm);
    baseForm.props('onSubmit')({
      currentBalance: 5000,
      interestRate: 5,
      name: 'Index ETF',
      annualLimit: 7000
    });

    expect(store.createInstrument).toHaveBeenCalledWith(
      5000,
      0.05,
      'Index ETF',
      7000
    );
  });
});
