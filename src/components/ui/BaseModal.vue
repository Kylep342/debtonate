<script setup>
const props = defineProps(['title', 'id']);
</script>

<template>
  <dialog :id='props.id' :class="['modal', 'modal-bottom', 'sm:modal-middle']">
    <div :class="['modal-box', 'p-0']">
      <base-card :class="'overflow-hidden'">
        <template #cardTitle>
          <header :class="['navbar', 'bg-secondary']">
            <div :class="['flex-1']">
              <slot name='header'>
                <h2>{{ title }}</h2>
              </slot>
            </div>
            <div :class="['modal-action', 'flex-none', 'mt-0']">
              <menu>
                <slot name='headerActions'>
                </slot>
              </menu>
            </div>
          </header>
        </template>
        <template #cardBody>
          <slot :class="['vertical-scroll']" name='body'> </slot>
        </template>
        <template #cardActions>
          <div :class="['card-actions', 'justify-end', 'p-4']">
            <menu>
              <slot name='actions'></slot>
            </menu>
          </div>
        </template>
      </base-card>
    </div>
  </dialog>
</template>
