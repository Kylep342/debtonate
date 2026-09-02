import { onMounted, onUnmounted } from 'vue';

export function useEvent(
  target: EventTarget | Window,
  event: string,
  callback: EventListenerOrEventListenerObject | ((...args: any[]) => void),
  callOnMount: boolean = false
) {
  onMounted(() => {
    if (callOnMount) {
      (callback as any)();
    }
    target.addEventListener(event, callback as EventListener);
  });
  onUnmounted(() => target.removeEventListener(event, callback as EventListener));
}
