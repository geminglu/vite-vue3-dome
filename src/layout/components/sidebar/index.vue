<template>
  <el-menu :default-active="activeMenu" unique-opened router class="menu">
    <SidebarItem v-for="router in systemMenu" :key="router.id" :item="router" />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SidebarItem from "./sidebarItem.vue";
import { useRoute } from "vue-router";
import useAppStore from "@/store/modules/app";

defineOptions({
  name: "SidebarMenu",
});

const route = useRoute();
const appStore = useAppStore();

/**
 * 当前激活的路由
 */
const activeMenu = computed<string>(() => (route.path as string) || "");

const systemMenu = computed(() => {
  return appStore.menu;
});
</script>

<style lang="less" scoped></style>
