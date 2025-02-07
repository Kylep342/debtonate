<script setup lang="ts">
const props = defineProps<{
  title: string,
  id: string,
  bodyClasses: Array<string>,
}>();
</script>

<template>
  <dialog
    :id="id"
    class="modal modal-bottom sm:modal-middle"
  >
    <div :class="['modal-box', 'p-0', 'flex', 'flex-col', 'min-w-40', 'max-w-fit']">
      <base-card
        :class="['overflow-hidden']"
        :body-classes="props.bodyClasses"
      >
        <template #cardTitle>
          <header class="navbar bg-secondary">
            <div class="flex-1">
              <slot name="header">
                <h2>{{ title }}</h2>
              </slot>
            </div>
            <div class="modal-action flex-none mt-0">
              <menu>
                <slot name="headerActions" />
              </menu>
            </div>
          </header>
        </template>
        <template #cardBody>
          <slot name="body" />
        </template>
        <template #cardActions>
          <div class="card-actions justify-end p-4">
            <menu>
              <slot name="actions" />
            </menu>
          </div>
        </template>
      </base-card>
    </div>
  </dialog>
</template>

<style scoped>
.modal-box {
  min-width: 40%;
  max-width: fit-content;
}
</style>
