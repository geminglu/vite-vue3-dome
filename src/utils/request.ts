import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError } from "axios";
import { ElMessage } from "element-plus";
import { ResultType } from "@/types/request";
import useUserStore from "@/store/modules/user";
import router from "@/router";

const axiosDefault: AxiosInstance = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json;charset=UTF-8" },
  baseURL: "/api",
});

function handelError(error: AxiosError<ResultType>) {
  const userStore = useUserStore();
  switch (error.response?.status) {
    case 401:
      router.push({ path: "/signIn", query: { redirect: router.currentRoute.value.fullPath } });
      userStore.logout();
      break;
    default:
      ElMessage({
        showClose: true,
        message: error.response?.data?.message || error.message,
        type: "error",
        grouping: true,
      });
      break;
  }
}

/**
 * 请求拦截器
 */
axiosDefault.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    config.headers.Authorization = "Bearer " + userStore.access_token;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axiosDefault.interceptors.response.use(
  (response: AxiosResponse<ResultType>) => {
    // removeSource(response.config);
    if (!response.data.success) {
      ElMessage({
        showClose: true,
        message: response.data.message,
        type: "error",
        grouping: true,
      });
      return Promise.reject(response);
    }
    return Promise.resolve(response);
  },
  (error: AxiosError<ResultType>) => {
    handelError(error);
    return Promise.reject(error);
  },
);

/**
 * request
 * @param config
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function request<T = any>(config: AxiosRequestConfig) {
  return new Promise<ResultType<T>>((resolve, reject) => {
    axiosDefault
      .request<ResultType<T>>(config)
      .then((response: AxiosResponse<ResultType<T>>) => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export default axiosDefault;
