<template>
  <teleport to="body">
    <div :class="['modalFrame']">
      <div :class="['modal']">
        <header>
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
        </header>
        <section>
          <slot :class="['vertical-scroll']" name="body">

          </slot>
        </section>
        <menu>
          <slot name="actions">
            <base-button @click="$emit('close')">Close</base-button>
          </slot>
        </menu>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  props: {title: {
    type: String,
    required: false,
  }},
  emits: ['close'],
}
</script>

<style scoped>

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  /* width: 600px; */
  max-width: calc(100% - 80px);
  max-height: calc(100% - 80px);
}

.modalFrame {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 2; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

header {
  background-color: #FF5733;
  color: white;
}

section {
  padding: 1rem;
  overflow: auto;
  max-height: calc(100vh - 125px);
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

</style>