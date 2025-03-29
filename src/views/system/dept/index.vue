<template>
  <PageHeaderWrapper title="部门管理">
    <TableCom
      :dateSet="dateSet"
      :headerButtons="headerButtons"
      tableHeight="calc(100vh - 210px)"
      lazy
      :border="true"
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'id' }"
    />
  </PageHeaderWrapper>
  <el-drawer
    v-model="addDrawer"
    :title="addDrawerData?.id ? '编辑部门' : '添加部门'"
    destroy-on-close
    :before-close="handleClose"
    @closed="addDrawerData = undefined"
  >
    <AddDept ref="addDeptRef" :data="addDrawerData" />
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
import {
  ElMessageBox,
  ElTag,
  ElButton,
  ElPopconfirm,
  ElMessage,
  ElLink,
  ElDivider,
} from "element-plus";
import { ref } from "vue";
import AddDept from "./AddDept.vue";
import { arrayToTree } from "@/utils";
import { DeptDtoInfo } from "@/serivce/system/type";
import { createDeptDto, deleteDept, queryDeptList, updateDeptDto } from "@/serivce/system/index";

defineOptions({
  name: "SystemDept",
});

const addDrawer = ref(false);
const addDrawerLoading = ref(false);
const addDeptRef = ref();
const addDrawerData = ref<DeptDtoInfo | undefined>();
const dateSet = useDataSet({
  autoQuery: true,
  queryUrl: "/v1/system/dept",
  primaryKey: "id",
  paging: false,
  queryParameter: {
    lazy: 0,
  },
  events: {
    response: data => {
      return arrayToTree(data.map(item => ({ ...item, pid: item.parentId })));
    },
  },
  fields: [
    { label: "部门名称", name: "deptName", type: "text", minWidth: 200 },
    { label: "邮箱", name: "email", type: "text", minWidth: 200 },
    { label: "电话", name: "phone", type: "text", minWidth: 150 },
    { label: "部门主管", name: "leaderName", type: "text", minWidth: 150 },
    { label: "创建人", name: "createByName", type: "text", minWidth: 150 },
    { label: "修改人", name: "updateByName", type: "text", minWidth: 150 },
    {
      label: "状态",
      name: "status",
      width: 100,
      type: "text",
      customRender: ({ value }) => {
        return value === "0" ? (
          <ElTag type="primary">启用</ElTag>
        ) : (
          <ElTag type="danger">禁用</ElTag>
        );
      },
    },
    { label: "创建时间", name: "createAt", type: "datetime", minWidth: 200 },
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
                addDrawerData.value = { parentId: record.id } as DeptDtoInfo;
                addDrawer.value = true;
              }}
            >
              添加
            </ElLink>
            <ElDivider direction="vertical" />

            <ElLink
              type="primary"
              underline={false}
              onClick={() => {
                addDrawerData.value = record as DeptDtoInfo;
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
  await deleteDept(id);
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
      await updateDeptDto(addDrawerData.value.id, data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });
    } else {
      await createDeptDto(data);
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

const load = async (row: any, treeNode: any, resolve: (data: any[]) => void) => {
  const results = (await queryDeptList({ parentId: row.id, lazy: "0" })).data?.list;
  resolve(results || []);
};
</script>

<style scoped lang="less">
.systemMenu {
}
</style>
