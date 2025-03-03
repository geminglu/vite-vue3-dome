import { request } from "@/utils/request";

/**
 * CreateDictionaryDto
 */
export interface CreateDictionaryDto {
  /**
   * 字典编码
   */
  code: string;
  /**
   * 字典名称
   */
  name: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态
   */
  status?: "0" | "1";
}
/**
 * CreateDictionaryDetailDto
 */
export interface CreateDictionaryDetailDto {
  /**
   * 字典名称
   */
  dictionaryCode: string;
  /**
   * 字典标签
   */
  fieldsText: string;
  /**
   * 字典值
   */
  fieldsValue: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态
   */
  sort?: number;
  /**
   * 状态
   */
  status?: "0" | "1";
}

/**
 * DictionaryListDto
 */
export interface DictionaryListDto {
  /**
   * 字典编码
   */
  code: string;
  /**
   * createAt
   */
  createAt: string;
  /**
   * id
   */
  id: number;
  /**
   * 字典名称
   */
  name: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 状态
   */
  status: "0" | "1";
}

/**
 * DictionaryDetailListDto
 */
export interface DictionaryDetailListDto {
  /**
   * createAt
   */
  createAt: string;
  /**
   * 字典名称
   */
  dictionaryCode: string;
  /**
   * 字典标签
   */
  fieldsText: string;
  /**
   * 字典值
   */
  fieldsValue: string;
  /**
   * id
   */
  id: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 状态
   */
  sort: number;
  /**
   * 状态
   */
  status: "0" | "1";
}

/**
 * PatchDictionaryDetailDto
 */
export interface PatchDictionaryDetailDto {
  /**
   * 字典标签
   */
  fieldsText?: string;
  /**
   * 字典值
   */
  fieldsValue?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态
   */
  sort?: number;
  /**
   * 状态
   */
  status?: "0" | "1";
}

/**
 * CreateDictionaryDetailDto
 */
export interface CreateDictionaryDetailDto {
  /**
   * 字典名称
   */
  dictionaryCode: string;
  /**
   * 字典标签
   */
  fieldsText: string;
  /**
   * 字典值
   */
  fieldsValue: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态
   */
  sort?: number;
  /**
   * 状态
   */
  status?: "0" | "1";
}

export type DictionaryDetailPage = {
  list: DictionaryDetailListDto[];
  total: number;
};

interface MenuMenu {
  type: "menu";
  path: string;
}
interface MenuDir {
  type: "dir";
  path: undefined;
}

export type SystemMenuListDto = {
  id: string;
  /**
   * 是否隐藏菜单
   */
  hidden: "0" | "1";
  /**
   * icon，如果创建目录icon必填
   */
  icon?: string;
  pid: string | null;
  /**
   * 状态，0:禁用；1:启用
   */
  status: string;
  /**
   * title
   */
  title: string;
  remark?: string;
  createAt: string;
} & (MenuMenu | MenuDir);

export type CreateSystemMenu = Omit<SystemMenuListDto, "id" | "createAt">;

/**
 * 创建字典
 */
export function createDictionary(data: CreateDictionaryDto) {
  return request<DictionaryListDto>({
    url: "/v1/system/dictionary",
    method: "post",
    data,
  });
}

/**
 * 修改字典
 */
export function patchDictionary(id: number, data: Partial<CreateDictionaryDto>) {
  return request<DictionaryListDto>({
    url: `/v1/system/dictionary/${id}`,
    method: "patch",
    data,
  });
}

/**
 * 删除字典
 */
export function deleteDictionary(id: number) {
  return request({
    url: `/v1/system/dictionary/${id}`,
    method: "delete",
  });
}

/**
 * 查询字典详情
 */
export function getDictionaryCodeInfo(code: string, param?: { [x: string]: any }) {
  return request<DictionaryDetailPage>({
    url: `/v1/system/dictionaryCodeDetails`,
    method: "get",
    params: { code, ...param },
  });
}

/**
 * 创建字典详情
 */
export function cerateDictionaryDetails(data: CreateDictionaryDetailDto) {
  return request<DictionaryListDto>({
    url: "/v1/system/dictionaryDetails",
    method: "post",
    data,
  });
}

/**
 * 修改字典详情
 */
export function patchDictionaryDetails(
  id: number,
  data: Omit<CreateDictionaryDetailDto, "dictionaryCode">,
) {
  return request<DictionaryListDto>({
    url: `/v1/system/dictionaryDetails/${id}`,
    method: "patch",
    data,
  });
}

/**
 * 删除字典详情
 */
export function deleteDictionaryDetail(id: number) {
  return request({
    url: `/v1/system/dictionaryDetails/${id}`,
    method: "delete",
  });
}

/**
 * 查询菜单列表
 */
export function getMenuList() {
  return request<SystemMenuListDto[]>({
    url: "/v1/system/menu",
    method: "get",
  });
}

/**
 * 创建系统菜单
 */
export function createSysMenu(data: CreateSystemMenu) {
  return request<SystemMenuListDto[]>({
    url: "/v1/system/menu",
    method: "post",
    data,
  });
}

/**
 * 修改系统菜单
 */
export function patchSysMenu(id: string, data: CreateSystemMenu) {
  return request<DictionaryListDto>({
    url: `/v1/system/menu/${id}`,
    method: "patch",
    data,
  });
}
/**
 * 删除系统菜单
 */
export function deleteSysMenu(id: string) {
  return request({
    url: `/v1/system/menu/${id}`,
    method: "delete",
  });
}

/**
 * 获取权限菜单
 */
export function getPermissionMenu() {
  return request<SystemMenuListDto[]>({
    url: "/v1/system/permissionMenu",
    method: "get",
  });
}
