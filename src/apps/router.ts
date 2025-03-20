import { createRouter, createWebHistory } from "vue-router";

import DebtonateView from "@/apps/debtonate/DebtonateView.vue";
import AppreciateView from "@/apps/appreciate/AppreciateView.vue";

const routes = [
  { path: "/", component: DebtonateView },
  { path: "/appreciate", component: AppreciateView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
