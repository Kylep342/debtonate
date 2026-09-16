/**
 * Utilities for serializing, compressing, and encoding plan state into shareable URL hashes.
 */

function u8ToBinary(u8: Uint8Array): string {
  let binary = '';
  const len = u8.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(u8[i]);
  }
  return binary;
}

function binaryToU8(binary: string): Uint8Array {
  const len = binary.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8[i] = binary.charCodeAt(i);
  }
  return u8;
}

function toBase64Url(binary: string): string {
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return atob(base64);
}

/**
 * Compresses an arbitrary JavaScript object into a URL-safe encoded string.
 * Uses CompressionStream('deflate') when available, otherwise falls back to base64url.
 */
export async function compressPlanState(state: Record<string, any>): Promise<string> {
  const jsonStr = JSON.stringify(state);
  const CompressionCtor = (globalThis as any).CompressionStream || (typeof window !== 'undefined' && (window as any).CompressionStream);

  if (typeof CompressionCtor === 'function') {
    try {
      const stream = new Blob([jsonStr]).stream().pipeThrough(new CompressionCtor('deflate'));
      const buffer = await new Response(stream).arrayBuffer();
      const binary = u8ToBinary(new Uint8Array(buffer));
      return `cz:${toBase64Url(binary)}`;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: raw UTF-8 base64url
  const utf8Bytes = new TextEncoder().encode(jsonStr);
  const binary = u8ToBinary(utf8Bytes);
  return `raw:${toBase64Url(binary)}`;
}

/**
 * Decompresses and decodes a plan state payload from a URL-safe encoded string.
 */
export async function decompressPlanState(encoded: string): Promise<Record<string, any>> {
  if (!encoded) {
    throw new Error('Empty plan payload');
  }

  const DecompressionCtor = (globalThis as any).DecompressionStream || (typeof window !== 'undefined' && (window as any).DecompressionStream);

  if (encoded.startsWith('cz:')) {
    const rawPayload = encoded.slice(3);
    const binary = fromBase64Url(rawPayload);
    const u8 = binaryToU8(binary);

    if (typeof DecompressionCtor === 'function') {
      const stream = new Blob([u8 as BlobPart]).stream().pipeThrough(new DecompressionCtor('deflate'));
      const jsonStr = await new Response(stream).text();
      return JSON.parse(jsonStr);
    }
  }

  if (encoded.startsWith('raw:')) {
    const rawPayload = encoded.slice(4);
    const binary = fromBase64Url(rawPayload);
    const u8 = binaryToU8(binary);
    const jsonStr = new TextDecoder().decode(u8);
    return JSON.parse(jsonStr);
  }

  // Fallback: try raw base64 or URI-decoded JSON
  try {
    const binary = fromBase64Url(encoded);
    const u8 = binaryToU8(binary);
    const jsonStr = new TextDecoder().decode(u8);
    return JSON.parse(jsonStr);
  } catch {
    return JSON.parse(decodeURIComponent(encoded));
  }
}

/**
 * Constructs a full URL bookmarkable with the given plan state in the hash.
 */
export async function buildShareUrl(state: Record<string, any>, currentHref?: string): Promise<string> {
  const compressed = await compressPlanState(state);
  const base = currentHref || (typeof window !== 'undefined' && window.location.href ? window.location.href : 'http://localhost');
  const url = new URL(base);
  url.hash = `plan=${compressed}`;
  return url.toString();
}

/**
 * Extracts and decodes plan state from a URL hash string.
 * Returns null if no valid plan is present.
 */
export async function parseShareUrlHash(hash: string): Promise<Record<string, any> | null> {
  if (!hash) return null;
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const match = cleanHash.match(/(?:^|&)plan=([^&]+)/);
  if (!match || !match[1]) return null;

  try {
    return await decompressPlanState(match[1]);
  } catch (err) {
    console.error('Failed to parse plan from URL hash:', err);
    return null;
  }
}
