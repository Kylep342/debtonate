import { getCurrentInstance, onMounted, onUnmounted, ref, Ref } from 'vue';
import { parseShareUrlHash } from '@/apps/shared/functions/planSharing';

export function usePlanSharing(options: {
  appType: 'debtonate' | 'appreciate';
  importState: (data: Record<string, any>) => void;
}) {
  const isPlanLoadedFromUrl: Ref<boolean> = ref(false);
  const planLoadedMessage: Ref<string> = ref('');
  let dismissTimer: any = null;

  const checkAndLoadUrlPlan = async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || !hash.includes('plan=')) return;

    const plan = await parseShareUrlHash(hash);
    if (!plan) return;

    options.importState(plan);
    isPlanLoadedFromUrl.value = true;
    planLoadedMessage.value = 'Shared plan loaded from link!';

    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
      isPlanLoadedFromUrl.value = false;
    }, 5000);
  };

  if (getCurrentInstance()) {
    onMounted(() => {
      checkAndLoadUrlPlan();
      if (typeof window !== 'undefined') {
        window.addEventListener('hashchange', checkAndLoadUrlPlan);
      }
    });

    onUnmounted(() => {
      if (dismissTimer) clearTimeout(dismissTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('hashchange', checkAndLoadUrlPlan);
      }
    });
  }

  const dismissPlanAlert = (): void => {
    isPlanLoadedFromUrl.value = false;
  };

  return {
    checkAndLoadUrlPlan,
    dismissPlanAlert,
    isPlanLoadedFromUrl,
    planLoadedMessage,
  };
}
