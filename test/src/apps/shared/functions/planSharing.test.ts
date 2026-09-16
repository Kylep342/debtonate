import { describe, expect, it } from 'vitest';
import {
  compressPlanState,
  decompressPlanState,
  buildShareUrl,
  parseShareUrlHash,
} from '@/apps/shared/functions/planSharing';

describe('planSharing utilities', () => {
  const samplePlan = {
    loans: [
      {
        id: '1',
        name: 'Primary Mortgage',
        principal: 300000,
        annualRate: 0.055,
        termInYears: 30,
        periodsPerYear: 12,
        minPayment: 1703.37,
        currentBalance: 290000,
        fees: 0,
      },
      {
        id: '2',
        name: 'Car Loan',
        principal: 25000,
        annualRate: 0.045,
        termInYears: 5,
        periodsPerYear: 12,
        minPayment: 466.07,
        currentBalance: 18000,
        fees: 100,
      },
    ],
    budgets: [
      { id: 'b1', relative: 500 },
    ],
    snowballSort: false,
    roundingEnabled: true,
    roundingScale: 10,
    currency: 'USD',
  };

  it('compresses and decompresses plan state round-trip successfully', async () => {
    const compressed = await compressPlanState(samplePlan);
    expect(typeof compressed).toBe('string');
    expect(compressed.length).toBeGreaterThan(10);

    const decompressed = await decompressPlanState(compressed);
    expect(decompressed).toStrictEqual(samplePlan);
  });

  it('builds a valid shareable URL with hash', async () => {
    const url = await buildShareUrl(samplePlan, 'http://localhost:5173/debtonate');
    expect(url).toContain('http://localhost:5173/debtonate#plan=');

    const hash = new URL(url).hash;
    const parsed = await parseShareUrlHash(hash);
    expect(parsed).toStrictEqual(samplePlan);
  });

  it('parses hash without leading # sign', async () => {
    const compressed = await compressPlanState(samplePlan);
    const parsed = await parseShareUrlHash(`plan=${compressed}`);
    expect(parsed).toStrictEqual(samplePlan);
  });

  it('returns null for empty or invalid hash', async () => {
    expect(await parseShareUrlHash('')).toBeNull();
    expect(await parseShareUrlHash('#other-hash=123')).toBeNull();
    expect(await parseShareUrlHash('#plan=invalid!payload')).toBeNull();
  });

  it('handles raw base64 and url-encoded fallback payloads', async () => {
    const jsonStr = JSON.stringify(samplePlan);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let bin = '';
    for (let i = 0; i < utf8Bytes.length; i++) bin += String.fromCharCode(utf8Bytes[i]);
    const rawB64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const parsedRaw = await decompressPlanState(`raw:${rawB64}`);
    expect(parsedRaw).toStrictEqual(samplePlan);

    const parsedUri = await decompressPlanState(encodeURIComponent(jsonStr));
    expect(parsedUri).toStrictEqual(samplePlan);
  });
});
