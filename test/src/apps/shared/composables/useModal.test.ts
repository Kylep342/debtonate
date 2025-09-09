import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref, nextTick } from 'vue';

import { useModal } from '@/apps/shared/composables/useModal';

const MODAL_ID = 'test-modal';

describe('useModal composable', () => {
  let modalElement: HTMLDialogElement;

  beforeEach(() => {
    modalElement = document.createElement('dialog');
    modalElement.id = MODAL_ID;

    // Mock the .showModal() and .close() methods with empty functions.
    modalElement.showModal = vi.fn();
    modalElement.close = vi.fn();

    document.body.appendChild(modalElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should call showModal when the reactive flag becomes true', async () => {
    const showFlag = ref(false);
    const showModalSpy = vi.spyOn(modalElement, 'showModal');
    const closeModalSpy = vi.spyOn(modalElement, 'close');

    useModal(showFlag, MODAL_ID);

    showFlag.value = true;

    await nextTick();

    expect(showModalSpy).toHaveBeenCalledTimes(1);
    expect(closeModalSpy).not.toHaveBeenCalled();
  });

  it('should call close when the reactive flag becomes false', async () => {
    // Start with the flag as true to test toggling it off
    const showFlag = ref(true);
    const closeModalSpy = vi.spyOn(modalElement, 'close');

    useModal(showFlag, MODAL_ID);

    showFlag.value = false;
    await nextTick();

    expect(closeModalSpy).toHaveBeenCalledTimes(1);
  });

  it('should warn and do nothing if the modal element does not exist', async () => {
    const showFlag = ref(false);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {}); // Spy on console.warn

    useModal(showFlag, 'non-existent-id');

    showFlag.value = true;
    await nextTick();

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith("Modal with ID 'non-existent-id' not found.");
  });
});
