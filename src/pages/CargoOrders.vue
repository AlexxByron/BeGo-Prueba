<template>
  <div class="orders-page">
    <!-- Tabs -->
    <div class="tabs">
      <button :class="{ active: currentTab === 'upcoming' }" @click="changeTab('upcoming')">Upcoming</button>
      <button :class="{ active: currentTab === 'completed' }" @click="changeTab('completed')">Completed</button>
      <button :class="{ active: currentTab === 'all' }" @click="changeTab('all')">All</button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Buscar pedidos..." />
    </div>

    <!-- Orders -->
    <div v-if="filteredOrders.length > 0" class="orders-list">
      <div v-for="order in filteredOrders" :key="order._id" class="order-card">
        <!-- Header -->
        <div class="order-header">
          <img :src="pickupIcon" alt="Truck" class="header-icon" />
          <strong>Order #{{ order.order_number }}</strong>
        </div>

        <!-- Status -->
        <div class="order-status">
          <span>{{ order.type }}</span>
          <span>{{ order.status_string }}</span>
        </div>

        <!-- Pickup and Dropoff -->
        <div class="order-body">
          <div class="pickup-info">
            <img :src="truckIcon" alt="Pickup" class="location-icon" />
            <div class="location-details">
              <p><strong>Pickup:</strong> {{ order.destinations[0]?.address || 'No disponible' }}</p>
              <p>{{ formatDate(order.destinations[0]?.start_date) }} {{ formatTime(order.destinations[0]?.start_date) }}
              </p>
            </div>
          </div>

          <div class="dropoff-info">
            <img :src="dropoffIcon" alt="Dropoff" class="location-icon marker" />
            <div class="location-details">
              <p><strong>Dropoff:</strong> {{ order.destinations[1]?.address || 'No disponible' }}</p>
              <p>{{ formatDate(order.destinations[1]?.end_date) }} {{ formatTime(order.destinations[1]?.end_date) }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="order-actions">
          <!-- ⏰ Temporizador antes de habilitar -->
          <div v-if="order.destinations?.[0]?.start_date && remainingTimes[order._id] > 0" class="pickup-timer">
            Start pickup in {{ formatRemainingTime(remainingTimes[order._id]) }}
          </div>

          <!-- Botón Resume -->
          <button :disabled="order.destinations?.[0]?.start_date && remainingTimes[order._id] > 0" class="resume-button"
            @click="navigate(order)">
            Resume
            <img :src="eyeIcon" alt="Eye" class="eye-icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <p>No hay pedidos disponibles.</p>
    </div>
  </div>
</template>


<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUpcomingOrders } from '../services/api';

// Importa íconos
import truckIcon from '@/assets/icons/trailer.png';
import pickupIcon from '@/assets/icons/camion-carga.png';
import dropoffIcon from '@/assets/icons/marcador.png';
import eyeIcon from '@/assets/icons/ojo1.png';

export default {
  setup() {
    const router = useRouter();
    const currentTab = ref('upcoming');
    const searchQuery = ref('');
    const allOrders = ref([]);
    const remainingTimes = ref({});

    const filteredOrders = computed(() => {
      let orders = [];

      if (currentTab.value === 'upcoming') {
        orders = allOrders.value.filter(order => order.status === 1);
      } else if (currentTab.value === 'completed') {
        orders = allOrders.value.filter(order => order.status === 3);
      } else if (currentTab.value === 'all') {
        orders = allOrders.value;
      }

      if (searchQuery.value.trim() !== '') {
        return orders.filter(order =>
          order.order_number?.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return orders;
    });

    // 🔥 Cada vez que cambie la pestaña, mostramos en consola
    watch(currentTab, (newTab) => {
      console.log(`🛫 Cambiaste a pestaña: ${newTab}`);
      console.log('📋 Pedidos filtrados:', filteredOrders.value);
    });

    const changeTab = (tab) => {
      currentTab.value = tab;
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'Fecha no disponible';
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-GB');
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const formatRemainingTime = (milliseconds) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const seconds = (totalSeconds % 60).toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    const updateRemainingTimes = () => {
      const now = Date.now();
      allOrders.value.forEach(order => {
        const start = order.destinations?.[0]?.start_date;
        if (start) {
          const startTime = new Date(start).getTime();
          const diff = startTime - now;
          remainingTimes.value[order._id] = diff > 0 ? diff : 0;
        } else {
          remainingTimes.value[order._id] = 0;
        }
      });
    };

    const navigate = (order) => {
      console.log('🚗 Navegando a detalle de orden:', order);
      router.push({ name: 'CargoDetail', params: { orderId: order._id } });
    };

    onMounted(async () => {
      try {
        const response = await getUpcomingOrders();
        allOrders.value = response.result || [];
        updateRemainingTimes();
        setInterval(updateRemainingTimes, 1000);

        // 🔥 Mostrar en consola inicialmente también
        console.log(`🛫 Pestaña inicial: ${currentTab.value}`);
        console.log('📋 Pedidos filtrados:', filteredOrders.value);

      } catch (error) {
        console.error('❌ Error cargando pedidos:', error);
      }
    });

    return {
      currentTab,
      searchQuery,
      allOrders,
      filteredOrders,
      remainingTimes,
      changeTab,
      formatDate,
      formatTime,
      formatRemainingTime,
      truckIcon,
      pickupIcon,
      dropoffIcon,
      eyeIcon,
      navigate
    };
  }
};
</script>


<style scoped>
.orders-page {
  padding: 20px;
  background-color: #111;
  min-height: 100vh;
  color: white;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  margin: 0 20px;
  font-size: 16px;
  position: relative;
  padding-bottom: 5px;
  cursor: pointer;
}

.tabs button.active {
  color: yellow;
}

.tabs button.active::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: yellow;
  position: absolute;
  bottom: 0;
  left: 0;
}

.search-bar {
  text-align: center;
  margin-bottom: 20px;
}

.search-bar input {
  width: 70%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.order-card {
  background: #222;
  padding: 20px;
  border-radius: 15px;
  width: 70%;
}

.order-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  margin-bottom: 10px;
}

.header-icon {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
}

.order-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-body {
  margin-bottom: 10px;
}

.pickup-info,
.dropoff-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.location-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  filter: brightness(0) invert(1);
}

.location-icon.marker {
  filter: none;
}

.location-details {
  display: flex;
  flex-direction: column;
}

.order-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}

.pickup-timer {
  font-weight: bold;
  color: yellow;
}

.resume-button {
  background-color: yellow;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.resume-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.eye-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.empty-state {
  text-align: center;
  margin-top: 50px;
}
</style>
