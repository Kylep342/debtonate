export interface CsvHeader {
  key: string;
  label: string;
}

/**
 * Escapes a cell value according to RFC 4180 CSV standard.
 */
export function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates an RFC 4180 compliant CSV string from headers, rows, and optional totals row.
 */
export function generateCsvString(
  headers: CsvHeader[],
  rows: Record<string, any>[],
  totals?: Record<string, any>
): string {
  const headerLine = headers.map(h => escapeCsvCell(h.label)).join(',');
  const rowLines = rows.map(row => headers.map(h => escapeCsvCell(row[h.key] ?? '')).join(','));

  const lines = [headerLine, ...rowLines];
  if (totals && Object.keys(totals).length > 0) {
    const totalsLine = headers.map(h => escapeCsvCell(totals[h.key] ?? '')).join(',');
    lines.push(totalsLine);
  }

  return lines.join('\r\n');
}

/**
 * Triggers a browser file download using a Blob and temporary anchor element.
 */
export function downloadFile(filename: string, content: string, mimeType: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports data rows and totals to a CSV file download.
 */
export function exportToCsv(
  filename: string,
  headers: CsvHeader[],
  rows: Record<string, any>[],
  totals?: Record<string, any>
): void {
  const csv = generateCsvString(headers, rows, totals);
  const cleanName = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  downloadFile(cleanName, csv, 'text/csv');
}

/**
 * Exports any serializable JavaScript object to a formatted JSON file download.
 */
export function exportToJson(
  filename: string,
  data: unknown
): void {
  const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const cleanName = filename.endsWith('.json') ? filename : `${filename}.json`;
  downloadFile(cleanName, json, 'application/json');
}
