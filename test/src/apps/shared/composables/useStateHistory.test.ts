import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  formatSnapshotTime,
  resetAllStateHistory,
  useStateHistory,
} from '@/apps/shared/composables/useStateHistory';

describe('useStateHistory composable', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAllStateHistory();
  });

  afterEach(() => {
    localStorage.clear();
    resetAllStateHistory();
  });

  it('initializes with empty snapshots or loads from localStorage', () => {
    const mockState = { test: 1 };
    const history1 = useStateHistory({
      appType: 'debtonate',
      exportState: () => mockState,
      importState: vi.fn(),
    });

    expect(history1.snapshots.value).toEqual([]);
    expect(history1.canUndo.value).toBe(false);

    // Pre-populate localStorage
    const savedSnapshots = [
      { id: '1', timestamp: Date.now(), hash: 'abc', summary: '1 loan', data: { test: 2 } },
    ];
    localStorage.setItem('appreciate.stateHistory', JSON.stringify(savedSnapshots));

    const history2 = useStateHistory({
      appType: 'appreciate',
      exportState: () => mockState,
      importState: vi.fn(),
    });

    expect(history2.snapshots.value.length).toBe(1);
    expect(history2.snapshots.value[0].summary).toBe('1 loan');
  });

  it('pushes snapshots, generates summaries, and caps at maxSnapshots', () => {
    let currentState = { count: 0 };
    const history = useStateHistory({
      appType: 'debtonate',
      exportState: () => currentState,
      importState: vi.fn(),
      getSummary: (data) => `${data.count} items`,
      maxSnapshots: 3,
    });

    // Push state 1
    currentState = { count: 1 };
    const pushed1 = history.pushSnapshot();
    expect(pushed1).toBe(true);
    expect(history.snapshots.value.length).toBe(1);
    expect(history.snapshots.value[0].summary).toBe('1 items');

    // Deduplication check: pushing same state again returns false
    const pushedDup = history.pushSnapshot();
    expect(pushedDup).toBe(false);
    expect(history.snapshots.value.length).toBe(1);

    // Push states 2, 3, 4
    currentState = { count: 2 };
    history.pushSnapshot();
    currentState = { count: 3 };
    history.pushSnapshot();
    currentState = { count: 4 };
    history.pushSnapshot();

    // Should be capped at maxSnapshots (3)
    expect(history.snapshots.value.length).toBe(3);
    expect(history.snapshots.value[0].summary).toBe('4 items');
    expect(history.snapshots.value[1].summary).toBe('3 items');
    expect(history.snapshots.value[2].summary).toBe('2 items');

    // LocalStorage should reflect the capped array
    const stored = JSON.parse(localStorage.getItem('debtonate.stateHistory') || '[]');
    expect(stored.length).toBe(3);
  });

  it('restores snapshot and moves it to head non-destructively', () => {
    let currentState = { count: 1 };
    const importSpy = vi.fn((data) => {
      currentState = { ...data };
    });

    const history = useStateHistory({
      appType: 'debtonate',
      exportState: () => currentState,
      importState: importSpy,
      getSummary: (data) => `State ${data.count}`,
    });

    currentState = { count: 1 };
    history.pushSnapshot();

    currentState = { count: 2 };
    history.pushSnapshot();

    currentState = { count: 3 };
    history.pushSnapshot();

    expect(history.snapshots.value.length).toBe(3);
    expect(history.canUndo.value).toBe(true);

    // Restore index 2 (State 1)
    const success = history.restoreSnapshot(2);
    expect(success).toBe(true);
    expect(importSpy).toHaveBeenCalledWith({ count: 1 });

    // The head of history should now be State 1, followed by State 3 and State 2
    expect(history.snapshots.value[0].data).toEqual({ count: 1 });
    expect(history.snapshots.value[1].data).toEqual({ count: 3 });

    // Restoring invalid index returns false
    expect(history.restoreSnapshot(-1)).toBe(false);
    expect(history.restoreSnapshot(99)).toBe(false);
  });

  it('undo reverts to the previous snapshot (index 1)', () => {
    let currentState = { count: 10 };
    const importSpy = vi.fn((data) => {
      currentState = { ...data };
    });

    const history = useStateHistory({
      appType: 'debtonate',
      exportState: () => currentState,
      importState: importSpy,
    });

    history.pushSnapshot(); // state 10
    currentState = { count: 20 };
    history.pushSnapshot(); // state 20

    expect(history.canUndo.value).toBe(true);

    const undoSuccess = history.undo();
    expect(undoSuccess).toBe(true);
    expect(importSpy).toHaveBeenCalledWith({ count: 10 });

    // When only 1 snapshot remains, undo returns false
    history.clearHistory();
    expect(history.undo()).toBe(false);
  });

  it('clears history completely from memory and localStorage', () => {
    const history = useStateHistory({
      appType: 'debtonate',
      exportState: () => ({ x: 1 }),
      importState: vi.fn(),
    });

    history.pushSnapshot();
    expect(history.snapshots.value.length).toBe(1);
    expect(localStorage.getItem('debtonate.stateHistory')).not.toBeNull();

    history.clearHistory();
    expect(history.snapshots.value).toEqual([]);
    expect(localStorage.getItem('debtonate.stateHistory')).toBeNull();
  });

  it('shares reactive history across multiple useStateHistory invocations with the same appType', () => {
    const historyA = useStateHistory({
      appType: 'debtonate',
      exportState: () => ({ val: 'A' }),
      importState: vi.fn(),
    });

    const historyB = useStateHistory({
      appType: 'debtonate',
      exportState: () => ({ val: 'B' }),
      importState: vi.fn(),
    });

    historyA.pushSnapshot({ val: 'test' }, 'A pushed');
    expect(historyB.snapshots.value.length).toBe(1);
    expect(historyB.snapshots.value[0].summary).toBe('A pushed');
  });

  describe('formatSnapshotTime', () => {
    it('formats recent timestamps as Just now, seconds, or minutes ago', () => {
      const now = Date.now();
      expect(formatSnapshotTime(now)).toBe('Just now');
      expect(formatSnapshotTime(now - 3_000)).toBe('Just now');
      expect(formatSnapshotTime(now - 15_000)).toBe('15s ago');
      expect(formatSnapshotTime(now - 120_000)).toBe('2m ago');

      // Older timestamp format (e.g. 2 hours ago)
      const twoHoursAgo = now - 7_200_000;
      const formatted = formatSnapshotTime(twoHoursAgo);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });
});
