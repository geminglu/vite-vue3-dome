import type { Router } from "vue-router";
import NProgress from "@/utils/nprogress";
import useAppStore from "@/store/modules/app";
export default function routerGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // 设置路由缓存
    const appStore = useAppStore();

    // 自动缓存配置
    if (from.meta?.keepAlive instanceof Array && to.name) {
      if (from.meta.keepAlive.includes(to.name as string)) {
        appStore.setkeepAlives(from.name as string);
      } else {
        appStore.delkeepAlives(from.name as string);
      }
    } else if (typeof from.meta?.keepAlive === "boolean" && from.meta?.keepAlive) {
      appStore.setkeepAlives(from.name as string);
    } else if (typeof from.meta?.keepAlive === "boolean" && !from.meta?.keepAlive) {
      appStore.delkeepAlives(from.name as string);
    }

    if (to.meta?.keepAlive instanceof Array) {
      if (!to.meta?.keepAlive.includes(from.name as string)) {
        appStore.delkeepAlives(to.name as string);
      }
    }

    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
