<template>
  <div class="flex">
    <div class="p-2 border-r border-r-neutral-200 overscroll-contain scroll-auto">
      <el-input v-model="filterText" class="mb-2" placeholder="Filter keyword" />
      <el-tree
        ref="treeRef"
        style="min-width: 200px"
        :data="deptTerr"
        :expand-on-click-node="false"
        :props="defaultProps"
        :current-node-key="currentNodeKey"
        :default-expanded-keys="[0]"
        highlight-current
        node-key="id"
        @node-click="handleNodeClick"
        :load="loadNode"
        lazy
      />
    </div>

    <div class="flex-1 overscroll-contain">
      <PageHeaderWrapper title="用户列表">
        <TableCom
          :dateSet="dateSet"
          :headerButtons="headerButtons"
          tableHeight="calc(100vh - 260px)"
        />
      </PageHeaderWrapper>
    </div>
  </div>
  <el-drawer
    v-model="addDrawer"
    :title="addDrawerData?.id ? '编辑用户' : '添加用户'"
    destroy-on-close
    :before-close="handleClose"
    @closed="addDrawerData = undefined"
  >
    <AddUser ref="addUserRef" :data="addDrawerData" />
    <template #footer>
      <div style="flex: auto">
        <el-button @click="() => handleClose(handleCloseaddDrawer)">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="addDrawerLoading"> 保存 </el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog v-model="dialogVisible" width="500">
    <div class="mx-4">
      <div class="flex justify-center">
        <Icon icon="iconoir:check-circle-solid" class="text-8xl text-lime-500" />
      </div>
      <el-descriptions title="User Info" :column="1">
        <el-descriptions-item label="姓名">{{ createSuccessData?.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ createSuccessData?.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱地址">{{ createSuccessData?.email }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          <span v-if="createSuccessData?.gender === '0'" class="text-fuchsia-600">♀︎</span>
          <span v-else-if="createSuccessData?.gender === '1'" class="text-blue-600">♂︎</span>
          <span v-else class="text-neutral-600">?</span>
        </el-descriptions-item>
        <el-descriptions-item label="所在部门">
          {{ createSuccessData?.deptName }}
        </el-descriptions-item>
        <el-descriptions-item label="密码"
          >{{ createSuccessData?.password }}

          <CopyButton :text="createSuccessData?.password || ''" class="text-7xl"></CopyButton>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ createSuccessData?.remark }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script setup lang="tsx">
import { reactive, ref, watch } from "vue";
import {
  ElDivider,
  ElLink,
  ElPopconfirm,
  ElTag,
  ElTree,
  ElMessage,
  ElMessageBox,
} from "element-plus";
import TableCom from "@/components/ui/TableCom/index.vue";
import PageHeaderWrapper from "@/components/PageHeaderWrapper/index.vue";
import useDataSet from "@/hooks/useDataSet";
import { headerButtonsType } from "@/hooks/useDataSet/type";
import { queryDeptList } from "@/serivce/system/index";
import Node from "element-plus/es/components/tree/src/model/node.mjs";
import { queryDept } from "@/serivce/system/type";
import {
  ceratedUser,
  createdUser,
  createdUserSuccess,
  deleteUser,
  updateUser,
} from "@/serivce/user";
import AddUser from "./AddUser.vue";
import { userInfoType } from "@/store/modules/user";
import { Icon } from "@iconify/vue";
import CopyButton from "@/components/ui/CopyButton/index.vue";

defineOptions({
  name: "UserList",
});

interface DeptTerr {
  deptName: string;
  id: number;
  children?: DeptTerr[];
}

const addUserRef = ref();
const addDrawer = ref(false);
const addDrawerData = ref<userInfoType & ceratedUser>();
const addDrawerLoading = ref(false);
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const dialogVisible = ref(false);
const createSuccessData = ref<createdUserSuccess>();

const deptTerr = reactive<DeptTerr[]>([
  {
    children: [],
    deptName: "巨神公司",
    id: 0,
  },
]);

const defaultProps = {
  children: "children",
  label: "deptName",
};

const currentNodeKey = ref<number | undefined>(undefined);
watch(
  () => currentNodeKey.value,
  () => {
    dateSet.config.currentPage = 1;
    dateSet.config.queryParameter = {
      ...dateSet.config.queryParameter,
      deptId: currentNodeKey.value,
    };
    dateSet.query();
  },
);

watch(filterText, val => {
  getDeptList({ deptName: val }).then(res => {
    treeRef.value!.updateKeyChildren("0", res);
  });
});

const handleNodeClick = (data: DeptTerr) => {
  currentNodeKey.value = data.id;
};
const dateSet = useDataSet({
  autoQuery: false,
  queryUrl: "/v1/user",
  primaryKey: "id",
  queryform: [
    { name: "name", type: "text", label: "用户名" },
    { name: "gender", type: "uplook", label: "性别", code: "GENDER" },
    { name: "isActive", type: "uplook", label: "状态", code: "STATUS" },
    { label: "邮箱", name: "email", type: "text" },
    { label: "手机号", name: "phone", type: "text" },
  ],
  fields: [
    { label: "用户名", name: "name", type: "text", sortOrder: null, minWidth: 150 },
    { label: "邮箱", name: "email", type: "text", minWidth: 150 },
    { label: "手机号", name: "phone", type: "text", minWidth: 100 },
    {
      label: "性别",
      name: "gender",
      type: "text",
      minWidth: 100,
      customRender: ({ value }) => {
        return (
          <span class="text-base">
            {value === "0" ? (
              <span class="text-fuchsia-600">♀︎</span>
            ) : value === "1" ? (
              <span class="text-blue-600">♂︎</span>
            ) : (
              ""
            )}
          </span>
        );
      },
    },
    { label: "所在部门", name: "deptName", type: "text", minWidth: 150 },
    {
      label: "状态",
      name: "isActive",
      type: "text",
      minWidth: 100,
      customRender: ({ value }) => {
        return value === "1" ? (
          <ElTag type="primary">启用</ElTag>
        ) : (
          <ElTag type="danger">禁用</ElTag>
        );
      },
    },
    {
      label: "创建时间",
      name: "createAt",
      minWidth: 150,
      type: "datetime",
      sortOrder: null,
    },
    {
      label: "操作",
      type: "text",
      name: "operation",
      width: 200,
      fixed: "right",
      customRender: ({ record }) => {
        return (
          <span>
            <ElLink
              type="primary"
              underline={false}
              onClick={() => {
                {
                  addDrawerData.value = record as userInfoType & ceratedUser;
                  addDrawer.value = true;
                }
              }}
            >
              编辑
            </ElLink>
            <ElDivider direction="vertical" />
            <ElPopconfirm
              title="删除后无法恢复是否继续？"
              onConfirm={async () => {
                await deleteUser(record.id);
                dateSet.query();
                ElMessage.success("删除成功");
              }}
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
  paging: true,
  events: {
    beforeQuery({ params }) {
      params.deptId === 0 && (params.deptId = null);
      return params;
    },
  },
});

const getDeptList = async (params?: queryDept) => {
  const result = await queryDeptList({
    lazy: "0",
    ...params,
  });
  return result.data?.list || [];
};

const loadNode = async (node: Node, resolve: (data: DeptTerr[]) => void, reject: () => void) => {
  if (node.level === 0) {
    let tree: DeptTerr = {
      children: [],
      deptName: "巨神公司",
      id: 0,
    };
    currentNodeKey.value = tree.id;
    try {
      const result = await getDeptList();
      tree.children = result;
      return resolve([tree]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return reject();
    }
  }

  if (node.data.children && node.data.children.length) {
    return resolve(node.data.children);
  } else {
    try {
      const result = await getDeptList({ parentId: node.data.id });
      return resolve(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return reject();
    }
  }
};
async function handleSave() {
  try {
    addDrawerLoading.value = true;
    const data = await addUserRef.value?.submit();

    if (addDrawerData.value?.id) {
      await updateUser(addDrawerData.value.id, data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });
    } else {
      const result = await createdUser(data);
      ElMessage({
        showClose: true,
        message: "添加成功",
        type: "success",
      });
      createSuccessData.value = result.data;
      dialogVisible.value = true;
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
