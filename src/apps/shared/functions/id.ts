let idCounter = 0;

/**
 * Generates a unique string ID based on the current timestamp and an incrementing counter.
 * Guarantees the numeric representation is always greater than 2^32 - 1, preventing
 * JavaScript engines from sorting ID keys as 32-bit array indices in objects.
 */
export function generateId(): string {
  idCounter += 1;
  return String(Date.now() + idCounter);
}

/**
 * Resets the internal ID counter (primarily for deterministic test environments).
 */
export function resetIdCounter(): void {
  idCounter = 0;
}
