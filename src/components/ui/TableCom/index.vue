<template>
  <div>
    <el-form
      v-if="dateSet.config.queryform && dateSet.config.queryform?.length"
      ref="ruleFormRef"
      :inline="true"
      :rules="rules"
      label-width="auto"
      :model="form"
      class="queryForm"
    >
      <el-form-item
        v-for="item in dateSet.config.queryform"
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
          :disabled="dateSet.config.disabled"
          type="primary"
          @click="handelQuery"
          :loading="dateSet.config.butQuery"
        >
          查 询
        </el-button>
        <el-button :disabled="dateSet.config.disabled" @click="resetForm">重 置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <template v-for="item in headerButtons">
        <el-button
          v-if="typeof item === 'string' && item === 'refresh'"
          :key="item"
          type="primary"
          :disabled="dateSet.config.disabled"
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
      :row-key="dateSet.config.primaryKey"
      :data="dateSet.tableData"
      v-loading="dateSet.config.disabled"
      stripe
      @selection-change="handleSelectionChange"
      :size="size"
      :border
      ref="tableRef"
      @sort-change="sortChange"
      :height="tableHeight"
      :header-cell-class-name="handleHeaderCellClass"
      lazy
      :load="load"
      :treeProps
      :tableLayout
    >
      <el-table-column
        v-if="dateSet.config.multiple"
        type="selection"
        width="45"
        :reserve-selection="dateSet.config.reserveSelection"
      />
      <el-table-column
        v-for="item in dateSet.config.fields"
        :key="item.name"
        :sortable="item.sortOrder !== undefined && 'sortOrder'"
        :label="item.label"
        show-overflow-tooltip
        :width="item.width"
        :header="{}"
        :prop="item.name"
        :min-width="item.minWidth"
        :fixed="item.fixed"
      >
        <template #default="scope">
          <ExpandDom
            v-if="item.customRender"
            :render="item.customRender"
            :params="{
              record: scope.row,
              value: scope.row[item.name],
              text: item.name,
              index: scope.$index,
              column: dateSet.config.fields,
            }"
          />
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
        v-if="dateSet.config.paging"
        :current-page="dateSet.config.currentPage"
        :page-size="dateSet.config.pageSize"
        :page-sizes="dateSet.config.pageSizes"
        :disabled="dateSet.config.disabled"
        :layout="pagingLayout"
        :total="dateSet.config.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :small="size === 'small'"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, defineComponent, reactive } from "vue";
import UpLook from "@/components/ui/uplook/index.vue";
import { ElTable, ElTableColumn, FormInstance, FormRules } from "element-plus";
import dayjs from "dayjs";
import { Icon } from "@iconify/vue";
import { PropsType } from "./type";

defineOptions({
  name: "BaseTable",
});

const props = withDefaults(defineProps<PropsType>(), {
  border: false,
  size: "large",
  pagingLayout: "total, sizes, prev, pager, next, jumper",
  lazy: false,
  tableLayout: "fixed",
  headerButtons: () => [],
  treeProps: () => ({ hasChildren: "hasChildren", children: "children", checkStrictly: false }),
});
console.log(props);


const orderMap = {
  asc: "ascending",
  desc: "descending",
};

const sortOrder = reactive(
  props.dateSet.sort.map(item => ({
    ...item,
    order: item.order ? orderMap[item.order] : null,
  })),
);

const ruleFormRef = ref<FormInstance>();
const tableRef = ref<InstanceType<typeof ElTable>>();

const formQuery: { [index: string]: string } = {};

const form = ref<any>({ ...formQuery });
const rules = reactive<FormRules>({});

props.dateSet.config.queryform?.forEach(item => {
  formQuery[item.name] = item.defaultValue || "";
  rules[item.name] = [{ required: item.required }];
});

async function query() {
  props.dateSet.query(form.value);
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
    props.dateSet.setFormData(form);
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

function sortChange({ prop, order }: { prop: string; order: "descending" | "ascending" | null }) {
  const sort = sortOrder.find(item => item.prop === prop);
  if (sort) {
    sort.order = order;
    setSort();
    query();
  }
}

function setSort() {
  props.dateSet.setSort(
    sortOrder.map(item => ({
      ...item,
      order: item.order ? (item.order === "descending" ? "desc" : "asc") : null,
    })),
  );
}

const handleHeaderCellClass = ({ column }: { column: any }) => {
  sortOrder.forEach(item => {
    if (column.property === item.prop) {
      column.order = item.order;
    }
  });
  return "";
};

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
