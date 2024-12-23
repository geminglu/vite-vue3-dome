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

defineOptions({
  name: "LoginLog",
});

const dateSet = new DataSet({
  autoQuery: true,
  queryUrl: "/v1/user/getLoginLogs",
  primaryKey: "id",
  fields: [
    { label: "用户名", name: "userName", type: "text" },
    { label: "登录地址", name: "location", type: "text" },
    { label: "登录地址", name: "loginIp", type: "text" },
    { label: "登录时间", name: "loginTime", type: "datetime" },
    { label: "登录设备", name: "deviceInfo", type: "text" },
  ],
  paging: true,
});

const headerButtons: headerButtonsType[] = ["refresh"];
</script>
