import { AxiosRequestConfig } from "axios";
import type { Ref } from "vue";
import { PartialOption, RequiredProps } from "@/types";
import type { useDataSetType } from ".";

export interface headerButtonsObj {
  name: string;
  icon: string;
  // eslint-disable-next-line no-use-before-define
  click: (dataSet: useDataSetType, param: { [index: string]: any }) => void;
}

export type CellEllipsisType =
  | {
      showTitle?: boolean;
    }
  | boolean;

export type headerButton = "refresh" | "dele";

export type headerButtonsType = headerButton | headerButtonsObj;
interface TransportType {
  read: AxiosRequestConfig | ((params: any) => AxiosRequestConfig);
}

interface FieldsTextType {
  type: "text";
}
interface FieldsDateType {
  type: "date";
  format?: string;
}
interface FieldsDatetimeType {
  type: "datetime";
  format?: string;
}
interface FieldsDateTimeType {
  type: "time";
  format?: string;
}
interface FieldsUplookType {
  type: "uplook";
  uplookField: string;
  uplookValue: any;
}

export type SortOrder = "asc" | "desc" | null;
export type Sort = {
  prop: string;
  order: SortOrder;
};

export type FieldsExtend =
  | FieldsTextType
  | FieldsDateType
  | FieldsDatetimeType
  | FieldsDateTimeType
  | FieldsUplookType;

export type FieldsType = {
  name: string;
  label: string;
  /** 隐藏列 */
  hidden?: boolean;
  sorter?: boolean;
  sortOrder?: SortOrder | { sortOrder: SortOrder; priority?: number };
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean;
  colSpan?: number;
  customRender?: (opt: {
    value: any;
    text: any;
    record: Record<string, any>;
    index: number;
    column: FieldsType;
  }) => JSX.Element;
  rowSpan?: number;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  /** 是否可拖动调整宽度，此时 width 必须是 number 类型 */
  resizable?: boolean;
  /** 列是否固定，可选 true(等效于 left) 'left' 'right' */
  fixed?: "left" | "right" | boolean;
  /** 超过宽度将自动省略 */
  ellipsis?: CellEllipsisType;
  /** 设置列的对齐方式 */
  align?: "left" | "center" | "right";
} & FieldsExtend;

export type QueryUplookType = {
  type: "uplook";
  code: string;
  /** 默认值：value */
  fieldValue?: string;
  /** 默认值：name */
  fielidText?: string;
  parma?: { [x: string]: any };
};
export type QueryTextType = {
  type: "text";
};
export type QueryDateType = {
  type: "date";
  /**
   * 日期组件显示在输入框中的格式
   */
  format?: string;
};
export type QueryDatetimeType = {
  type: "datetime";
  /**
   * 日期组件显示在输入框中的格式
   */
  format?: string;
};

export type QueryExtend = QueryUplookType | QueryTextType | QueryDateType | QueryDatetimeType;

export type QueryType = {
  name: string;
  label: string;
  defaultValue?: string;
  /** 是否必填 */
  required?: boolean;
} & QueryExtend;

export interface EventType {
  /**
   * 点击搜索表单重置时调用
   */
  reset: () => void;
  /**
   * 查询事件前，返回值为 false 将阻止查询
   * @description 如果返回 false 将停止查询，如果返回对象会覆盖查询参数，如果返回 undefined 不会影响查询逻辑
   */
  beforeQuery: (data: {
    dataSet: useDataSetType;
    params: { [index: string]: any };
  }) => { [index: string]: any } | boolean | void;
  /**
   * 响应拦截器
   * @description 需要返回一组数据
   */
  response: (res: any[]) => any[];
  /**
   * 数据加载完成后执行
   */
  // eslint-disable-next-line no-use-before-define
  onLoad: (dataSet: useDataSetType, data: any[]) => void;
}

export interface configType {
  queryform?: QueryType[];
  /** 开启自动查询，默认true */
  autoQuery?: boolean;
  /** transport 存在时queryUrl将无效 */
  queryUrl?: string;
  queryParameter?: { [index: string]: any };
  /** transport 存在时queryUrl将无效 */
  transport?: TransportType;
  fields: FieldsType[];
  /** 主键如果有嵌套需要使用 */
  primaryKey?: string;
  pageSizes?: number[];
  /** 分页大小,默认100 */
  pageSize?: number;
  /** 是否有分页 */
  paging?: boolean;
  /** 多选 */
  multiple?: boolean;

  /** 是否保留被选中的数据 */
  reserveSelection?: boolean;

  /**
   * 事件
   */
  events?: Partial<EventType>;
}

export interface DateSetType
  extends PartialOption<
    RequiredProps<Omit<configType, "events">>,
    "queryUrl" | "transport" | "primaryKey"
  > {
  /** 当前分页 */
  currentPage: number;
  disabled: boolean;
  butQuery: boolean;
  total: number;
  formQuery: { [index: string]: any };
  /** 选中的行数据 */
  multipleSelection: Ref<Array<any>>;
}
