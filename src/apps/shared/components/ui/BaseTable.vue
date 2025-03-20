<template>
  <table :class="['table', 'table-pin-rows']">
    <slot name="header" />
    <slot name="body" />
    <slot name="footer" />
  </table>
</template>
