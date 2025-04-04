import { request } from "@/utils/request";
import { PagingResultType } from "@/types/request";
import { CreateRoleDto, QueryDeptDto, RoleInfoDto } from "./type";

export function createRole(data: CreateRoleDto) {
  return request<RoleInfoDto>({
    url: "/v1/system/role",
    method: "post",
    data,
  });
}

export function queryRoleList(data: QueryDeptDto) {
  return request<PagingResultType<RoleInfoDto>>({
    url: "/v1/system/role",
    method: "get",
    params: data,
  });
}

export function detailRole(id: number) {
  return request<RoleInfoDto>({
    url: `/v1/system/role/${id}`,
    method: "get",
  });
}

export function deleteRole(id: number) {
  return request({
    url: `/v1/system/role/${id}`,
    method: "DELETE",
  });
}

export function updateRole(id: number, data: Partial<CreateRoleDto>) {
  return request({
    url: `/v1/system/role/${id}`,
    method: "PATCH",
    data,
  });
}
