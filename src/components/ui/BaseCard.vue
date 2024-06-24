<template>
  <div :class="['card']">
    <slot name="cardTitle"></slot>
    <div :class="['card-body', 'p-4', 'overflow-y-contain', 'overscroll-y-auto']">
      <slot name="cardBody"></slot>
    </div>
    <slot name="cardActions"></slot>
  </div>
</template>
