<template>
  <div>
    <el-form
      v-if="dateSet.queryform && dateSet.queryform?.length"
      ref="ruleFormRef"
      :inline="true"
      :rules="rules"
      label-width="auto"
      :model="form"
      class="queryForm"
    >
      <el-form-item
        v-for="item in dateSet.queryform"
        :key="item.name"
        :label="item.label"
        :prop="item.name"
      >
        <el-input
          v-if="item.type === 'text'"
          v-model="form[item.name]"
          clearable
          :placeholder="`请输入${item.label}`"
          style="width: 200px"
        />
        <UpLook
          v-if="item.type === 'uplook'"
          v-model="form[item.name]"
          :code="item.code"
          :fieldValue="item.fieldValue"
          :fielidText="item.fielidText"
          :placeholder="`请选择${item.label}`"
          style="width: 200px"
        />
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="form[item.name]"
          type="date"
          :placeholder="`请选择${item.label}`"
          :format="item.format"
          style="width: 200px"
        />
        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="form[item.name]"
          type="datetime"
          :placeholder="`请选择${item.label}`"
          :format="item.format"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item class="op">
        <el-button
          :disabled="dateSet.disabled.value"
          type="primary"
          @click="handelQuery"
          :loading="dateSet.butQuery.value"
        >
          查 询
        </el-button>
        <el-button :disabled="dateSet.disabled.value" @click="resetForm">重 置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <template v-for="item in headerButtons">
        <el-button
          v-if="typeof item === 'string' && item === 'refresh'"
          :key="item"
          type="primary"
          :disabled="dateSet.disabled.value"
          text
          @click="query"
        >
          <el-icon class="el-icon--left"><Icon icon="uil:redo" /></el-icon>
          刷新
        </el-button>
        <el-button
          type="primary"
          v-if="typeof item === 'object'"
          :key="item.name"
          text
          @click="item.click(dateSet, form)"
        >
          <el-icon class="el-icon--left"><Icon :icon="item.icon" /></el-icon>
          {{ item.name }}
        </el-button>
      </template>
    </div>
    <el-table
      :row-key="dateSet.primaryKey"
      :data="dateSet.tableData.value"
      v-loading="dateSet.disabled.value"
      stripe
      @selection-change="handleSelectionChange"
      :size="size"
      ref="tableRef"
      :height="tableHeight"
    >
      <el-table-column
        v-if="dateSet.multiple"
        type="selection"
        width="45"
        :reserve-selection="dateSet.reserveSelection"
      />
      <el-table-column
        v-for="item in dateSet.fields"
        :key="item.name"
        :label="item.label"
        show-overflow-tooltip
        :width="item.width"
        :prop="item.name"
        :min-width="item.minWidth"
        :fixed="item.fixed"
      >
        <template #default="scope">
          <ExpandDom v-if="item.render" :render="item.render" :params="scope.row" />
          <template v-else-if="item.type === 'text'">{{ scope.row[item.name] }}</template>
          <template v-else-if="item.type === 'datetime'">
            {{ dayjs(scope.row[item.name]).format(item.format || "YYYY-MM-DD HH:mm:ss") }}
          </template>
          <template v-else-if="item.type === 'date'">
            {{ dayjs(scope.row[item.name]).format(item.format || "YYYY-MM-DD") }}
          </template>
          <template v-else>{{ scope.row[item.name] }}</template>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty />
      </template>
    </el-table>
    <div class="flex justify-end pt-4 border-t">
      <el-pagination
        v-if="dateSet.paging"
        :current-page="dateSet.currentPage.value"
        :page-size="dateSet.pageSize?.value"
        :page-sizes="dateSet.pageSizes"
        :disabled="dateSet.disabled.value"
        :layout="pagingLayout"
        :total="dateSet.total.value"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :small="size === 'small'"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, PropType, defineComponent, reactive } from "vue";
import { DateSetType, headerButtonsType } from "@/components/DataSet/type";
import UpLook from "@/components/baseUi/uplook/index.vue";
import { ElTable, ElTableColumn, FormInstance, FormRules } from "element-plus";
import dayjs from "dayjs";
import { Icon } from "@iconify/vue";

defineOptions({
  name: "BaseTable",
});

const props = defineProps({
  dateSet: {
    type: Object as PropType<DateSetType>,
    default: () => {},
  },
  headerButtons: {
    type: Array as PropType<headerButtonsType[]>,
    default: () => [],
  },
  border: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<"large" | "default" | "small">,
    default: "large",
  },
  pagingLayout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  tableHeight: {
    type: String,
  },
});

const ruleFormRef = ref<FormInstance>();
const tableRef = ref<InstanceType<typeof ElTable>>();

const formQuery: { [index: string]: string } = {};

const form = ref<any>({ ...formQuery });
const rules = reactive<FormRules>({});

props.dateSet.queryform?.forEach(item => {
  formQuery[item.name] = item.defaultValue || "";
  rules[item.name] = [{ required: item.required }];
});

async function query() {
  const beforeQuery =
    props.dateSet.events?.beforeQuery &&
    props.dateSet.events.beforeQuery({ dataSet: props.dateSet, params: form.value });
  if (typeof beforeQuery === "boolean" && beforeQuery === false) {
    return;
  }
  let params = {};
  if (typeof beforeQuery === "object") {
    params = beforeQuery;
  }
  props.dateSet.query(params);
}

const handleSelectionChange = (val: any) => {
  props.dateSet.setMultipleSelection(val);
};

/**
 * 查询按钮的处理事件
 */
async function handelQuery() {
  try {
    props.dateSet.setLoading(true);
    props.dateSet.setFormData(form.value);
    await ruleFormRef.value?.validate(async valid => {
      if (valid) {
        await query();
      }
    });
  } catch (error: any) {
    throw new Error(error);
  } finally {
    props.dateSet.setLoading(false);
  }
}

function handleSizeChange(val: number) {
  props.dateSet.handleSize(val);
  query();
}
function handleCurrentChange(val: number) {
  props.dateSet.handleCurrent(val);
  query();
}

function resetForm() {
  if (props.dateSet.events?.reset) {
    props.dateSet.events.reset();
  }
  form.value = { ...formQuery };
  query();
}

defineExpose({
  // multipleSelection,
});

const ExpandDom = defineComponent({
  name: "ExpandDom",
  functional: true,
  props: ["render", "params"],
  render() {
    return typeof this.render === "function" ? this.render(this.params) : this.render;
  },
});
</script>

<style scoped lang="less">
.queryForm {
  display: flex;
  flex-wrap: wrap;
  .op {
    display: flex;
    flex: 1;
    :deep(.el-form-item__content) {
      justify-content: flex-end;
    }
  }
}
</style>
