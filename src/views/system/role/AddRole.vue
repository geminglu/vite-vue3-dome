<template>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" scroll-to-error>
    <el-form-item label="部门名称" prop="角色名称">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea" />
    </el-form-item>
    <el-form-item label="权限" prop="menuPermissions">
      <MenuPermission
        ref="menuPermissionRef"
        :menuPermissions="form.menuPermissions"
        :onChange="changePermission"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { RoleInfoDto } from "@/serivce/system/type";
import MenuPermission from "@/views/system/role/components/MenuPermission.vue";

defineOptions({
  name: "AddRole",
});

interface PropsType {
  data?: RoleInfoDto;
}

const props = defineProps<PropsType>();

const { remark, name, menuPermissions } = props.data || {};

const form = reactive({
  remark: remark || "",
  name: name || "",
  menuPermissions: menuPermissions || [],
});

const formRef = ref<FormInstance>();

const rules: FormRules<typeof form> = {
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
};

const changePermission = (value: string[]) => {
  form.menuPermissions.length = 0;
  form.menuPermissions.push(...value);
};

async function submit() {
  await formRef.value?.validate();

  return form;
}

defineExpose({
  submit,
});
</script>

<style scoped lang="less"></style>
