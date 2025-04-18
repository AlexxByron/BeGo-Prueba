<template>
  <div class="order-card" @click="goToDetails">
    <div class="order-header">
      <div class="order-type">
        <span class="emoji">🚚</span>
        <span>{{ order.type }}</span>
      </div>
      <span class="order-status">{{ order.status }}</span>
    </div>

    <div class="order-info">
      <div class="pickup">
        <span class="emoji-small">📍</span>
        <div>
          <p class="location">{{ order.pickup.location }}</p>
          <p class="datetime">{{ order.pickup.date }} {{ order.pickup.time }}</p>
        </div>
      </div>

      <div class="dropoff">
        <span class="emoji-small">🏁</span>
        <div>
          <p class="location">{{ order.dropoff.location }}</p>
          <p class="datetime">{{ order.dropoff.date }} {{ order.dropoff.time }}</p>
        </div>
      </div>
    </div>

    <div class="order-footer">
      <button class="pickup-btn">It's time for pickup</button>
      <button class="resume-btn">
        <span class="emoji-small">👁️</span>
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'OrderCard',
  props: {
    order: Object
  },
  setup(props) {
    const router = useRouter();
    const goToDetails = () => {
      router.push(`/orders/${props.order.id}`);
    };
    return { goToDetails };
  }
}
</script>

<style scoped>
.order-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.order-status {
  font-size: 14px;
  color: #00b0ff;
}

.order-info {
  border-top: 1px solid #2c2c2c;
  margin-top: 10px;
  padding-top: 10px;
}

.pickup,
.dropoff {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.emoji {
  font-size: 24px;
}

.emoji-small {
  font-size: 18px;
}

.location {
  font-weight: bold;
}

.datetime {
  font-size: 12px;
  color: #aaaaaa;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.pickup-btn {
  flex: 1;
  margin-right: 10px;
  background-color: #ffd700;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  color: #000;
}

.resume-btn {
  background-color: #ffd700;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
