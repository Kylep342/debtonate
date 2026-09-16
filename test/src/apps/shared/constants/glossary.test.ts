import { describe, expect, it } from 'vitest';
import { GLOSSARY_ENTRIES, filterGlossary } from '@/apps/shared/constants/glossary';

describe('Financial Glossary & Filter Utility', () => {
  it('contains comprehensive glossary definitions', () => {
    expect(GLOSSARY_ENTRIES.length).toBeGreaterThanOrEqual(20);

    GLOSSARY_ENTRIES.forEach((entry) => {
      expect(entry.id).toBeTruthy();
      expect(entry.title).toBeTruthy();
      expect(entry.definition).toBeTruthy();
      expect(['debt', 'investing', 'shared']).toContain(entry.category);
    });
  });

  it('filters by category accurately', () => {
    const debtEntries = filterGlossary(GLOSSARY_ENTRIES, '', 'debt');
    expect(debtEntries.length).toBeGreaterThan(0);
    debtEntries.forEach((entry) => expect(entry.category).toBe('debt'));

    const investingEntries = filterGlossary(GLOSSARY_ENTRIES, '', 'investing');
    expect(investingEntries.length).toBeGreaterThan(0);
    investingEntries.forEach((entry) => expect(entry.category).toBe('investing'));

    const allEntries = filterGlossary(GLOSSARY_ENTRIES, '', 'all');
    expect(allEntries.length).toBe(GLOSSARY_ENTRIES.length);
  });

  it('filters by search query case-insensitively across title, definition, and tips', () => {
    const snowballs = filterGlossary(GLOSSARY_ENTRIES, 'snowball');
    expect(snowballs.length).toBeGreaterThanOrEqual(1);
    expect(snowballs[0].title).toContain('Snowball');

    const formulaMatches = filterGlossary(GLOSSARY_ENTRIES, 'Annual Limit ÷ 12');
    expect(formulaMatches.length).toBeGreaterThanOrEqual(1);
    expect(formulaMatches[0].title).toBe('Max Monthly Contribution');

    const tipMatches = filterGlossary(GLOSSARY_ENTRIES, 'psychological');
    expect(tipMatches.length).toBeGreaterThanOrEqual(1);
  });

  it('combines category filter and search query', () => {
    const debtInterest = filterGlossary(GLOSSARY_ENTRIES, 'interest', 'debt');
    expect(debtInterest.length).toBeGreaterThanOrEqual(1);
    debtInterest.forEach((entry) => expect(entry.category).toBe('debt'));

    const noMatches = filterGlossary(GLOSSARY_ENTRIES, 'snowball', 'investing');
    expect(noMatches.length).toBe(0);
  });

  it('returns empty array when search query matches nothing', () => {
    const results = filterGlossary(GLOSSARY_ENTRIES, 'xyz_random_nonexistent_term_123');
    expect(results).toStrictEqual([]);
  });
});
