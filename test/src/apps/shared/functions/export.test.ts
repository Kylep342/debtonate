import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  escapeCsvCell,
  generateCsvString,
  downloadFile,
  exportToCsv,
  exportToJson,
} from '@/apps/shared/functions/export';

describe('export utilities', () => {
  describe('escapeCsvCell', () => {
    it('handles null and undefined', () => {
      expect(escapeCsvCell(null)).toBe('""');
      expect(escapeCsvCell(undefined)).toBe('""');
    });

    it('escapes simple strings without special characters', () => {
      expect(escapeCsvCell('Hello')).toBe('"Hello"');
      expect(escapeCsvCell(123)).toBe('"123"');
    });

    it('escapes strings with commas, quotes, and newlines', () => {
      expect(escapeCsvCell('Hello, World')).toBe('"Hello, World"');
      expect(escapeCsvCell('He said "Hi"')).toBe('"He said ""Hi"""');
      expect(escapeCsvCell('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
    });
  });

  describe('generateCsvString', () => {
    const headers = [
      { key: 'period', label: 'Period' },
      { key: 'payment', label: 'Payment' },
      { key: 'balance', label: 'Remaining Balance' },
    ];

    const rows = [
      { period: '1', payment: '$100.00', balance: '$900.00' },
      { period: '2', payment: '$100.00', balance: '$800.00' },
    ];

    const totals = {
      period: 'Totals',
      payment: '$200.00',
      balance: '$800.00',
    };

    it('generates properly formatted CSV string with totals', () => {
      const csv = generateCsvString(headers, rows, totals);
      const lines = csv.split('\r\n');
      expect(lines.length).toBe(4);
      expect(lines[0]).toBe('"Period","Payment","Remaining Balance"');
      expect(lines[1]).toBe('"1","$100.00","$900.00"');
      expect(lines[2]).toBe('"2","$100.00","$800.00"');
      expect(lines[3]).toBe('"Totals","$200.00","$800.00"');
    });

    it('generates CSV string without totals when omitted', () => {
      const csv = generateCsvString(headers, rows);
      const lines = csv.split('\r\n');
      expect(lines.length).toBe(3);
    });
  });

  describe('downloadFile, exportToCsv, and exportToJson', () => {
    let originalCreateObjectURL: any;
    let originalRevokeObjectURL: any;
    let createdAnchor: HTMLAnchorElement | null = null;
    let clickSpy: any;

    beforeEach(() => {
      originalCreateObjectURL = URL.createObjectURL;
      originalRevokeObjectURL = URL.revokeObjectURL;

      URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      URL.revokeObjectURL = vi.fn();

      clickSpy = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName === 'a') {
          createdAnchor = el as HTMLAnchorElement;
          el.click = clickSpy;
        }
        return el;
      });
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      vi.restoreAllMocks();
    });

    it('downloads file with correct name and triggers click', () => {
      downloadFile('test.txt', 'hello world', 'text/plain');
      expect(createdAnchor?.download).toBe('test.txt');
      expect(createdAnchor?.href).toContain('mock-url');
      expect(clickSpy).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('exports CSV with auto-added extension', () => {
      exportToCsv('my_schedule', [{ key: 'col1', label: 'Col 1' }], [{ col1: 'A' }]);
      expect(createdAnchor?.download).toBe('my_schedule.csv');
      expect(clickSpy).toHaveBeenCalled();
    });

    it('exports JSON with auto-added extension', () => {
      exportToJson('my_plan', { foo: 'bar' });
      expect(createdAnchor?.download).toBe('my_plan.json');
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
