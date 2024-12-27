<script setup>
defineProps({
  graphConfig: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <base-table :class="['table-xs']">
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
