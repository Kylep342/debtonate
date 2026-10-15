import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useAutoSave } from '@/apps/shared/composables/useAutoSave';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

describe('useAutoSave composable', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.useFakeTimers();
    window.location.hash = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    window.location.hash = '';
  });

  it('does not save when autoSaveState is false', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(false);

    const saveSpy = vi.fn();
    const testData = ref('initial');

    useAutoSave({
      saveFn: saveSpy,
      watchedSources: [() => testData.value],
      debounceMs: 300,
    });

    testData.value = 'updated';
    await vi.advanceTimersByTimeAsync(400);

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('debounces multiple changes and calls saveFn once when autoSaveState is true', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);

    const saveSpy = vi.fn();
    const testData = ref('initial');

    const { isSaving } = useAutoSave({
      saveFn: saveSpy,
      watchedSources: [() => testData.value],
      debounceMs: 300,
    });

    testData.value = 'update 1';
    await vi.advanceTimersByTimeAsync(100);
    expect(isSaving.value).toBe(true);
    expect(saveSpy).not.toHaveBeenCalled();

    testData.value = 'update 2';
    await vi.advanceTimersByTimeAsync(100);
    expect(saveSpy).not.toHaveBeenCalled();

    testData.value = 'update 3';
    await vi.advanceTimersByTimeAsync(350);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(isSaving.value).toBe(false);
  });

  it('calls onSave callback when debounced save succeeds', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);

    const saveSpy = vi.fn();
    const onSaveSpy = vi.fn();
    const testData = ref('initial');

    useAutoSave({
      saveFn: saveSpy,
      onSave: onSaveSpy,
      watchedSources: [() => testData.value],
      debounceMs: 200,
    });

    testData.value = 'new data';
    await vi.advanceTimersByTimeAsync(250);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(onSaveSpy).toHaveBeenCalledTimes(1);
  });

  it('cancels pending save when cancelPendingSave is called', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);

    const saveSpy = vi.fn();
    const testData = ref('initial');

    const { cancelPendingSave, isSaving } = useAutoSave({
      saveFn: saveSpy,
      watchedSources: [() => testData.value],
      debounceMs: 300,
    });

    testData.value = 'updated';
    await vi.advanceTimersByTimeAsync(100);
    expect(isSaving.value).toBe(true);

    cancelPendingSave();
    expect(isSaving.value).toBe(false);

    await vi.advanceTimersByTimeAsync(400);
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('immediately triggers saveFn when autoSaveState transitions from false to true', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(false);

    const saveSpy = vi.fn();
    const testData = ref('initial');

    useAutoSave({
      saveFn: saveSpy,
      watchedSources: [() => testData.value],
      debounceMs: 300,
    });

    expect(saveSpy).not.toHaveBeenCalled();

    globalOptions.setAutoSaveState(true);
    // Vue watch runs asynchronously in microtasks
    await vi.advanceTimersByTimeAsync(10);

    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('cancels pending save when autoSaveState transitions from true to false', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);

    const saveSpy = vi.fn();
    const testData = ref('initial');

    useAutoSave({
      saveFn: saveSpy,
      watchedSources: [() => testData.value],
      debounceMs: 300,
    });

    testData.value = 'updated';
    await vi.advanceTimersByTimeAsync(100);

    globalOptions.setAutoSaveState(false);
    await vi.advanceTimersByTimeAsync(400);

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('suppresses auto-save when URL has a plan hash or isPlanLoadedFromUrl is true', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);

    const saveSpy = vi.fn();
    const testData = ref('initial');
    const isPlanLoadedFromUrl = ref(true);

    // Scenario 1: isPlanLoadedFromUrl flag is true
    useAutoSave({
      saveFn: saveSpy,
      watchedSources: [() => testData.value],
      isPlanLoadedFromUrl,
      debounceMs: 200,
    });

    testData.value = 'changed with plan banner active';
    await vi.advanceTimersByTimeAsync(300);
    expect(saveSpy).not.toHaveBeenCalled();

    // Scenario 2: window hash has #plan=
    isPlanLoadedFromUrl.value = false;
    window.location.hash = '#plan=test';
    testData.value = 'changed with plan hash active';
    await vi.advanceTimersByTimeAsync(300);
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('flushes pending save on component unmount', async () => {
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);

    const saveSpy = vi.fn();
    const testData = ref('initial');

    const TestComponent = defineComponent({
      setup() {
        useAutoSave({
          saveFn: saveSpy,
          watchedSources: [() => testData.value],
          debounceMs: 500,
        });
        return () => h('div', 'test component');
      },
    });

    const wrapper = mount(TestComponent);

    testData.value = 'updated right before unmount';
    await vi.advanceTimersByTimeAsync(100);
    expect(saveSpy).not.toHaveBeenCalled();

    wrapper.unmount();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
