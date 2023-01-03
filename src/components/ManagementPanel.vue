<script>
export default {
  props: {
    panelId: {
      type: String,
      required: true,
    },
    panelTitle: {
      type: String,
      required: true,
    },
    createFunction: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      foo: null,
    };
  },
};
</script>

<template>
  <div :id="panelId">
    <div :class="['panelHeader', 'header']">
      <h2 :class="['panelHeaderTitle']">{{ panelTitle }}</h2>
      <div :class="['panelHeaderButtonContainer']">
        <button
          @click="createFunction"
        >
        +
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
