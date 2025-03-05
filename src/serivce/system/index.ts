import { request } from "@/utils/request";
import { CreateDeptVo, DeptDtoInfo, queryDept } from "./type";
import { PagingResultType } from "@/types/request";

/**
 * 添加部门
 */
export function createDeptDto(data: CreateDeptVo) {
  return request<DeptDtoInfo>({
    url: "/v1/system/dept",
    method: "post",
    data,
  });
}

/**
 * 更新部门
 */
export function updateDeptDto(id: number, data: CreateDeptVo) {
  return request<DeptDtoInfo>({
    url: `/v1/system/dept/${id}`,
    method: "PATCH",
    data,
  });
}

/**
 * 查询部门列表
 */
export function queryDeptList(params?: queryDept) {
  return request<PagingResultType<DeptDtoInfo>>({
    url: `/v1/system/dept`,
    params,
  });
}

/**
 * 删除部门
 */
export function deleteDept(id: number) {
  return request({
    url: `/v1/system/dept/${id}`,
    method: "delete",
  });
}
