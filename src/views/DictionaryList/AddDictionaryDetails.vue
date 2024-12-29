<template>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules">
    <el-form-item label="字典标签" prop="fieldsText">
      <el-input v-model="form.fieldsText" />
    </el-form-item>
    <el-form-item label="字典值" prop="fieldsValue">
      <el-input v-model="form.fieldsValue" />
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number v-model="form.sort" :min="0" />
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
import { CreateDictionaryDetailDto } from "@/serivce/system";
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

defineOptions({
  name: "AddDictionaryDetails",
});

type CreateDictionaryDetailVo = Omit<CreateDictionaryDetailDto, "dictionaryCode">;

interface PropsType {
  data?: CreateDictionaryDetailVo;
}

const props = defineProps<PropsType>();

const form = reactive<CreateDictionaryDetailVo>({
  remark: props.data?.remark || "",
  status: props.data?.status || "1",
  fieldsText: props.data?.fieldsText || "",
  fieldsValue: props.data?.fieldsValue || "",
  sort: props.data?.sort,
});
const formRef = ref<FormInstance>();

const rules: FormRules<CreateDictionaryDetailVo> = {
  fieldsText: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
  fieldsValue: [{ required: true, message: "请输入字典值", trigger: "blur" }],
  status: [],
  remark: [],
  sort: [],
};

async function submit() {
  return (await formRef.value?.validate()) && form;
}

defineExpose({
  submit,
});
</script>

<style scoped lang="less"></style>
