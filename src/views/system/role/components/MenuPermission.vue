<template>
  <div>
    <div class="flex flex-wrap">
      <el-checkbox v-model="isExpandAll" label="展开/折叠" />
      <el-checkbox v-model="isSelectAll" label="全选/全不选" :onchange="handleSelectAll" />
      <el-checkbox v-model="isLinkage" label="父子联动" />
    </div>
    <el-tree
      ref="treeRef"
      show-checkbox
      @check="handleCheck"
      :data="menuList"
      :props="treeProps"
      node-key="id"
      default-expand-all
      :check-strictly="!isLinkage"
    />
  </div>
</template>

<script setup lang="ts">
import { getMenuList, SystemMenuListDto } from "@/serivce/system";
import { arrayToTree } from "@/utils";
import { nextTick, reactive, ref, watch } from "vue";
import { ElTree, TreeInstance } from "element-plus";

defineOptions({
  name: "MenuPermission",
});

interface PropsType {
  menuPermissions?: string[];
  onChange?: (value: string[]) => void;
}

const props = withDefaults(defineProps<PropsType>(), {
  menuPermissions: () => [],
});

const treeProps = {
  label: "title",
  children: "children",
};
const treeRef = ref<TreeInstance>();
const menuList = reactive<SystemMenuListDto[]>([]);
const checkedNodeId = reactive<string[]>([]);
const treeIds = ref<string[]>([]);
const isExpandAll = ref(true);
const isSelectAll = ref(false);
const isLinkage = ref(false);
const checked = reactive<string[]>([]);
const menuPermission = reactive<SystemMenuListDto[]>([]);

getMenuList().then(res => {
  checked.push(...props.menuPermissions);
  treeIds.value = (res.data || []).map(item => item.id);
  menuList.length = 0;
  const results = arrayToTree(res.data || []) || [];
  menuList.push(...results);
  menuPermission.length = 0;
  menuPermission.push(...(res.data || []));

  nextTick(() => {
    treeRef.value?.setCheckedKeys(props.menuPermissions, true);
    isLinkage.value = true;

    checkedNodeId.length = 0;
    checkedNodeId.push(...props.menuPermissions);
  });
});

const handleCheck = (checkedNodes: SystemMenuListDto, checkedInfo) => {
  const checkedKeyss = checkedInfo.checkedKeys;
  const halfCheckedKeys = checkedInfo.halfCheckedKeys;

  checkedNodeId.length = 0;
  checkedNodeId.push(...[...checkedKeyss, ...halfCheckedKeys]);
};

const handleSelectAll = () => {
  if (isSelectAll.value) {
    treeRef.value?.setCheckedKeys(menuPermission.map(item => item.id));
    checkedNodeId.length = 0;
    checkedNodeId.push(...treeIds.value);
  } else {
    treeRef.value?.setCheckedNodes([]);
    checkedNodeId.length = 0;
  }
};

watch(isExpandAll, val => {
  let nodes = treeRef.value?.store._getAllNodes();

  if (val) {
    nodes?.forEach(item => {
      item.expanded = true;
    });
  } else {
    nodes?.forEach(item => {
      item.expanded = false;
    });
  }
});

watch(checkedNodeId, val => {
  props?.onChange && props.onChange(val);
  if (menuPermission.every(e => val.includes(e.id))) {
    isSelectAll.value = true;
  } else {
    isSelectAll.value = false;
  }
});

function submit() {
  return checkedNodeId;
}
defineExpose({
  submit,
});
</script>
