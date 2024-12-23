<template>
  <PageHeaderWrapper title="用户列表">
    <BaseTable
      :dateSet="dateSet"
      :headerButtons="headerButtons"
      tableHeight="calc(100vh - 210px)"
    />
  </PageHeaderWrapper>
</template>

<script setup lang="tsx">
import BaseTable from "@/components/baseUi/Table/index.vue";
import { DataSet } from "@/components/DataSet";
import { headerButtonsType } from "@/components/DataSet/type";
import PageHeaderWrapper from "@/components/PageHeaderWrapper/index.vue";
import { ElTag } from "element-plus";

defineOptions({
  name: "UserList",
});

const dateSet = new DataSet({
  autoQuery: true,
  queryUrl: "/v1/user",
  primaryKey: "id",
  fields: [
    { label: "用户名", name: "name", type: "text" },
    { label: "邮箱", name: "email", type: "text" },
    { label: "手机号", name: "phone", type: "text" },
    {
      label: "状态",
      name: "isActive",
      type: "text",
      render: (row: any) => {
        return row.isActive === "1" ? (
          <ElTag type="primary">启用</ElTag>
        ) : (
          <ElTag type="danger">禁用</ElTag>
        );
      },
    },
    { label: "创建时间", name: "createAt", type: "datetime" },
  ],
  paging: true,
});

const headerButtons: headerButtonsType[] = ["refresh"];
</script>
