// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import CargoOrders from "../pages/CargoOrders.vue";
import CargoDetails from "../pages/CargoDetails.vue";

const routes = [
  { path: "/", redirect: "/orders" },
  { path: "/orders", component: CargoOrders },
  {
    path: "/orders/:orderId",
    name: "CargoDetail",
    component: CargoDetails,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
