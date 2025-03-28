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
</template>

<script setup lang="tsx">
import { reactive, ref, watch } from "vue";
import { ElTag, ElTree } from "element-plus";
import TableCom from "@/components/ui/TableCom/index.vue";
import PageHeaderWrapper from "@/components/PageHeaderWrapper/index.vue";
import useDataSet from "@/hooks/useDataSet";
import { headerButtonsType } from "@/hooks/useDataSet/type";
import { queryDeptList } from "@/serivce/system/index";
import Node from "element-plus/es/components/tree/src/model/node.mjs";
import { queryDept } from "@/serivce/system/type";

defineOptions({
  name: "UserList",
});

interface DeptTerr {
  deptName: string;
  id: number;
  children?: DeptTerr[];
}

const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

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

const filterNode = (value: string, data: DeptTerr[]) => {
  console.log("filterNode", value, data);
  return false;
};

const headerButtons: headerButtonsType[] = ["refresh"];
</script>
