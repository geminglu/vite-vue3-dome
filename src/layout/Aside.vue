<template>
  <el-scrollbar>
    <SidebarMenu />
  </el-scrollbar>
</template>

<script setup lang="ts">
import SidebarMenu from "@/layout/components/sidebar/index.vue";

defineOptions({
  name: "CustomAside",
});
</script>

<style scoped lang="less">
.aside {
}
.el-menu {
  border-right: none;
}
</style>
