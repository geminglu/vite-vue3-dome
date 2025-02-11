<template>
  <PageHeaderWrapper :title="`字典列表-${route.params.code}`" isShowBack>
    <TableCom
      :dateSet="dateSet"
      :headerButtons="headerButtons"
      tableHeight="calc(100vh - 210px)"
    />
  </PageHeaderWrapper>
  <el-drawer
    v-model="addDrawer"
    :title="addDrawerData ? '编辑字典' : '添加字典'"
    destroy-on-close
    :before-close="handleClose"
    @closed="addDrawerData = undefined"
  >
    <AddDictionaryDetails ref="addDictionaryRef" :data="addDrawerData" />
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
import TableCom from "@/components/ui/TableCom/index.vue";
import PageHeaderWrapper from "@/components/PageHeaderWrapper/index.vue";
import { ElMessageBox, ElTag, ElButton, ElPopconfirm, ElMessage } from "element-plus";
import { ref } from "vue";
import AddDictionaryDetails from "./AddDictionaryDetails.vue";
import {
  cerateDictionaryDetails,
  CreateDictionaryDetailDto,
  deleteDictionaryDetail,
  DictionaryDetailListDto,
  patchDictionaryDetails,
} from "@/serivce/system";
import { useRoute } from "vue-router";
import { headerButtonsType } from "@/hooks/useDataSet/type";
import useDataSet from "@/hooks/useDataSet";

defineOptions({
  name: "DictionaryList",
});
const route = useRoute();
const addDrawer = ref(false);
const addDrawerLoading = ref(false);
const addDictionaryRef = ref<typeof AddDictionaryDetails>();

const addDrawerData = ref<CreateDictionaryDetailDto & { id: number }>();

const dateSet = useDataSet({
  autoQuery: true,
  queryUrl: "/v1/system/dictionaryAllDetails",
  queryParameter: {
    code: route.params.code,
  },
  primaryKey: "id",
  queryform: [
    {
      name: "fieldsText",
      type: "text",
      label: "字典标签",
    },
    {
      name: "fieldsValue",
      type: "text",
      label: "字典值",
    },
    {
      name: "status",
      type: "uplook",
      label: "状态",
      code: "STATUS",
      parma: {},
    },
  ],
  fields: [
    { label: "字典标签", name: "fieldsText", type: "text" },
    {
      label: "字典值",
      name: "fieldsValue",
      type: "text",
    },
    {
      label: "状态",
      name: "status",
      type: "text",
      render: (row: any) => {
        return row.status === "1" ? (
          <ElTag type="primary">启用</ElTag>
        ) : (
          <ElTag type="danger">禁用</ElTag>
        );
      },
    },
    { label: "排序", name: "sort", type: "text" },
    { label: "备注", name: "remark", type: "text" },
    { label: "创建时间", name: "createAt", type: "datetime" },
    {
      label: "操作",
      type: "text",
      name: "operation",
      fixed: "right",
      render: (param: DictionaryDetailListDto) => {
        return (
          <span>
            <ElButton
              link
              type="primary"
              onClick={() => {
                addDrawerData.value = param;
                addDrawer.value = true;
              }}
            >
              编辑
            </ElButton>
            <el-divider direction="vertical" />
            <ElPopconfirm
              title="删除后无法恢复是否继续？"
              onConfirm={() => handleDeleteDrawer(param.id)}
            >
              {{
                reference: () => (
                  <ElButton link type="danger">
                    删除
                  </ElButton>
                ),
              }}
            </ElPopconfirm>
          </span>
        );
      },
    },
  ],
});

async function handleDeleteDrawer(id: number) {
  await deleteDictionaryDetail(id);
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
    const data = await addDictionaryRef.value?.submit();
    if (addDrawerData.value?.id) {
      await patchDictionaryDetails(addDrawerData.value.id, data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });
    } else {
      await cerateDictionaryDetails({ ...data, dictionaryCode: route.params.code });
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

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("尚未报错确定要关闭吗？", "提示")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const handleCloseaddDrawer = () => {
  addDrawer.value = false;
};

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
</script>
