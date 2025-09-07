import { createRouter, createWebHistory } from 'vue-router';

import DebtonateView from '@/apps/debtonate/DebtonateView.vue';
import AppreciateView from '@/apps/appreciate/AppreciateView.vue';
import paths from '@/apps/shared/constants/routes';

const routes = [
  { path: paths.ROUTE_DEBTONATE, component: DebtonateView },
  { path: paths.ROUTE_APPRECIATE, component: AppreciateView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
