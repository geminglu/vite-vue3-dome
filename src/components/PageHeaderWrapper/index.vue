<template>
  <div class="page_header_wrapper">
    <div v-if="isShowBack || title" class="page-header">
      <div v-if="isShowBack" class="back" @click="navigation(backUrl)">
        <Icon icon="eva:arrow-back-outline" />
        <span class="pl-1">{{ backText }}</span>
      </div>
      <el-divider v-if="isShowBack" direction="vertical" />
      <h2 class="title" v-if="title">{{ title }}</h2>
    </div>
    <div class="con">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

defineOptions({
  name: "PageHeaderWrapper",
});

type Props = {
  title?: string;
  isShowBack?: boolean;
  backUrl?: string;
  backText?: string;
};
withDefaults(defineProps<Props>(), {
  isShowBack: false,
  backText: "返回",
});

const router = useRouter();

function navigation(path?: string) {
  path ? router.push(path) : router.back();
}
</script>

<style scoped lang="less">
.page_header_wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .page-header {
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 45px;
    .back {
      display: flex;
      align-items: center;
      line-height: 45px;
      cursor: pointer;
      vertical-align: middle;
      .icon {
        vertical-align: middle;
      }
    }
    .title {
      display: inline-block;
      line-height: 45px;
      margin: 0;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .con {
    padding: 12px;
  }
}
</style>
