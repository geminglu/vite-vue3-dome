<template>
  <template v-if="!item?.hidden">
    <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
      <template #title>
        <el-icon v-if="item.icon">
          <Icon :icon="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <SidebarItem v-for="router in item.children" :key="router.id" :item="router" />
    </el-sub-menu>
    <el-menu-item v-else :index="path.join('/', item.path || '')" router>
      <el-icon v-if="item.icon">
        <Icon :icon="item.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { systemMenuType } from "@/types/router";
import SidebarItem from "./sidebarItem.vue";
import path from "path-browserify";
import { Icon } from "@iconify/vue";
import { ElMenuItem } from "element-plus";

defineOptions({
  name: "SidebarItem",
});

interface PropsType {
  item: systemMenuType;
}

defineProps<PropsType>();
</script>

<style scoped lang="less"></style>
