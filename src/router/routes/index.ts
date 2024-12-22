import type { AppRouteRecordRaw } from "types/router";
import Layout from "@/layout/index.vue";

export const constantRoutes: Array<AppRouteRecordRaw> = [
  /** 登录页 */
  {
    path: "/signIn",
    name: "SignIn",
    component: () => import("@/views/logIn/index.vue"),
  },
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Layout,
  //   // redirect: '/menu',
  // },
  // {
  //   path: "/rootChat",
  //   name: "RootChat",
  //   component: () => import("@/views/chat/layout/index.vue"),
  //   redirect: "/chat",
  //   children: [
  //     {
  //       path: "/chat/:uuid?",
  //       name: "Chat",
  //       component: () => import("@/views/chat/index.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "/:pathMatch(.*)",
  //   name: "NotFound",
  //   component: () => import("@/views/404.vue"),

  // },
];
