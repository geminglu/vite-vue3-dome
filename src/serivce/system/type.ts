export interface Data {
  list: DeptDtoInfo[];
  total: number;
}

/**
 * DeptDtoInfo
 */
export interface DeptDtoInfo {
  /**
   * 创建时间
   */
  createAt: string;
  /**
   * 创建者
   */
  createBy?: string;
  /**
   * 创建者姓名
   */
  createByName?: string;
  /**
   * 部门名称
   */
  deptName: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 部门ID
   */
  id: number;
  /**
   * 负责人
   */
  leader?: number;
  /**
   * 部门主管姓名
   */
  leaderName?: string;
  /**
   * 显示顺序
   */
  orderNum?: number;
  /**
   * 父部门id
   */
  parentId?: number;
  /**
   * 父部门名称
   */
  parentName?: string;
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 部门状态（0正常 1停用）
   */
  status: StatusEnum;
  /**
   * 更新者
   */
  updateBy?: Date;
  /**
   * 更新者姓名
   */
  updateByName?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
}

/**
 * 部门状态（0正常 1停用）
 */
export enum StatusEnum {
  ENABLE = "0",
  DISABLE = "1",
}

export type CreateDeptVo = Omit<
  DeptDtoInfo,
  | "updateTime"
  | "updateByName"
  | "updateBy"
  | "leaderName"
  | "id"
  | "createByName"
  | "createAt"
  | "parentName"
  | "createBy"
>;

export type queryDept = Partial<
  Pick<DeptDtoInfo, "parentId" | "deptName" | "leader" | "remark" | "status" | "phone" | "email">
> & {
  lazy?: "0" | "1";
  createTimeStart?: string;
  createTimeEnd?: string;
  updateTimeStart?: string;
  updateTimeEnd?: string;
};

/**
 * CreateRoleDto
 */
export interface CreateRoleDto {
  /**
   * 角色名称
   */
  name: string;
  /**
   * 备注
   */
  remark?: string;

  menuPermissions?: string[];
}

/**
 * RoleInfoDto
 */
export interface RoleInfoDto extends CreateRoleDto {
  /**
   * 创建时间
   */
  createAt: string;
  /**
   * 角色Id
   */
  id: number;
  /**
   * 创建时间
   */
  updateTime: string;
}

export type UpdateRoleDto = CreateRoleDto;

export interface QueryDeptDto {
  /**
   * 角色名称
   */
  name?: string;
  /**
   * 页码
   */
  page: number;
  /**
   * 分页大小
   */
  pageSize: number;
  /**
   * 排序
   */
  sort?: string;
  [property: string]: any;
}
