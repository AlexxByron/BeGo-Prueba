<template>
    <div class="search-bar">
      <input type="text" v-model="search" @input="$emit('update:search', search)" placeholder="Search Orders..." />
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    props: {
      modelValue: String
    },
    data() {
      return {
        search: this.modelValue
      }
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    margin: 16px 0;
  }
  input {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: none;
  }
  </style>
  