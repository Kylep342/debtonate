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
const classes = ['rounded-none btn-secondary'];
</script>

<template>
  <header :id="['header']" :class="['navbar', 'bg-secondary', 'sticky', 'top-0', 'z-30']">
    <div :class="['flex-1']">
      <img src="/icon.png" />
      <h1>Debtonate</h1>
    </div>
    <ul :class="['menu menu-horizontal bg-secondary']">
      <li>
        <base-button :class="classes" @click="emitOpenOptions">Options</base-button>
      </li>
      <li>
        <base-button :class="classes" @click="emitLoadState">Load</base-button>
      </li>
      <li>
        <base-button :class="classes" @click="emitSaveState">Save</base-button>
      </li>
      <li>
        <base-button :class="classes" @click="emitClearState">Clear</base-button>
      </li>
    </ul>
  </header>
</template>
