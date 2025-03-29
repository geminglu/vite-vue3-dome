import { useDataSetType } from "@/hooks/useDataSet";
import { headerButtonsType } from "@/hooks/useDataSet/type";
import { TreeNode } from "element-plus";

export interface PropsType {
  dateSet: useDataSetType;
  headerButtons?: headerButtonsType[];
  border?: boolean;
  size?: "large" | "default" | "small";
  pagingLayout?: string;
  tableHeight?: string | number;
  /** 是否懒加载子节点数据 */
  lazy?: boolean;
  /** 加载子节点数据的函数，lazy 为 true 时生效 */
  load?: () => (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void;
  /** 渲染嵌套数据的配置选项 */
  treeProps?: { hasChildren?: string; children?: string; checkStrictly?: boolean };
  /** 设置表格单元、行和列的布局方式 */
  tableLayout?: "fixed" | "auto";
}

