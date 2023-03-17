<script>
export default {
  emits: ['open-options-form', 'load-app-state', 'save-app-state', 'clear-app-state'],
  methods: {
    emitOpenOptions() {
      this.$emit('open-options-form');
    },
    emitLoadState() {
      this.$emit('load-app-state');
    },
    emitSaveState() {
      this.$emit('save-app-state');
    },
    emitClearState() {
      this.$emit('clear-app-state');
    },
  },
};
</script>

<template>
  <div>
    <header :id="['header']" :class="['header']">
      <div :class="['headerSubSection']">
        <img src="public/sqicon.png">
        <h1 :class="['headerTitle']">Debtonate</h1>
      </div>
      <div :class="['headerSubSection']">
        <button :class="['headerButton']" @click="emitOpenOptions">Options</button>
        <button :class="['headerButton']" @click="emitLoadState">Load</button>
        <button :class="['headerButton']" @click="emitSaveState">Save</button>
        <button :class="['headerButton']" @click="emitClearState">Clear</button>
      </div>
    </header>
  </div>
</template>

<style scoped></style>
