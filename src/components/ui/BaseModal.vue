<script setup>
const props = defineProps(['title', 'id']);
</script>

<template>
  <dialog :id='props.id' :class="['modal modal-bottom sm:modal-middle']">
    <div :class="['modal-box card p-0']">
      <div :class="['card-body p-0']">
        <header :class="['navbar bg-secondary']">
          <div :class="['flex-1']">
            <slot name='header'>
              <h2>{{ title }}</h2>
            </slot>
          </div>
          <div :class="['modal-action flex-none']">
            <menu>
              <slot name='headerActions'>
              </slot>
            </menu>
          </div>
        </header>
        <section>
          <slot :class="['vertical-scroll']" name='body'> </slot>
        </section>
        <div :class="['modal-action']">
          <menu>
            <slot name='actions'></slot>
          </menu>
        </div>
      </div>
    </div>
  </dialog>
</template>
