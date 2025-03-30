<template>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" scroll-to-error>
    <el-form-item label="部门名称" prop="角色名称">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { CreateRoleDto, RoleInfoDto } from "@/serivce/system/type";

defineOptions({
  name: "AddRole",
});

interface PropsType {
  data?: RoleInfoDto;
}

const props = defineProps<PropsType>();

const { remark, name } = props.data || {};

const form = reactive<CreateRoleDto>({
  remark: remark || "",
  name: name || "",
});

const formRef = ref<FormInstance>();

const rules: FormRules<CreateRoleDto> = {
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
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
