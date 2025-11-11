import { describe, expect, it } from 'vitest';
import { ref, Ref } from 'vue';

import { usePivot } from '@/apps/shared/composables/usePivot';


describe('usePivot composable', () => {
  it('works as intended', async () => {
    const items: Ref<string[]> = ref(['dog', 'cat', 'fish', 'bird', 'bear', 'monkey']);
    const {
      viewedItemId: viewedAnimal,
      isViewedItemId: isViewedAnimal,
      setViewedItemId: setViewedAnimal
    } = usePivot('bear');

    expect(viewedAnimal.value).toBe('bear');
    expect(isViewedAnimal('bear')).toBe(true);
    expect(isViewedAnimal('bird')).toBe(false);
    expect(isViewedAnimal('cat')).toBe(false);
    expect(isViewedAnimal('dog')).toBe(false);
    expect(isViewedAnimal('fish')).toBe(false);
    expect(isViewedAnimal('monkey')).toBe(false);

    setViewedAnimal('cat');
    expect(isViewedAnimal('bear')).toBe(false);
    expect(isViewedAnimal('bird')).toBe(false);
    expect(isViewedAnimal('cat')).toBe(true);
    expect(isViewedAnimal('dog')).toBe(false);
    expect(isViewedAnimal('fish')).toBe(false);
    expect(isViewedAnimal('monkey')).toBe(false);
  });
});
