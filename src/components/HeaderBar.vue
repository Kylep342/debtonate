<script setup>
const emits = defineEmits([
  'clear-app-state',
  'load-app-state',
  'open-options-form',
  'save-app-state',
]);

const emitClearState = () => emits('clear-app-state');
const emitLoadState = () => emits('load-app-state');
const emitOpenOptions = () => emits('open-options-form');
const emitSaveState = () => emits('save-app-state');
</script>

<template>
  <div>
    <header :id="['header']" :class="['header']">
      <div :class="['headerSubSection']">
        <img src='/sqicon.png' />
        <h1 :class="['headerTitle']">Debtonate</h1>
      </div>
      <div :class="['headerSubSection']">
        <base-button :class="['rounded-none']" @click='emitOpenOptions'>Options</base-button>
        <base-button :class="['rounded-none']" @click='emitLoadState'>Load</base-button>
        <base-button :class="['rounded-none']" @click='emitSaveState'>Save</base-button>
        <base-button :class="['rounded-none']" @click='emitClearState'>Clear</base-button>
      </div>
    </header>
  </div>
</template>
