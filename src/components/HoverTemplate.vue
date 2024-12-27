<script setup>
defineProps(
  [
    'anchor',
    'lineName',
    'graphConfig',
    'index'
  ]
)
</script>

<template>
  <base-table>
    <template #header>
      <thead>
        <tr>
          <td>{{ graphConfig.yLabel }}</td>
          <td>{{ graphConfig.xLabel }}</td>
          <td :class="['text-right']">
            {{ graphConfig.xFormat(index) }}
          </td>
        </tr>
      </thead>
    </template>
    <template #body>
      <tr
        v-for="(id, line) in graphConfig.lines"
        :key="id"
      >
        <td>
          <svg>
            <circle
              cx="5"
              cy="5"
              r="5"
              :fill="graphConfig.color(id)"
            />
          </svg>
        </td>
        <td>{{ graphConfig.lineName(id) }}</td>
        <td>{{ graphConfig.yFormat(line[Math.min(index, line.length - 1)]) }}</td>
      </tr>
    </template>
  </base-table>
</template>
