import { asyncRoutes } from "@/router/routes/async";
import type { AppRouteRecordRaw } from "@/types/router";

export const constantRoutes: Array<AppRouteRecordRaw> = [
  /** 登录页 */
  {
    path: "/signIn",
    name: "SignIn",
    component: () => import("@/views/logIn/index.vue"),
  },
  {
    path: "/403",
    name: "NoPermission",
    component: () => import("@/views/error/NoPermission.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    name: "NotFound",
    component: () => import("@/views/error/NotFound.vue"),
  },
  ...asyncRoutes,
];
