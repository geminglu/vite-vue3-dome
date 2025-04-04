<template>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" scroll-to-error>
    <el-form-item label="姓名" prop="deptName">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="邮箱地址" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio value="0">女</el-radio>
        <el-radio value="1">男</el-radio>
        <el-radio value="">保密</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="角色" prop="roles">
      <el-select v-model="form.roles" multiple filterable :reserve-keyword="false" class="w-full">
        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="所在部门" prop="dept">
      <el-cascader
        :options="deptList"
        v-model="form.deptId"
        :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'deptName' }"
        :show-all-levels="false"
        clearable
        class="w-full"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.isActive">
        <el-radio value="1">启用</el-radio>
        <el-radio value="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="form.remark" type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="tsx">
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { DeptDtoInfo, type RoleInfoDto } from "@/serivce/system/type";
import { queryDeptList } from "@/serivce/system/index";
import { arrayToTree } from "@/utils";
import { ceratedUser } from "@/serivce/user";
import { phoneReg } from "@/utils/regular";
import { userInfoType } from "@/store/modules/user";
import { queryRoleList } from "@/serivce/system/role";

defineOptions({
  name: "AddUser",
});

interface PropsType {
  data?: userInfoType & ceratedUser;
}

const props = defineProps<PropsType>();

const { deptId, avatars, roles, remark, email, gender, isActive, name, phone, role } =
  props.data || {};

const form = reactive<ceratedUser>({
  avatars: avatars || "",
  email: email || "",
  gender: gender || "",
  isActive: isActive || "1",
  name: name || "",
  phone: phone || "",
  role: role || "0",
  deptId: deptId,
  remark: remark || "",
  roles: roles || [],
});

const formRef = ref<FormInstance>();

const rules: FormRules<ceratedUser> = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  email: [{ required: true, type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
  phone: [
    {
      required: true,
      type: "string",
      pattern: phoneReg,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  roles: [{ required: true, type: "array" }],
};
const roleList = reactive<RoleInfoDto[]>([]);

const deptList = reactive<DeptDtoInfo[]>([]);

onMounted(() => {
  queryDeptList().then(res => {
    deptList.length = 0;
    deptList.push(
      ...arrayToTree<DeptDtoInfo>(
        (res.data?.list || []).map(item => ({
          ...item,
          pid: item.parentId,
        })),
      ),
    );
  });

  queryRoleList({
    page: 1,
    pageSize: 999999,
  }).then(res => {
    roleList.length = 0;
    roleList.push(...(res.data?.list || []));
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
