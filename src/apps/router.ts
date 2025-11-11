import { createRouter, createWebHistory, type Router } from 'vue-router';

import AppreciateView from '@/apps/appreciate/AppreciateView.vue';
import DebtonateView from '@/apps/debtonate/DebtonateView.vue';
import paths from '@/apps/shared/constants/routes';

const routes = [
  { path: paths.ROUTE_APPRECIATE, component: AppreciateView }, // /appreciate
  { path: paths.ROUTE_DEBTONATE, component: DebtonateView }, // / (root)
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
