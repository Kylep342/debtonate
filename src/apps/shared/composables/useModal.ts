import { watch } from "vue";

/**
 * Registers a watcher to show/close a modal dialog element.
 *
 * @param {boolean} flag - A reactive boolean controlling the modal's visibility.
 * @param {string} domId - The ID of the modal dialog element.
 */
export function useModal(flag: boolean, domId: string): void {
  watch(flag, async (value) => {
    const modal = document.getElementById(domId) as HTMLDialogElement | null;

    // check to ensure modal element is on page
    if (!modal) {
      console.warn(`Modal with ID '${domId}' not found.`);
      return;
    }

    if (value) {
      modal.showModal();
    } else {
      modal.close();
    }
  });
};
