<template>
    <div class="timeline">
      <div v-for="(step, index) in steps" :key="index" class="timeline-step">
        <div :class="{'active': step.active}"></div>
        <p>{{ step.label }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrderTimeline',
    props: {
      steps: Array
    }
  };
  </script>
  
  <style scoped>
  .timeline {
    display: flex;
    flex-direction: column;
  }
  .timeline-step {
    margin-bottom: 16px;
  }
  .timeline-step .active {
    background: yellow;
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
  </style>
  