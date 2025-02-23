import { asyncRoutes } from "@/router/routes/async";
import type { AppRouteRecordRaw } from "@/types/router";

export const constantRoutes: Array<AppRouteRecordRaw> = [
  /** 登录页 */
  {
    path: "/signIn",
    name: "SignIn",
    component: () => import("@/views/logIn/index.vue"),
  },
  ...asyncRoutes,
];
