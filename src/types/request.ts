/** 接口返回数据格式 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ResultType<T = any> {
  /** 状态 */
  success: boolean;
  /** 数据 */
  data?: T;
  /** 接口信息 */
  message?: string;
}
