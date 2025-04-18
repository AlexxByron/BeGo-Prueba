<template>
  <div class="cargo-details">
    <!-- Encabezado -->
    <div class="header">
      <button @click="goBack" class="back-button">←</button>
      <h2>Cargo Details</h2>
      <button class="notification-button">🔔</button>
    </div>

    <!-- Card de Orden -->
    <div class="order-card">
      <p class="reference">
        Referencia {{ orderData.reference_number || orderData.order_number || 'N/A' }}
      </p>
      <h3>Order #{{ orderData.order_number || 'N/A' }}</h3>

      <!-- Sección Pickup / Dropoff con switch -->
      <div class="location-section">
        <button @click="togglePickupDropoff" class="toggle-switch">
          {{ isPickup ? 'Ver Dropoff' : 'Ver Pickup' }}
        </button>

        <div class="pickup-dropoff">
          <img src="@/assets/icons/marcador.png" :alt="isPickup ? 'Pickup' : 'Dropoff'" class="icon marker" />
          <div>
            <strong>{{ isPickup ? 'Pickup' : 'Dropoff' }}</strong>
            <p>{{ currentDest.address || 'Dirección no disponible' }}</p>
            <span class="status" :class="isPickup ? 'accepted' : 'on-hold'">
              {{ isPickup ? 'Accepted' : 'On hold' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline de Seguimiento -->
    <div class="timeline">
      <img src="https://i.pravatar.cc/100?img=12" alt="Driver" class="driver-photo" />
      <div class="time">
        {{ formatTime(currentDest.start_date) || 'No disponible' }}
      </div>
      <div class="steps">
        <div v-for="(step, index) in steps" :key="index" class="step">
          <div :class="['circle', { 'active': currentStep >= step.id }]">
            <template v-if="currentStep >= step.id">✔</template>
          </div>
          <div v-if="index !== steps.length - 1" :class="['line', { 'active-line': currentStep > step.id }]"></div>
          <div :class="['step-text', { 'completed-text': currentStep >= step.id }]">
            {{ step.label }}
          </div>
        </div>
      </div>
      <button class="track-button" :disabled="!canTrack" @click="handleTrackOrder">
        Track Order
      </button>
    </div>

    <!-- Detalle Expandible -->
    <div class="pickup-data">
      <button class="accordion" @click="toggleDetails">
        {{ isPickup ? 'Pickup Data' : 'Dropoff Data' }}
        <span>{{ showDetails ? '▲' : '▼' }}</span>
      </button>
      <div v-if="showDetails" class="pickup-info">
        <p>
          {{ currentDest.address || 'Dirección no disponible' }}
        </p>
        <p v-if="currentDest.receiver_name">
          Receptor: {{ currentDest.receiver_name }}
        </p>
        <p v-if="currentDest.phone">
          Teléfono: {{ currentDest.phone }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUpcomingOrders } from '../services/api';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orderId = route.params.orderId;
    const orderData = ref({ destinations: [] });

    // 1. Estado para alternar Pickup / Dropoff
    const isPickup = ref(true);

    // 2. Computed para el destino activo
    const currentDest = computed(() => {
      const dests = orderData.value.destinations || [];
      return isPickup.value ? dests[0] || {} : dests[1] || {};
    });

    const showDetails = ref(false);
    const currentStep = ref(0);
    const canTrack = ref(false);

    const steps = [
      { id: 1, label: 'Created Order' },
      { id: 2, label: 'Accepted Order' },
      { id: 3, label: 'Pickup set up by William' },
      { id: 4, label: 'Pickup Completed' }
    ];

    const fetchOrder = async () => {
      try {
        const resp = await getUpcomingOrders();
        const found = (resp.result || []).find(o => o._id === orderId);
        if (found) {
          orderData.value = found;
          evaluateStatus(found.status);
        } else {
          console.error('Orden no encontrada');
        }
      } catch (e) {
        console.error('Error cargando orden:', e);
      }
    };

    const evaluateStatus = status => {
      if (status >= 4) {
        currentStep.value = 4;
        canTrack.value = true;
      } else if (status === 3) {
        currentStep.value = 3;
        canTrack.value = true;
      } else if (status === 2) {
        currentStep.value = 2;
        canTrack.value = false;
      } else {
        currentStep.value = 1;
        canTrack.value = false;
      }
    };

    const goBack = () => router.back();
    const togglePickupDropoff = () => (isPickup.value = !isPickup.value);
    const toggleDetails = () => (showDetails.value = !showDetails.value);
    const formatTime = ts => {
      if (!ts) return '';
      const d = new Date(ts);
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };
    const handleTrackOrder = () => {
      if (canTrack.value) console.log('Track Order');
    };

    onMounted(fetchOrder);

    return {
      orderData,
      isPickup,
      currentDest,
      showDetails,
      currentStep,
      canTrack,
      steps,
      goBack,
      togglePickupDropoff,
      toggleDetails,
      formatTime,
      handleTrackOrder
    };
  }
};
</script>

<style scoped>
.cargo-details {
  background: #111;
  min-height: 100vh;
  color: white;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button,
.notification-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
}

.order-card {
  background: #222;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
}

.reference {
  font-size: 14px;
  color: #ccc;
}

.location-section {
  margin-top: 10px;
}

.toggle-switch {
  background: none;
  border: 1px solid #ccc;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.pickup-dropoff {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  width: 24px;
  height: 24px;
}

.status {
  display: inline-block;
  font-size: 12px;
  margin-top: 5px;
}

.accepted {
  color: #0f0;
}

.on-hold {
  color: #999;
}

.timeline {
  background: #222;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.driver-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 0 auto 10px;
  object-fit: cover;
}

.time {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.steps {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #666;
  color: transparent;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 5px;
}

.circle.active {
  background: yellow;
  color: black;
  font-weight: bold;
}

.line {
  width: 2px;
  height: 40px;
  background: #666;
}

.line.active-line {
  background: yellow;
}

.step-text {
  font-size: 14px;
  color: gray;
  margin: 5px 0 15px;
}

.completed-text {
  color: yellow;
  font-weight: bold;
}

.track-button {
  background-color: yellow;
  color: black;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
}

.track-button:disabled {
  background-color: #555;
  color: #aaa;
  cursor: not-allowed;
}

.pickup-data {
  background: #222;
  border-radius: 15px;
  padding: 10px;
}

.accordion {
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 18px;
}

.pickup-info {
  margin-top: 10px;
  font-size: 14px;
  color: #ccc;
}
</style>
