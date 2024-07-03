<template>
  <table :class="['table', 'table-pin-rows']">
    <slot name="header"></slot>
    <slot name="body"></slot>
    <slot name="footer"></slot>
  </table>
</template>
