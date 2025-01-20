<script setup>
import { onUpdated, ref } from 'vue';

const props = defineProps({
  graphConfig: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  updateTooltipSize: {
    type: Function,
    required: true,
  }
})

const templateRef = ref(null);

onUpdated(() => {
  const rect = templateRef.value.getBoundingClientRect();
  props.updateTooltipSize({ width: rect.width, height: rect.height });
})
</script>

<template>
  <base-table
    ref="templateRef"
    :class="['table-xs']"
  >
    <template #header>
      <thead>
        <tr :class="['bg-transparent']">
          <th>Color</th>
          <th>{{ graphConfig.xLabel }}</th>
          <th :class="['text-right']">
            {{ graphConfig.xFormat(index) }}
          </th>
        </tr>
      </thead>
    </template>
    <template #body>
      <tbody>
        <tr
          v-for="(line, id) in graphConfig.lines"
          :key="id"
        >
          <td>
            <svg
              width="10"
              height="10"
            >
              <circle
                cx="5"
                cy="5"
                r="5"
                :fill="graphConfig.color(id)"
              />
            </svg>
          </td>
          <td>{{ graphConfig.lineName(id) }}</td>
          <td :class="['text-right']">
            {{
              graphConfig.yFormat(
                line[Math.min(index - 1, line.length - 1)].y
              )
            }}
          </td>
        </tr>
      </tbody>
    </template>
  </base-table>
</template>
