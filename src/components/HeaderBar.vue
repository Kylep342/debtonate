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
          @click="state.openOptionsForm"
        >
          Options
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
          @click="state.loadState"
        >
          Load
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
          @click="state.saveState"
        >
          Save
        </base-button>
      </li>
      <li>
        <base-button
          :class="classes"
          @click="state.clearState"
        >
          Clear
        </base-button>
      </li>
    </ul>
  </header>
</template>
