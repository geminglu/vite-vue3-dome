<template>
  <PageHeaderWrapper title="系统菜单">
    <TableCom :dateSet="dateSet" :headerButtons="headerButtons" tableHeight="calc(100vh - 210px)" />
  </PageHeaderWrapper>
  <el-drawer
    v-model="addDrawer"
    :title="addDrawerData?.id ? '编辑菜单' : '添加菜单'"
    destroy-on-close
    :before-close="handleClose"
    @closed="addDrawerData = undefined"
  >
    <AddMenu ref="addMenuRef" :data="addDrawerData" />
    <template #footer>
      <div style="flex: auto">
        <el-button @click="() => handleClose(handleCloseaddDrawer)">取消</el-button>
        <el-button type="primary" @click="handleDictionary" :loading="addDrawerLoading">
          保存
        </el-button>
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
import { useRouter } from "vue-router";
const router = useRouter();
import AddMenu from "./AddMenu.vue";
import {
  createSysMenu,
  CreateSystemMenu,
  deleteSysMenu,
  patchSysMenu,
  SystemMenuListDto,
} from "@/serivce/system";
import { arrayToTree } from "@/utils";
import { Icon } from "@iconify/vue/dist/iconify.js";

defineOptions({
  name: "SystemMenu",
});

const addDrawer = ref(false);
const addDrawerLoading = ref(false);
const addMenuRef = ref();
const addDrawerData = ref<Partial<SystemMenuListDto> | undefined>();

const dateSet = useDataSet({
  autoQuery: true,
  queryUrl: "/v1/system/menu",
  primaryKey: "id",
  paging: false,
  events: {
    response: data => {
      return arrayToTree(data);
    },
  },
  fields: [
    {
      label: "菜单名称",
      name: "title",
      type: "text",
      minWidth: 200,
    },
    {
      label: "url",
      name: "path",
      type: "text",
      minWidth: 200,
    },
    {
      label: "icon",
      name: "icon",
      width: 100,
      type: "text",
      customRender: ({ value }) => {
        return <Icon icon={value} />;
      },
    },
    {
      label: "状态",
      name: "status",
      width: 100,
      type: "text",
      customRender: ({ value }) => {
        return value === "1" ? (
          <ElTag type="primary">启用</ElTag>
        ) : (
          <ElTag type="danger">禁用</ElTag>
        );
      },
    },
    {
      label: "是否隐藏",
      name: "hidden",
      type: "text",
      minWidth: 100,
      customRender: ({ value }) => {
        return value === "1" ? <ElTag type="success">显示</ElTag> : <ElTag type="info">隐藏</ElTag>;
      },
    },
    {
      label: "类型",
      name: "type",
      type: "text",
      customRender: ({ value }) => {
        return value === "dir" ? (
          <ElTag type="primary">目录</ElTag>
        ) : (
          <ElTag type="success">菜单</ElTag>
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
            {record.type === "dir" && (
              <>
                <ElLink
                  type="primary"
                  underline={false}
                  onClick={() => {
                    addDrawerData.value = { pid: record.id } as SystemMenuListDto;
                    addDrawer.value = true;
                  }}
                >
                  添加
                </ElLink>
                <ElDivider direction="vertical" />
              </>
            )}

            <ElLink
              type="primary"
              underline={false}
              onClick={() => {
                addDrawerData.value = record as SystemMenuListDto;
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

async function handleDeleteDrawer(id: string) {
  await deleteSysMenu(id);
  dateSet.query();
  ElMessage({
    showClose: true,
    message: "删除成功",
    type: "success",
  });
}

async function handleDictionary() {
  try {
    addDrawerLoading.value = true;
    const data = await addMenuRef.value?.submit();

    if (addDrawerData.value?.id) {
      await patchSysMenu(addDrawerData.value.id, data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });
    } else {
      await createSysMenu(data);
      ElMessage({
        showClose: true,
        message: "添加成功",
        type: "success",
      });
    }
    dateSet.query();
    addDrawer.value = false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
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
