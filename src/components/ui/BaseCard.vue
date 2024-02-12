<template>
  <div :class="['card']">
    <div :class="['card-body']">
      <div>
        <slot name="cardTitle"></slot>
      </div>
      <div>
        <slot name="cardContent"></slot>
      </div>
      <div :class="['card-actions', 'justify-end']">
        <slot name="cardActions"></slot>
      </div>
    </div>
  </div>
</template>
