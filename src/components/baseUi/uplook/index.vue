<template>
  <div class="up_look">
    <el-select
      :model-value="modelValue"
      :loading="loading"
      clearable
      v-bind="$attrs"
      @change="
        (v: any) => {
          emit('update:modelValue', v);
        }
      "
    >
      <el-option
        v-for="item in data"
        :key="item[fieldValue]"
        :label="item[fielidText]"
        :value="item[fieldValue]"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, ref, onMounted, watch } from "vue";
import { DictionaryDetailListDto, getDictionaryCodeInfo } from "@/serivce/system";

defineOptions({
  name: "UpLook",
});

interface Emit {
  (e: "update:modelValue", v: any): void;
}

const props = defineProps({
  modelValue: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  /**
   * 查询参数
   */
  parma: {
    type: Object as PropType<{ [index: string]: any }>,
  },
  /**
   * 字段 fieldValue，默认为‘fieldValue’
   */
  fieldValue: {
    type: String,
    default: "fieldsValue",
  },
  /**
   * 显示的名称，默认是‘fielidText’
   */
  fielidText: {
    type: String,
    default: "fieldsText",
  },
});

onMounted(() => {
  getDate();
});

watch(
  () => props.parma,
  () => {
    getDate();
  },
  { deep: true },
);

const emit = defineEmits<Emit>();

const loading = ref(false);
const data = reactive<(DictionaryDetailListDto & { [x: string]: any })[]>([]);

/**
 * 请求数据
 */
async function getDate() {
  try {
    loading.value = true;
    const results = await getDictionaryCodeInfo(props.code, props.parma);
    const d = results.data?.list || [];
    data.length = 0;
    data.push(...d.sort((a, b) => a.sort - b.sort));
    // eslint-disable-next-line no-useless-catch
  } catch (error: any) {
    throw error;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="less">
.up_look {
  // min-width: 200px;
}
</style>
