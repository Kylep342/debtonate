import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { usePlanSharing } from '@/apps/shared/composables/usePlanSharing';
import * as planSharingUtils from '@/apps/shared/functions/planSharing';

describe('usePlanSharing composable', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('detects and imports plan when hash contains plan', async () => {
    const importStateMock = vi.fn();
    const fakePlan = { loans: [{ id: '1', name: 'Test' }] };

    vi.spyOn(planSharingUtils, 'parseShareUrlHash').mockResolvedValue(fakePlan);
    window.location.hash = '#plan=dummy-token';

    const { isPlanLoadedFromUrl, planLoadedMessage, checkAndLoadUrlPlan } = usePlanSharing({
      appType: 'debtonate',
      importState: importStateMock,
    });

    await checkAndLoadUrlPlan();

    expect(importStateMock).toHaveBeenCalledWith(fakePlan);
    expect(isPlanLoadedFromUrl.value).toBe(true);
    expect(planLoadedMessage.value).toBe('Shared plan loaded from link!');
  });

  it('does nothing when hash does not contain plan', async () => {
    const importStateMock = vi.fn();
    window.location.hash = '#other-section';

    const { isPlanLoadedFromUrl, checkAndLoadUrlPlan } = usePlanSharing({
      appType: 'debtonate',
      importState: importStateMock,
    });

    await checkAndLoadUrlPlan();

    expect(importStateMock).not.toHaveBeenCalled();
    expect(isPlanLoadedFromUrl.value).toBe(false);
  });

  it('allows manual dismissal of plan alert', async () => {
    const importStateMock = vi.fn();
    const fakePlan = { loans: [] };
    vi.spyOn(planSharingUtils, 'parseShareUrlHash').mockResolvedValue(fakePlan);
    window.location.hash = '#plan=token';

    const { isPlanLoadedFromUrl, dismissPlanAlert, checkAndLoadUrlPlan } = usePlanSharing({
      appType: 'debtonate',
      importState: importStateMock,
    });

    await checkAndLoadUrlPlan();
    expect(isPlanLoadedFromUrl.value).toBe(true);

    dismissPlanAlert();
    expect(isPlanLoadedFromUrl.value).toBe(false);
  });
});
