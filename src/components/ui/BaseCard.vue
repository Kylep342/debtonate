<template>
  <div :class="['card', 'w-96', 'bg-base-100', 'shadow-xl']">
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
