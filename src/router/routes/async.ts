import type { AppRouteRecordRaw } from "@/types/router";
import Layout from "@/layout/index.vue";

export const asyncRoutes: Array<AppRouteRecordRaw> = [
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
      {
        path: "/dictionary-list",
        name: "DictionaryList",
        component: () => import("@/views/DictionaryList/index.vue"),
      },
      {
        path: "/dictionary-details/:code",
        name: "DictionaryDetails",
        component: () => import("@/views/DictionaryList/dictionaryDetails.vue"),
      },
      {
        path: "/system/system-menu",
        name: "SystemMenu",
        component: () => import("@/views/system/menu/index.vue"),
      },
      {
        path: "/system/system-dept",
        name: "SystemDept",
        component: () => import("@/views/system/dept/index.vue"),
      },
      {
        path: "/system/system-role",
        name: "SystemRole",
        component: () => import("@/views/system/role/index.vue"),
      },
    ],
  },
];
