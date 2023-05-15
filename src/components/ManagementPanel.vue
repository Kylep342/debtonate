<script>
export default {
  props: ['panelId', 'panelTitle', 'createFunction'],
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
      <div :class="['panelheaderSubSection']">
        <button @click="createFunction">
          +
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
