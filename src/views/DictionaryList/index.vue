<template>
  <PageHeaderWrapper title="字典列表">
    <TableCom :dateSet="dateSet" :headerButtons="headerButtons" tableHeight="calc(100vh - 210px)" />
  </PageHeaderWrapper>
  <el-drawer
    v-model="addDrawer"
    :title="addDrawerData ? '编辑字典' : '添加字典'"
    destroy-on-close
    :before-close="handleClose"
    @closed="addDrawerData = undefined"
  >
    <AddDictionary ref="addDictionaryRef" :data="addDrawerData" />
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
import AddDictionary from "./AddDictionary.vue";
import {
  createDictionary,
  CreateDictionaryDto,
  deleteDictionary,
  patchDictionary,
} from "@/serivce/system";
import { RequiredProps } from "@/types";
import { useRouter } from "vue-router";
import useDataSet from "@/hooks/useDataSet";
import type { headerButtonsType } from "@/hooks/useDataSet/type";

defineOptions({
  name: "DictionaryList",
});

const router = useRouter();
const addDrawer = ref(false);
const addDrawerLoading = ref(false);
const addDictionaryRef = ref<typeof AddDictionary>();

const addDrawerData = ref<RequiredProps<CreateDictionaryDto> & { id: number }>();

const dateSet = useDataSet({
  autoQuery: true,
  queryUrl: "/v1/system/dictionary",
  primaryKey: "id",
  queryform: [
    {
      name: "name",
      type: "text",
      label: "字段名称",
    },
    {
      name: "code",
      type: "text",
      label: "字段编码",
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
    {
      label: "字段名称",
      name: "name",
      type: "text",
      width: 200,
      sorter: true,
      // defaultSortOrder: "descend",
    },
    {
      label: "字段编码",
      width: 100,
      name: "code",
      type: "text",
      sorter: true,
      customRender: ({ value }) => {
        return (
          <span>
            <ElLink type="primary" onClick={() => router.push(`/dictionary-details/${value}`)}>
              {value}
            </ElLink>
          </span>
        );
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
    { label: "备注", name: "remark", type: "text", width: 200 },
    { label: "创建时间", name: "createAt", type: "datetime", width: 400 },
    {
      label: "操作",
      type: "text",
      name: "operation",
      width: 200,
      customRender: ({ record }) => {
        return (
          <span>
            <ElLink
              type="primary"
              underline={false}
              onClick={() => {
                addDrawerData.value = record;
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

async function handleDeleteDrawer(id: number) {
  await deleteDictionary(id);
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
      await patchDictionary(addDrawerData.value.id, data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });
    } else {
      await createDictionary(data);
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
