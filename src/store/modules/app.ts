import { defineStore } from "pinia";
export interface appType {
  /**
   * 被缓存起来的路由组件
   */
  keepAlives: string[];
}

const { themeColor, themeColorName } = JSON.parse(localStorage.getItem("appStore") || "{}");

const useAppStore = defineStore("appStore", {
  state: (): appType => ({
    keepAlives: [],
  }),
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
  },
});

export default useAppStore;
