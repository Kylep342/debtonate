import { vi } from 'vitest';

export type MockDefinition<T> = {
  method: keyof T;
  implementation?: (...args: any[]) => any;
};

/**
 * patches an object with multiple mocks at once.
 * @param {T} target The object to patch (e.g. window, an element, a class prototype)
 * @param {MockDefinition<T>} mocks List of methods to mock
 */
export function withMocks<T extends object>(
  target: T,
  ...mocks: MockDefinition<T>[]
) {
  mocks.forEach(({ method, implementation }) => {
    // If it's already a spy/mock, just updating implementation might be safer,
    // but for missing DOM methods, we often need to force assignment.

    const fn = implementation ? vi.fn(implementation) : vi.fn();

    // We cast to 'any' here because we are often patching read-only DOM APIs
    // or methods that don't technically exist in JSDOM types.
    (target as any)[method] = fn;
  });
}

/**
 * Specific helper for mocking the browser window
 * because JSDOM does not implement these methods.
 * @param {HTMLElement} element the element to mock
 */
export function mockDialog(element: HTMLElement) {
  withMocks(element,
    { method: 'showModal' as keyof HTMLElement },
    { method: 'close' as keyof HTMLElement },
  );
  return element as HTMLDialogElement;
}
