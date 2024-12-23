import { createApp } from "vue";
import "./style/style.css";
import "./style/tailwind.css";
import "element-plus/dist/index.css";
import App from "./App.vue";
import store from "@/store";
import router from "@/router";

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
