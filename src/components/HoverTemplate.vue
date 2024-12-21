<script setup>
import useCoreStore from '../stores/core';

defineProps(['anchor', 'lineName', 'graph'])

const coreState = useCoreStore();
</script>

<template>
  <base-table>
    <template #header>
      <thead>
        <tr>
          <td />
          <td>{{ coreState.Time }}</td>
          <td :class="['text-right']">{{ coreState.Period(anchor, true) }}</td>
        </tr>
      </thead>
    </template>
    <template #body>
      <tr v-for="(id, line) in graph.lines">
        <td></td>
        <td>{{ lineName(id) }}</td>
        <td>{{  }}</td>
      </tr>
    </template>
  </base-table>
</template>

