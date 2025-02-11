<template>
  <PageHeaderWrapper title="用户列表">
    <TableCom :dateSet="dateSet" :headerButtons="headerButtons" tableHeight="calc(100vh - 210px)" />
  </PageHeaderWrapper>
</template>

<script setup lang="tsx">
import TableCom from "@/components/ui/TableCom/index.vue";
import PageHeaderWrapper from "@/components/PageHeaderWrapper/index.vue";
import { ElTag } from "element-plus";
import useDataSet from "@/hooks/useDataSet";
import { headerButtonsType } from "@/hooks/useDataSet/type";

defineOptions({
  name: "UserList",
});

const dateSet = useDataSet({
  autoQuery: true,
  queryUrl: "/v1/user",
  primaryKey: "id",
  queryform: [{ name: "name", type: "text", label: "用户名" }],
  fields: [
    { label: "用户名", name: "name", type: "text", sortOrder: null },
    { label: "邮箱", name: "email", type: "text" },
    { label: "手机号", name: "phone", type: "text" },
    {
      label: "状态",
      name: "isActive",
      type: "text",
      customRender: ({ value }) => {
        return value === "1" ? (
          <ElTag type="primary">启用</ElTag>
        ) : (
          <ElTag type="danger">禁用</ElTag>
        );
      },
    },
    { label: "创建时间", name: "createAt", type: "datetime", sortOrder: null },
  ],
  paging: true,
});

const headerButtons: headerButtonsType[] = ["refresh"];
</script>
