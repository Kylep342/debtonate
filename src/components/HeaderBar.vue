<script setup>
import emitters from '../constants/emitters';

const emits = defineEmits([
  emitters.EMIT_CLEAR_APP_STATE,
  emitters.EMIT_LOAD_APP_STATE,
  emitters.EMIT_OPEN_OPTIONS_FORM,
  emitters.EMIT_SAVE_APP_STATE,
]);

const emitClearState = () => emits(emitters.EMIT_CLEAR_APP_STATE);
const emitLoadState = () => emits(emitters.EMIT_LOAD_APP_STATE);
const emitOpenOptions = () => emits(emitters.EMIT_OPEN_OPTIONS_FORM);
const emitSaveState = () => emits(emitters.EMIT_SAVE_APP_STATE);
const classes = ['rounded-none btn-secondary'];
</script>

<template>
  <header
    :id="['header']"
    :class="['navbar', 'bg-secondary', 'sticky', 'top-0', 'z-30']"
  >
    <div :class="['flex-1']">
      <img src="/icon.png">
      <h1>Debtonate</h1>
    </div>
    <ul :class="['menu menu-horizontal bg-secondary']">
      <li>
        <base-button
          :class="classes"
          @click="emitOpenOptions"
        >
          Options
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
          @click="emitLoadState"
        >
          Load
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
          @click="emitSaveState"
        >
          Save
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
          @click="emitClearState"
        >
          Clear
        </base-button>
      </li>
    </ul>
  </header>
</template>
