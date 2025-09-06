<template>
  <footer
    :id="'footer-bar'"
    :class="['bg-secondary', 'sticky', 'bottom-0', 'z-30']"
  >
    <div :class="['flex']">
      <div :class="['flex-0', 'text-left', 'pl-4']">
        <a
          href="https://github.com/Kylep342/debtonate"
          target="_blank"
        >source</a>
        <br>
      </div>
      <div :class="['flex-1', 'text-right', 'pr-4']">
        <a
          href="https://forms.gle/5hdgxA4jKGQA5U8J9"
          target="_blank"
        >report a bug</a>
        <br>
      </div>
    </div>
  </footer>
</template>
