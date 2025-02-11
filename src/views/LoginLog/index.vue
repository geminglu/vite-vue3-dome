<template>
  <PageHeaderWrapper title="用户列表">
    <TableCom
      :dateSet="dateSet"
      :headerButtons="headerButtons"
      tableHeight="calc(100vh - 210px)"
    />
  </PageHeaderWrapper>
</template>

<script setup lang="tsx">
import TableCom from "@/components/ui/TableCom/index.vue";
import PageHeaderWrapper from "@/components/PageHeaderWrapper/index.vue";
import useDataSet from "@/hooks/useDataSet";
import { headerButtonsType } from "@/hooks/useDataSet/type";

defineOptions({
  name: "LoginLog",
});

const dateSet = useDataSet({
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
