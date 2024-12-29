declare module "path-browserify";

export type RequiredProps<T> = {
  [P in keyof T]-?: T[P];
};
