import { defineStore } from "pinia";
import {
  getPublicKey,
  login,
  loginDto,
  queryUserInfo,
  verifyToekn,
  refreshToken,
} from "@/serivce/user";
import { encrypt } from "@/utils/encrypt";

export interface userInfoType {
  /**
   * 头像
   */
  avatars?: string;
  /**
   * 创建时间
   */
  createAt?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 性别，1：男；0：女
   */
  gender?: "1" | "0" | "";
  /**
   * 1：启用；0：禁用
   */
  isActive: "1" | "0";
  /**
   * 用户名，用户姓名在2-10之间
   */
  name?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 角色，0：管理员：1：普通用户
   */
  role?: "1" | "0";
  id: string;
  deptId?: number | null;
  deptName?: string;
  remark?: string;
}

export interface userType {
  /** access_token */
  access_token: string;
  /** refresh_token */
  refresh_token: string;
  /** 公钥 */
  publicKey?: string;
  userInfo: userInfoType | null;
}

const useUserStore = defineStore("userStore", {
  state: (): userType => ({
    access_token: "",
    refresh_token: "",
    publicKey: "",
    userInfo: null,
  }),
  persist: true,
  actions: {
    /**
     * 设置token
     * @param value
     */
    setToken(accessToken = "", refreshToken = "") {
      this.access_token = accessToken;
      this.refresh_token = refreshToken;
    },

    /**
     * 获取公钥
     */
    async genPublicKey() {
      // 获取公钥
      const publicKey = await getPublicKey();
      this.publicKey = publicKey.data;
      return publicKey.data;
    },

    /**
     * 登陆
     */
    async longIn(data: loginDto) {
      // 加密
      const pasEncrypted = await encrypt(data.password);
      const accountEncrypted = await encrypt(data.account);

      const param = {
        account: accountEncrypted || "",
        password: pasEncrypted || "",
        captchaCode: data.captchaCode,
        captchaId: data.captchaId,
      };
      const result = await login(param);
      this.setToken(result.data?.access_token, result.data?.refresh_token);

      // 登陆成功后获取用户信息
      this.getUserInfo();
      return result;
    },

    /**
     * 获取用户详情
     */
    async getUserInfo() {
      const result = await queryUserInfo();
      this.userInfo = result.data || null;
    },

    /**
     *  退出登陆
     */
    logout() {
      // 清除用户信息
      this.setToken();
      this.userInfo = null;

      // 重置动态路由
      // usePermissioStore().removeRouter();
    },

    /**
     * 刷新token
     */
    async refreshToken() {
      if (!this.refresh_token) throw new Error();
      const result = await refreshToken(this.refresh_token);
      this.setToken(result.data?.access_token, result.data?.refresh_token);
      // 登陆成功后获取用户信息
      this.getUserInfo();
      return result;
    },

    /**
     * 验证token有效性
     */
    async verifyAccessToekn() {
      // 验证token是否有效，有效需要刷新token无效需要退出登陆
      if (!this.access_token) return;
      const verifyRes = await verifyToekn(this.access_token);

      if (verifyRes?.data) {
        await this.refreshToken();
      } else {
        this.logout();
      }
    },
  },
});

export default useUserStore;
