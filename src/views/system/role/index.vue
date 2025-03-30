<template>
  <PageHeaderWrapper title="角色管理">
    <TableCom :dateSet="dateSet" :headerButtons="headerButtons" tableHeight="calc(100vh - 210px)" />
  </PageHeaderWrapper>
  <el-drawer
    v-model="addDrawer"
    :title="addDrawerData?.id ? '编辑角色' : '添加角色'"
    destroy-on-close
    :before-close="handleClose"
    @closed="addDrawerData = undefined"
  >
    <AddRole ref="addDeptRef" :data="addDrawerData" />
    <template #footer>
      <div style="flex: auto">
        <el-button @click="() => handleClose(handleCloseaddDrawer)">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="addDrawerLoading"> 保存 </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="tsx">
import useDataSet from "@/hooks/useDataSet";
import type { headerButtonsType } from "@/hooks/useDataSet/type";
import PageHeaderWrapper from "@/components/PageHeaderWrapper/index.vue";
import { ElMessageBox, ElButton, ElPopconfirm, ElMessage, ElLink, ElDivider } from "element-plus";
import { ref } from "vue";
import AddRole from "./AddRole.vue";
import { createRole, deleteRole, updateRole } from "@/serivce/system/role";
import { RoleInfoDto } from "@/serivce/system/type";

defineOptions({
  name: "SystemRole",
});

const addDrawer = ref(false);
const addDrawerLoading = ref(false);
const addDeptRef = ref();
const addDrawerData = ref<RoleInfoDto | undefined>();
const dateSet = useDataSet({
  autoQuery: true,
  queryUrl: "/v1/system/role",
  primaryKey: "id",
  paging: true,
  queryform: [{ label: "角色名称", name: "name", type: "text" }],
  fields: [
    { label: "角色名称", name: "name", type: "text", minWidth: 200 },
    { label: "创建时间", name: "createAt", type: "datetime", minWidth: 200 },
    { label: "修改时间", name: "updateTime", type: "datetime", minWidth: 200 },
    { label: "备注", name: "remark", type: "text", width: 200 },
    {
      label: "操作",
      type: "text",
      name: "operation",
      fixed: "right",
      width: 200,
      customRender: ({ record }) => {
        return (
          <span>
            <ElLink
              type="primary"
              underline={false}
              onClick={() => {
                addDrawerData.value = record as RoleInfoDto;
                addDrawer.value = true;
              }}
            >
              编辑
            </ElLink>
            <ElDivider direction="vertical" />
            <ElPopconfirm
              title="删除后无法恢复是否继续？"
              onConfirm={() => handleDeleteDrawer(record.id)}
            >
              {{
                reference: (
                  <ElLink type="danger" underline={false}>
                    删除
                  </ElLink>
                ),
              }}
            </ElPopconfirm>
          </span>
        );
      },
    },
  ],
});

const headerButtons: headerButtonsType[] = [
  "refresh",
  {
    name: "新增",
    icon: "material-symbols:add-rounded",
    click: () => {
      addDrawer.value = true;
    },
  },
];

async function handleDeleteDrawer(id: number) {
  await deleteRole(id);
  dateSet.query();
  ElMessage({
    showClose: true,
    message: "删除成功",
    type: "success",
  });
}

async function handleSave() {
  try {
    addDrawerLoading.value = true;
    const data = await addDeptRef.value?.submit();

    if (addDrawerData.value?.id) {
      await updateRole(addDrawerData.value.id, data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });
    } else {
      await createRole(data);
      ElMessage({
        showClose: true,
        message: "添加成功",
        type: "success",
      });
    }
    dateSet.query();
    addDrawer.value = false;
  } finally {
    addDrawerLoading.value = false;
  }
}

const handleCloseaddDrawer = () => {
  addDrawer.value = false;
};

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("尚未报错确定要关闭吗？", "提示")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style scoped lang="less">
.systemMenu {
}
</style>
