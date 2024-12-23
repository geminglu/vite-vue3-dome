<template>
  <router-view />
</template>

<script setup lang="ts">
defineOptions({
  name: "MainComponent",
});
</script>

<style scoped lang="less">
.app-main {
  display: flex;
  padding: 0;
}
</style>
