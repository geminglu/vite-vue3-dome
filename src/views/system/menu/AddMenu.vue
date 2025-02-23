<template>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules">
    <el-form-item label="菜单类型" prop="type">
      <el-radio-group v-model="form.type">
        <el-radio-button value="dir" label="目录" />
        <el-radio-button value="menu" label="菜单" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="上级目录" prop="pid">
      <el-select v-model="form.pid" placeholder="请选择目录">
        <el-option v-for="item in dirList" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="title" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>
    <el-form-item v-if="form.type === 'menu'" label="path" prop="path">
      <el-autocomplete
        style="width: 100%"
        v-model="form.path"
        placeholder="请输入路由地址"
        :fetch-suggestions="querySearch"
        @select="handleSelect"
      >
        <template #default="{ item }">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span>{{ item.path }}</span>
            <el-icon
              v-if="existRoute.find(route => route.path === item.path)"
              style="color: var(--el-color-success)"
              >
              <CircleCheck />
            </el-icon>
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
    <el-form-item label="icon" prop="icon">
      <el-input v-model="form.icon" />
    </el-form-item>
    <el-form-item label="是否隐藏" prop="hidden">
      <el-radio-group v-model="form.hidden">
        <el-radio value="1">显示</el-radio>
        <el-radio value="0">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio value="1">启用</el-radio>
        <el-radio value="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { asyncRoutes } from "@/router/routes/async";
import { getMenuList, SystemMenuListDto } from "@/serivce/system";
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, onBeforeMount, computed } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { CircleCheck } from "@element-plus/icons-vue";

defineOptions({
  name: "AddMenu",
});

interface PropsType {
  data?: Partial<SystemMenuListDto>;
}

type useSystemMenuListDto = Omit<SystemMenuListDto, "id" | "createAt">;

const props = defineProps<PropsType>();

const dirList = reactive<{ title: string; id: string }[]>([{ title: "根目录", id: "/" }]);
const existRoute = reactive<SystemMenuListDto[]>([]);

const { remark, status, hidden, icon, path, pid, title, type } = props.data || {};

const form = reactive<useSystemMenuListDto>({
  remark: remark || "",
  status: status || "1",
  hidden: hidden || "1",
  icon: icon || "",
  path: path || "",
  pid: pid || "/",
  title: title || "",
  type: type || "menu",
});

const formRef = ref<FormInstance>();

const rules: FormRules<useSystemMenuListDto> = {
  hidden: [{ required: true, message: "请选择隐藏状态", trigger: "blur" }],
  title: [{ required: true, message: "请输入菜单标题", trigger: "blur" }],
  pid: [{ required: true, trigger: "blur" }],
  path: [{ required: true, trigger: "blur" }],
};

const routes = computed(() =>
  createRouter({
    routes: asyncRoutes as RouteRecordRaw[],
    history: createWebHistory(),
  }).getRoutes(),
);

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? routes.value.filter(route => route.path.includes(queryString))
    : routes.value;

  cb(results);
};
const handleSelect = (item: Record<string, any>) => {
  form.path = item.path;
};

async function submit() {
  await formRef.value?.validate();

  return {
    ...form,
    pid: form.pid === "/" ? null : form.pid,
  };
}

onBeforeMount(() => {
  getMenuList().then(res => {
    dirList.push(...(res.data?.filter(item => item.type === "dir") || []));
    existRoute.length = 0;
    existRoute.push(...(res.data || []));
  });
});
defineExpose({
  submit,
});
</script>

<style scoped lang="less"></style>
