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
    <header :id="['header']" :class="['navbar bg-secondary']">
      <div :class="['flex-1']">
        <img src='/sqicon.png' />
        <h1>Debtonate</h1>
      </div>
      <ul :class="['menu menu-horizontal bg-secondary']">
        <li>
          <base-button
            :class="['rounded-none btn-accent']"
            @click='emitOpenOptions'
          >
            Options
          </base-button>
        </li>
        <li>
          <base-button
            :class="['rounded-none btn-accent']"
            @click='emitLoadState'
          >
            Load
          </base-button>
        </li>
        <li>
          <base-button
            :class="['rounded-none btn-accent']"
            @click='emitSaveState'
          >
            Save
          </base-button>
        </li>
        <li>
          <base-button
            :class="['rounded-none btn-accent']"
            @click='emitClearState'
          >
            Clear
          </base-button>
        </li>
      </ul>
    </header>
  </div>
</template>
