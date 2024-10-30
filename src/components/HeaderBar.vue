<script setup>
import useCoreStore from '../stores/core';

const state = useCoreStore();

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
<<<<<<< HEAD
          @click="emitOpenOptions"
=======
          @click="state.openOptionsForm"
>>>>>>> develop
        >
          Options
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
<<<<<<< HEAD
          @click="emitLoadState"
=======
          @click="state.loadState"
>>>>>>> develop
        >
          Load
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
<<<<<<< HEAD
          @click="emitSaveState"
=======
          @click="state.saveState"
>>>>>>> develop
        >
          Save
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
<<<<<<< HEAD
          @click="emitClearState"
=======
          @click="state.clearState"
>>>>>>> develop
        >
          Clear
        </base-button>
      </li>
    </ul>
  </header>
</template>
