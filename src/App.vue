<script>
import LoanForm from "@/components/loanForm/LoanForm.vue";

export default {
  name: "App",
  components: { LoanForm },
};
</script>

<template>
  <LoanForm />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  margin: 0;
  background: #eee;
}
</style>
