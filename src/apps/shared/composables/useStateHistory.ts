import { computed, ComputedRef, ref, Ref } from 'vue';
import { computeStateHash } from '@/apps/shared/functions/export';

export interface StateSnapshot {
  id: string;
  timestamp: number;
  hash: string;
  summary: string;
  data: Record<string, any>;
}

export interface UseStateHistoryOptions {
  appType: 'debtonate' | 'appreciate';
  exportState: () => Record<string, any>;
  importState: (data: Record<string, any>) => void;
  getSummary?: (data: Record<string, any>) => string;
  maxSnapshots?: number;
}

export interface UseStateHistoryReturn {
  canUndo: ComputedRef<boolean>;
  clearHistory: () => void;
  formatTime: (timestamp: number) => string;
  pushSnapshot: (customData?: Record<string, any>, customSummary?: string) => boolean;
  restoreSnapshot: (index: number) => boolean;
  snapshots: Ref<StateSnapshot[]>;
  undo: () => boolean;
}

const historyByApp = new Map<string, Ref<StateSnapshot[]>>();

export function getAppHistoryRef(appType: string): Ref<StateSnapshot[]> {
  if (!historyByApp.has(appType)) {
    historyByApp.set(appType, ref([]));
  }
  return historyByApp.get(appType)!;
}

export function resetAllStateHistory(): void {
  historyByApp.forEach((historyRef) => {
    historyRef.value = [];
  });
  historyByApp.clear();
}

export function formatSnapshotTime(timestamp: number): string {
  const diffMs = Math.max(0, Date.now() - timestamp);
  if (diffMs < 5_000) return 'Just now';
  if (diffMs < 60_000) return `${Math.floor(diffMs / 1000)}s ago`;
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function useStateHistory(options: UseStateHistoryOptions): UseStateHistoryReturn {
  const maxSnapshots = options.maxSnapshots ?? 10;
  const storageKey = `${options.appType}.stateHistory`;
  const snapshots = getAppHistoryRef(options.appType);

  // Hydrate from localStorage once if ref is empty
  if (snapshots.value.length === 0 && typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          snapshots.value = parsed.slice(0, maxSnapshots);
        }
      }
    } catch {
      // ignore
    }
  }

  const pushSnapshot = (
    customData?: Record<string, any>,
    customSummary?: string,
  ): boolean => {
    const data = customData ?? options.exportState();
    const hash = computeStateHash(data);

    // Deduplicate if identical to latest snapshot
    if (snapshots.value.length > 0 && snapshots.value[0].hash === hash) {
      return false;
    }

    const summary = customSummary ?? options.getSummary?.(data) ?? '';
    const snapshot: StateSnapshot = {
      id: `${Date.now()}-${hash.slice(0, 6)}`,
      timestamp: Date.now(),
      hash,
      summary,
      data,
    };

    snapshots.value = [snapshot, ...snapshots.value].slice(0, maxSnapshots);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(snapshots.value));
      } catch {
        // ignore
      }
    }
    return true;
  };

  const restoreSnapshot = (index: number): boolean => {
    if (index < 0 || index >= snapshots.value.length) return false;
    const target = snapshots.value[index];
    if (!target) return false;

    // Capture current state if it hasn't been saved to top of history
    const currentState = options.exportState();
    const currentHash = computeStateHash(currentState);
    if (snapshots.value.length === 0 || snapshots.value[0].hash !== currentHash) {
      pushSnapshot(currentState);
    }

    // Apply target state
    options.importState(target.data);

    // Re-push restored state to ensure it is the current head
    pushSnapshot(target.data, target.summary);
    return true;
  };

  const undo = (): boolean => {
    if (snapshots.value.length < 2) return false;
    return restoreSnapshot(1);
  };

  const canUndo = computed<boolean>(() => snapshots.value.length > 1);

  const clearHistory = (): void => {
    snapshots.value = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
  };

  return {
    canUndo,
    clearHistory,
    formatTime: formatSnapshotTime,
    pushSnapshot,
    restoreSnapshot,
    snapshots,
    undo,
  };
}
