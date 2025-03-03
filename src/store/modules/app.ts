import { asyncRoutes } from "@/router/routes/async";
import { getPermissionMenu, SystemMenuListDto } from "@/serivce/system";
import { defineStore } from "pinia";
import {
  createRouter,
  createRouterMatcher,
  createWebHistory,
  RouteRecord,
  RouteRecordRaw,
} from "vue-router";
import { arrayToTree } from "@/utils";
import { systemMenuType } from "@/types/router";

export type LanguageType = "zh-CN" | "zh-TW" | "en-US" | "ko-KR" | "ru-RU";

export interface appType {
  /** 菜单是否展开，fasle:折叠；true:展开  */
  menuCollapse: boolean;
  /** 移动端菜单显示，fasle:隐藏；true:显示  */
  mobileCollapse: boolean;

  /**
   * 二级菜单是否显示，fasle:折叠；true:展开
   * @description 只有当layoutTheme为'mix'是二级菜单才会生效
   */
  secondaryMenuCollapse: boolean;

  /**
   * 被缓存起来的路由组件
   */
  keepAlives: string[];
  /** 主题色 */
  themeColor: string;
  /** 主题色名称 */
  themeColorName: string;
  language: LanguageType;
  /** 聊天面板展开与折叠 */
  siderCollapsed: boolean;
  /** 设备 */
  device: "mobile" | "desktop";
  /** 菜单布局 */
  layoutTheme: "vertical" | "horizontal" | "mix";
  asyncRouterFlat: RouteRecord[];
  asyncRouterMatcherFlat: any[];
  menu: systemMenuType[];
  menuFlat: SystemMenuListDto[];
}

const { themeColor, themeColorName } = JSON.parse(localStorage.getItem("appStore") || "{}");

const useAppStore = defineStore("appStore", {
  state: (): appType => ({
    menuCollapse: true,
    siderCollapsed: true,
    keepAlives: [],
    themeColor: themeColor || "#1b2a47",
    themeColorName: themeColorName || "default",
    language: "zh-CN",
    device: "desktop",
    mobileCollapse: false,
    layoutTheme: "vertical",
    secondaryMenuCollapse: true,
    asyncRouterFlat: [],
    menu: [],
    menuFlat: [],
    asyncRouterMatcherFlat: [],
  }),
  persist: {
    omit: ["asyncRouterFlat", "menu"],
  },
  actions: {
    /**
     * 设置缓存
     */
    setkeepAlives(value: string) {
      if (!this.keepAlives.includes(value)) {
        this.keepAlives.push(value);
      }
    },

    /**
     * 删除缓存
     */
    delkeepAlives(value: string) {
      if (this.keepAlives.includes(value)) {
        this.keepAlives.splice(this.keepAlives.indexOf(value), 1);
      }
    },

    /**
     * 设置主题
     */
    setColorChange(themeColor: string, themeColorName?: string) {
      this.themeColor = themeColor;
      this.themeColorName = themeColorName || "custom";
    },

    setLanguage(language: LanguageType) {
      if (this.language !== language) {
        this.language = language;
      }
    },

    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed;
    },

    /**
     * 设置二级菜单显示隐藏
     */
    setSecondaryMenuCollapse(status: boolean) {
      this.secondaryMenuCollapse = status;
    },

    getAsyncRouterFlat() {
      if (!this.asyncRouterFlat.length) {
        const router = createRouter({
          history: createWebHistory(),
          routes: asyncRoutes as unknown as RouteRecordRaw[],
        }).getRoutes();
        this.asyncRouterFlat = router;
      }
      return this.asyncRouterFlat;
    },

    getAsyncRouterMatcherFlat() {
      if (!this.asyncRouterMatcherFlat.length) {
        const router = createRouterMatcher(
          asyncRoutes as unknown as RouteRecordRaw[],
          {},
        ).getRoutes();
        this.asyncRouterMatcherFlat = router;
      }
      return this.asyncRouterMatcherFlat;
    },

    /**
     * 设置系统菜单
     */
    async setMenu() {
      const result = await getPermissionMenu();
      this.menu = arrayToTree<systemMenuType>(result.data || []);
      this.menuFlat = result.data || [];
      return this.menu;
    },
  },
});

export default useAppStore;
