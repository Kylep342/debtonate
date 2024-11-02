<script setup>
import useCoreStore from '../stores/core';
import constants from '../constants/constants';

const state = useCoreStore();

const buttons = [
  {text: constants.BTN_OPTIONS, onClick: state.openOptionsForm},
  {text: constants.BTN_LOAD, onClick: state.loadState},
  {text: constants.BTN_SAVE, onClick: state.saveState},
  {text: constants.BTN_CLEAR, onClick: state.clearState},
]
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
      <li
        v-for="(button) in buttons"
        :key="button.text"
      >
        <base-button
          :class="classes"
          @click="button.onClick"
        >
          {{ button.text }}
        </base-button>
      </li>
    </ul>
  </header>
</template>
