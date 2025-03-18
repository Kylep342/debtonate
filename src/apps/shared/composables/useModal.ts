import { toValue, watch } from 'vue';

/**
 * 
 * registers a watcher to show/close a modal
 * 
 * @param flag Boolean variable for show/close state
 * @param domId ID of the modal dialog HTML element
 */
export function useModal(flag, domId) {
  watch(() => toValue(flag), async (value) => {
    const modal = document.getElementById(domId)
    if (!modal) {
      return
    } else if (value) {
      modal.showModal();
    } else {
      modal.close();
    }
  });
}