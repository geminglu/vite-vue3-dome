<template>
  <el-container style="height: 100%">
    <el-aside width="200px" class="aside border-r">
      <Aside />
    </el-aside>

    <el-container>
      <el-header class="border-b">
        <Header />
      </el-header>
      <el-main class="app-main">
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Aside from "./Aside.vue";
import Header from "./Header.vue";
import Main from "./Main.vue";

defineOptions({
  name: "CommonLayout",
});
</script>

<style scoped lang="less">
.app-main {
  padding: 0;
}
</style>
