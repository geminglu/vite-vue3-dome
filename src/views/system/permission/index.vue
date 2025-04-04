<template>
  <PageHeaderWrapper title="权限管理">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="菜单权限" name="menuPermission"><MenuPermission /></el-tab-pane>
    </el-tabs>
  </PageHeaderWrapper>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import MenuPermission from "./components/MenuPermission.vue";

defineOptions({
  name: "permissionManage",
});

const activeName = ref("menuPermission");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>

<style scoped lang="less">
.role {
}
</style>
