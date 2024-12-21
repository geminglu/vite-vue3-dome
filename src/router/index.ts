import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { constantRoutes } from './routes';
import routerGuard from './routerGuard';

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes as unknown as RouteRecordRaw[],
});

// 路由守卫
routerGuard(router);

export default router;
