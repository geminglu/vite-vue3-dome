<template>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules">
    <el-form-item label="字典编码" prop="code">
      <el-input v-if="!props.data?.code" v-model="form.code" />
      <span v-else>{{ form.code }}</span>
    </el-form-item>
    <el-form-item label="字典名称" prop="name">
      <el-input v-model="form.name" />
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
import { CreateDictionaryDto } from "@/serivce/system";
import { RequiredProps } from "@/types";
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

defineOptions({
  name: "AddDictionary",
});

interface PropsType {
  data?: RequiredProps<CreateDictionaryDto>;
}

const props = defineProps<PropsType>();

const form = reactive<RequiredProps<CreateDictionaryDto>>({
  name: props.data?.name || "",
  code: props.data?.code || "",
  remark: props.data?.remark || "",
  status: props.data?.status || "1",
});
const formRef = ref<FormInstance>();

const rules: FormRules<RequiredProps<CreateDictionaryDto>> = {
  name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  code: [
    { required: true, message: "请输入字典编码", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_]+$/, message: "字典编码只能包含字母、数字和下划线" },
  ],
  status: [{ required: false, message: "请选择状态", trigger: "blur" }],
  remark: [{ required: false, message: "请输入备注", trigger: "blur" }],
};

async function submit() {
  return (await formRef.value?.validate()) && form;
}

defineExpose({
  submit,
});
</script>

<style scoped lang="less"></style>
