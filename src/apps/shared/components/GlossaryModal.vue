<script setup lang="ts">
import { computed, ref, ComputedRef } from 'vue';

import elementIds from '@/apps/shared/constants/elementIds';
import { GLOSSARY_ENTRIES, filterGlossary, GlossaryEntry } from '@/apps/shared/constants/glossary';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

defineProps<{
  id: string;
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

const searchQuery = ref('');
const selectedCategory = ref<'all' | 'debt' | 'investing' | 'shared'>('all');

const filteredEntries: ComputedRef<GlossaryEntry[]> = computed(() =>
  filterGlossary(GLOSSARY_ENTRIES, searchQuery.value, selectedCategory.value)
);

const categoryBadgeClass = (category: string) => {
  switch (category) {
    case 'debt':
      return 'badge-secondary';
    case 'investing':
      return 'badge-primary';
    default:
      return 'badge-neutral';
  }
};

const categoryLabel = (category: string) => {
  switch (category) {
    case 'debt':
      return 'Debt';
    case 'investing':
      return 'Investing';
    default:
      return 'Shared';
  }
};

const categories = [
  { key: 'all', label: 'All Terms' },
  { key: 'debt', label: 'Debtonate (Debt)' },
  { key: 'investing', label: 'Appreciate (Investing)' },
  { key: 'shared', label: 'Shared' },
] as const;
</script>

<template>
  <base-modal
    :id="id"
    :body-classes="['p-4', 'max-w-2xl']"
    @exit="globalOptions.closeGlossary"
  >
    <template #header>
      <h3 class="text-lg md:text-xl font-bold">
        Financial Glossary & Guide
      </h3>
    </template>

    <template #headerActions>
      <base-button
        :id="elementIds.BTN_GLOSSARY_CLOSE"
        :class="['btn btn-circle btn-ghost']"
        @click="globalOptions.closeGlossary"
      >
        x
      </base-button>
    </template>

    <template #body>
      <div class="flex flex-col gap-3">
        <!-- Search Bar -->
        <div>
          <input
            :id="elementIds.INPUT_GLOSSARY_SEARCH"
            v-model="searchQuery"
            type="text"
            placeholder="Search financial terms, metrics, formulas..."
            class="input input-bordered input-sm w-full"
          >
        </div>

        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap gap-1">
          <button
            v-for="cat in categories"
            :key="cat.key"
            type="button"
            class="btn btn-xs"
            :class="selectedCategory === cat.key ? 'btn-primary' : 'btn-ghost'"
            @click="selectedCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Entries List -->
        <div
          v-if="filteredEntries.length > 0"
          class="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1"
        >
          <div
            v-for="entry in filteredEntries"
            :key="entry.id"
            class="bg-base-200/50 rounded-lg p-3 border border-base-content/10"
          >
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="font-bold text-sm md:text-base text-base-content">
                {{ entry.title }}
              </span>
              <span
                class="badge badge-sm uppercase text-[10px]"
                :class="categoryBadgeClass(entry.category)"
              >
                {{ categoryLabel(entry.category) }}
              </span>
            </div>

            <p class="text-xs md:text-sm text-base-content/80 mb-2">
              {{ entry.definition }}
            </p>

            <div
              v-if="entry.formula"
              class="font-mono text-xs bg-base-300/60 px-2 py-1 rounded text-primary border border-base-content/10 inline-block mb-1"
            >
              {{ entry.formula }}
            </div>

            <div
              v-if="entry.strategyTip"
              class="mt-2 text-xs bg-primary/15 text-base-content px-2 py-1.5 rounded border border-primary/20"
            >
              <span class="font-semibold text-primary">Strategy Tip:</span> {{ entry.strategyTip }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="text-center py-8 text-base-content/60"
        >
          <p class="text-base font-semibold">
            No terms found matching "{{ searchQuery }}"
          </p>
          <p class="text-xs mt-1">
            Try searching for another term or selecting "All Terms".
          </p>
        </div>
      </div>
    </template>

    <template #actions>
      <base-button
        :id="elementIds.BTN_GLOSSARY_DONE"
        class="btn-sm btn-primary"
        @click="globalOptions.closeGlossary"
      >
        Done
      </base-button>
    </template>
  </base-modal>
</template>
