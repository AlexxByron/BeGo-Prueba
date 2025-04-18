<template>
    <div class="tabs">
      <button v-for="tab in tabs" 
              :key="tab" 
              @click="$emit('change-tab', tab)" 
              :class="{ active: activeTab === tab }">
        {{ tab }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TabSwitcher',
    props: {
      tabs: Array,
      activeTab: String,
    }
  };
  </script>
  
  <style scoped>
  .tabs {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  button.active {
    border-bottom: 2px solid yellow;
  }
  </style>
  