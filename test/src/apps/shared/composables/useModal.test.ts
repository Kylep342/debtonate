import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref, nextTick, Ref } from 'vue';

import { useModal } from '@/apps/shared/composables/useModal';
import { mockDialog } from '../../../../helpers/withMocks';

const MODAL_ID = 'test-modal';

describe('useModal composable', () => {
  let modalElement: HTMLDialogElement;

  beforeEach(() => {
    // create automocked HTML dialog
    modalElement = mockDialog(document.createElement('dialog'));
    modalElement.id = MODAL_ID;

    document.body.appendChild(modalElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should call showModal when the reactive flag becomes true', async () => {
    const showFlag: Ref<boolean> = ref(false);
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
    const showFlag: Ref<boolean> = ref(true);
    const closeModalSpy = vi.spyOn(modalElement, 'close');

    useModal(showFlag, MODAL_ID);

    showFlag.value = false;
    await nextTick();

    expect(closeModalSpy).toHaveBeenCalledTimes(1);
  });

  it('should warn and do nothing if the modal element does not exist', async () => {
    const showFlag: Ref<boolean> = ref(false);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {}); // Spy on console.warn

    useModal(showFlag, 'non-existent-id');

    showFlag.value = true;
    await nextTick();

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith("Modal with ID 'non-existent-id' not found.");
  });
});
