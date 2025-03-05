<template>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" scroll-to-error>
    <el-form-item label="部门名称" prop="deptName">
      <el-input v-model="form.deptName" />
    </el-form-item>
    <el-form-item label="邮箱地址" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item label="排序" prop="orderNum">
      <el-input-number :controls="false" v-model="form.orderNum" />
    </el-form-item>
    <el-form-item label="上级部门" prop="parentId">
      <el-cascader
        :options="deptList"
        v-model="form.parentId"
        :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'deptName' }"
        :show-all-levels="false"
        clearable
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio value="0">启用</el-radio>
        <el-radio value="1">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { CreateDeptVo, DeptDtoInfo, StatusEnum } from "@/serivce/system/type";
import { queryDeptList } from "@/serivce/system/index";
import { arrayToTree } from "@/utils";

defineOptions({
  name: "AddDept",
});

interface PropsType {
  data?: CreateDeptVo & { id?: number };
}

const props = defineProps<PropsType>();

const { remark, status, deptName, email, orderNum, parentId, phone, leader } = props.data || {};

const form = reactive<CreateDeptVo>({
  remark: remark || "",
  status: status || StatusEnum.ENABLE,
  deptName: deptName || "",
  email: email || "",
  orderNum: orderNum || 0,
  parentId: parentId,
  phone: phone,
  leader: leader,
});

const formRef = ref<FormInstance>();

const rules: FormRules<CreateDeptVo> = {
  deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  email: [{ required: false, type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
};

const deptList = reactive<DeptDtoInfo[]>([]);

onMounted(() => {
  queryDeptList().then(res => {
    deptList.length = 0;
    deptList.push(
      ...arrayToTree<DeptDtoInfo>(
        (res.data?.list || []).map(item => ({
          ...item,
          disabled: item.id === props.data?.id,
          pid: item.parentId,
        })),
      ),
    );
  });
});

async function submit() {
  await formRef.value?.validate();

  return form;
}

defineExpose({
  submit,
});
</script>

<style scoped lang="less"></style>
