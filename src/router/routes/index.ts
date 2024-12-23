import type { AppRouteRecordRaw } from "@/types/router";
import Layout from "@/layout/index.vue";

export const constantRoutes: Array<AppRouteRecordRaw> = [
  /** 登录页 */
  {
    path: "/signIn",
    name: "SignIn",
    component: () => import("@/views/logIn/index.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/user-list",
    children: [
      {
        path: "/user-list",
        name: "UserList",
        component: () => import("@/views/UserList/index.vue"),
      },
      {
        path: "/login-log",
        name: "LoginLog",
        component: () => import("@/views/LoginLog/index.vue"),
      },
    ],
  },
];
