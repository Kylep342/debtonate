import { onMounted, onUnmounted } from 'vue'

export function useEvent(target, event, callback, callOnMount=false) {
  onMounted(() => {
    if (callOnMount) {
      callback();
    }
    target.addEventListener(event, callback);
  });
  onUnmounted(() => target.removeEventListener(event, callback));
}
