<template>
  <el-menu :default-active="activeMenu" unique-opened router class="menu">
    <SidebarItem v-for="router in systemMenu" :key="router.id" :item="router" />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SidebarItem from "./sidebarItem.vue";
import { useRoute } from "vue-router";
import { systemMenuType } from "@/types/router";

defineOptions({
  name: "SidebarMenu",
});

const route = useRoute();

/**
 * 当前激活的路由
 */
const activeMenu = computed<string>(() => (route.path as string) || "");

const systemMenu = computed(() => {
  let menu: systemMenuType[] = [
    {
      id: "1",
      hidden: false,
      icon: "fa6-solid:user-gear",
      title: "用户管理",
      pid: null,
      type: "directory",
      name: "用户管理",
      path: "/",
      children: [
        {
          id: "11",
          hidden: false,
          icon: "heroicons:users-16-solid",
          title: "用户列表",
          pid: "1",
          type: "menu",
          name: "用户列表",
          path: "/user-list",
        },
        {
          id: "12",
          hidden: false,
          icon: "material-symbols-light:tv-signin-rounded",
          title: "登录日志",
          pid: "1",
          type: "menu",
          name: "登录日志",
          path: "/login-log",
        },
      ],
    },
    {
      id: "2",
      hidden: false,
      icon: "icon-park-outline:system",
      title: "系统管理",
      pid: null,
      type: "directory",
      name: "系统管理",
      path: "/system",
      children: [
        {
          id: "21",
          hidden: false,
          icon: "codicon:symbol-enum",
          title: "字典管理",
          pid: "2",
          type: "menu",
          name: "字典管理",
          path: "/dictionary-list",
        },
        {
          id: "22",
          hidden: false,
          icon: "codicon:symbol-enum",
          title: "系统菜单",
          pid: "2",
          type: "menu",
          name: "系统菜单",
          path: "/system/system-menu",
        },
      ],
    },
  ];

  return menu;
});
</script>

<style lang="less" scoped></style>
