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

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

async function handelError(axiosError: AxiosError<ResultType>) {
  const userStore = useUserStore();
  switch (axiosError.response?.status) {
    case 401: {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            if (axiosError.config) {
              const data = axiosDefault(axiosError.config);
              return Promise.resolve(data);
            }
            return Promise.reject(axiosError);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      } else {
        isRefreshing = true;
        try {
          await userStore.refreshToken();
          processQueue(null);
          if (axiosError.config) {
            const data = axiosDefault(axiosError.config);
            return Promise.resolve(data);
          }
          return Promise.reject(axiosError);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          processQueue(axiosError);
          router.currentRoute.value.path !== "/signIn" &&
            router.replace({
              path: "/signIn",
              query: { redirect: router.currentRoute.value.fullPath },
            });
          userStore.logout();
          return Promise.reject(axiosError);
        } finally {
          isRefreshing = false;
        }
      }
      break;
    }
    default:
      ElMessage({
        showClose: true,
        message: axiosError.response?.data?.message || axiosError.message,
        type: "error",
        grouping: true,
      });
      break;
  }
  return axiosError;
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
  async (error: AxiosError<ResultType>) => {
    return handelError(error);
  },
);

/**
 * request
 * @param config
 * @returns
 */
export function request<T = any>(config: AxiosRequestConfig) {
  return new Promise<ResultType<T>>((resolve, reject) => {
    axiosDefault
      .request<ResultType<T>>(config)
      .then((response: AxiosResponse<ResultType<T>>) => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error.response?.data);
      });
  });
}

export default axiosDefault;
