declare module "path-browserify";

export type RequiredProps<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * 将接口的部分属性转为可选
 */
export type PartialOption<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
