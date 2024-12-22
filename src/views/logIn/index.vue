<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-lg p-8 md:max-w-xl lg:max-w-2xl bg-white shadow-md rounded-lg">
      <h2 class="text-center text-4xl font-bold mb-10 text-gray-800">登 录</h2>
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        :rules="rules"
        label-width="100px"
        size="large"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="w-full flex items-center">
            <el-input v-model="loginForm.captcha" autocomplete="off" class="flex-1"></el-input>
            <img
              alt="captcha"
              class="ml-4 h-12 cursor-pointer"
              :src="verifiCodeSvg.code"
              @click="refreshCaptcha"
            />
          </div>
        </el-form-item>
        <el-button type="primary" @click="handleLogin" class="w-full py-3 text-xl">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FormInstance, FormRules } from "element-plus";
import useUserStore from "@/store/modules/user";
import { captchaType, getCaptcha } from "@/serivce/user";

defineOptions({
  name: "logIn",
});

const loginForm = reactive({
  username: "",
  password: "",
  captcha: "",
});

const rules: FormRules<typeof loginForm> = {
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { max: 30, min: 3, message: "用户名长度为3-30位字符" },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { max: 30, min: 3, message: "密码长度为3-30位字符" },
  ],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const loginFormRef = ref<FormInstance>();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loading = ref<boolean>(false);
/**
 * 验证码
 */
const verifiCodeSvg = reactive<captchaType>({
  id: "",
  code: "",
});

onBeforeMount(() => {
  refreshCaptcha();
});

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  if (await loginFormRef.value.validate()) {
    try {
      loading.value = true;
      const param = {
        account: loginForm.username,
        password: loginForm.password,
        captchaCode: loginForm.captcha,
        captchaId: verifiCodeSvg.id,
      };
      const result = await userStore.longIn(param);
      if (result.success) {
        if (route.query.redirect) {
          router.replace(route.query.redirect as string);
        } else {
          router.replace("/");
        }
      } else {
        refreshCaptcha();
      }
    } catch (error) {
      refreshCaptcha();
      throw error;
    } finally {
      loading.value = false;
    }
  }
};

const refreshCaptcha = async () => {
  const res = await getCaptcha({ width: 100, height: 40 });
  const blobSvg = new Blob([res.data?.code || ""], { type: "image/svg+xml" });
  verifiCodeSvg.code = URL.createObjectURL(blobSvg);
  verifiCodeSvg.id = res.data?.id || "";
};
</script>

<style scoped>
/* ...existing code... */
</style>
