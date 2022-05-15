<template>
  <form>
    <label>Name:</label>
    <input type="text" required/>
  </form>
</template>

<script>
export default {
  data() {
    return {
      name: "",
    };
  }
};
</script>

<style>
form {
  max-width: 420p;
  margin: 30px auto;
  background: #fff;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
label {
  color: #aaa;
  display: inline-block;
  margin: 25 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
</style>
