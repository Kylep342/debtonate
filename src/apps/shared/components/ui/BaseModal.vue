<script setup lang="ts">
defineProps<{
  id: string,
  bodyClasses?: string[],
}>();
</script>

<template>
  <dialog
    :id="id"
    @close="$emit('exit')"
    :class="['modal', 'modal-bottom', 'sm:modal-middle']"
  >
    <div :class="['modal-box', 'p-0', 'flex', 'flex-col', 'min-w-40', 'max-w-fit', 'max-h-[90vh]']">
      <base-card
        :class="['overflow-hidden', 'flex-1', 'flex', 'flex-col', 'min-h-0']"
        :body-classes="['overflow-y-auto', 'flex-1', ...(bodyClasses || [])]"
      >
        <template #cardTitle>
          <header class="navbar bg-secondary">
            <div class="flex-1">
              <slot name="header" />
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
