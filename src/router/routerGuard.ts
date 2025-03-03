import { type Router } from "vue-router";
import NProgress from "@/utils/nprogress";
import useAppStore from "@/store/modules/app";
import NoPermission from "@/views/error/NoPermission.vue";
export default function routerGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const appStore = useAppStore();
    const asyncRouterMatcherFlat = appStore.getAsyncRouterMatcherFlat();

    // 如果访问的页面是权限路由需要先获取菜单在验证权限
    if (asyncRouterMatcherFlat.some(matcher => matcher.parse && matcher.parse(to.path))) {
      if (!appStore.menu.length) {
        await appStore.setMenu();
      }

      if (
        !asyncRouterMatcherFlat
          .filter(
            matcher =>
              matcher.parse &&
              appStore.menuFlat.filter(f => f.type === "menu").some(m => matcher.parse(m.path)),
          )
          .some(m => m.parse(to.path))
      ) {
        to.matched[to.matched.length - 1].components!.default = NoPermission;
      }
    }

    // 设置路由缓存

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
