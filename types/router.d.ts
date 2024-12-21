import type { RouteRecordRaw, RouteRecordName } from "vue-router";

export {};

export type KeepAlive = boolean | string[];

export type Meta = {
  /** 菜单标题 */
  title?: string;
  /** 菜单icon */
  icon?: string;
  /**
   * + 路由组件缓存
   * + 设置为true组件将被永久缓存设置为false组件将不被缓存；
   * + 设置一个list白名单，进入白名单页面组件将被缓存，并从白名单页面返回缓存也不会被清掉；
   * + 使用keepAlive自动缓存路由配置的name属性必须与组件名称相同否则缓存无效；
   * @example
   * ```ts
   * {
   *   path: 'directive',
   *   component: () => import('@/views/permission/directive.vue'),
   *   name: 'DirectivePermission',
   *   meta: { title: 'Directive Permission', keepAlive: ['RolePermission'] },
   * },
   * {
   *   path: 'role',
   *   component: () => import('@/views/permission/role.vue'),
   *   name: 'RolePermission',
   *   meta: { title: 'Role Permission', keepAlive: true },
   * },
   * ```
   */
  keepAlive?: KeepAlive;
};

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, "meta"> {
  children?: AppRouteRecordRaw[];
  meta?: Meta;
  /**
   * 如果使用`keepAlive`自动设置缓存那么name就必须与对应的组件名称相同，否则无效
   */
  name?: RouteRecordName;
}

export type systemMenuType = {
  id: string;
  /**
   * 是否在菜单中隐藏
   */
  hidden: boolean;
  /**
   * icon
   */
  icon: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 父级
   */
  pid: string | null;
  /**
   * 类型，menu：菜单；directory：目录
   */
  type: "menu" | "directory";
  /**
   * 需要匹配的路由名称
   */
  name: string;
  children?: systemMenuType[];
  path?: string;
};

declare module "vue-router" {
  type RouteMeta = Meta
}
