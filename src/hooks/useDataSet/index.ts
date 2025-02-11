import { reactive, ref } from "vue";
import type { configType, DateSetType, EventType, Sort, SortOrder } from "./type";
import { isNotEmpty, isObject } from "@/utils/is";
import type { AxiosRequestConfig } from "axios";
import { request } from "@/utils/request";

function useDataSet(dataSet: configType) {
  const config = reactive<DateSetType>({
    autoQuery: true,
    queryUrl: undefined,
    queryParameter: {},
    transport: undefined,
    fields: [],
    queryform: [],
    primaryKey: undefined,
    formQuery: {},
    currentPage: 1,
    pageSize: 100,
    pageSizes: [100, 200, 300, 400],
    disabled: false,
    butQuery: false,
    total: 0,
    paging: true,
    multiple: false,
    multipleSelection: ref([]),
    reserveSelection: false,
  });
  const tableData = reactive<any[]>([]);

  const sort = reactive<Sort[]>([]);

  /**
   * 事件
   */
  let events: Partial<EventType> = {};

  const initDataSet = () => {
    dataSet.autoQuery !== undefined && (config.autoQuery = dataSet.autoQuery);
    dataSet.queryUrl !== undefined && (config.queryUrl = dataSet.queryUrl);
    dataSet.transport !== undefined && (config.transport = dataSet.transport);
    config.fields = dataSet.fields;
    dataSet.primaryKey !== undefined && (config.primaryKey = dataSet.primaryKey);
    dataSet.paging !== undefined && (config.paging = dataSet.paging);
    dataSet.multiple !== undefined && (config.multiple = dataSet.multiple);
    dataSet.queryform !== undefined && (config.queryform = dataSet.queryform);
    if (dataSet.queryParameter) {
      for (const key in dataSet.queryParameter) {
        config.queryParameter[key] = dataSet.queryParameter[key];
      }
    }
    if (dataSet.pageSizes) {
      config.pageSizes = dataSet.pageSizes;
      dataSet.pageSizes.length && (config.pageSize = dataSet.pageSizes[0]);
    }
    events = dataSet.events || {};

    if (dataSet.reserveSelection !== undefined) {
      config.reserveSelection = dataSet.reserveSelection;
    }

    const fields = config.fields.filter(item => item.sortOrder !== undefined);
    const sortFilterObject = fields.filter(item => isObject(item.sortOrder));
    const sortFilterString = fields.filter(item => !isObject(item.sortOrder));

    const sortList = [
      ...sortFilterObject
        .sort(
          (a, b) =>
            ((a.sortOrder as { sortOrder: SortOrder; priority?: number }).priority || 0) -
            ((b.sortOrder as { sortOrder: SortOrder; priority?: number }).priority || 0),
        )
        .map(item => ({
          ...item,
          sortOrder: (item.sortOrder as { sortOrder: SortOrder }).sortOrder,
        })),
      ...sortFilterString,
    ].map(item => ({
      prop: item.name,
      order: item.sortOrder as SortOrder,
    }));

    sort.push(...sortList);

    // 如果autoQuery为true调用query函数
    config.autoQuery && query();
  };

  const query = async (data?: { [index: string]: any }) => {
    let sortString = "";
    sort
      .filter(item => item.order && item.prop)
      .forEach(itrm => {
        sortString += `${itrm.prop}:${itrm.order},`;
      });
    try {
      config.disabled = true;
      let result;
      const param: {
        [x: string]: any;
      } = {
        ...data,
        ...config.queryParameter,
        sort: sortString,
      };

      for (const key in config.formQuery) {
        if (isNotEmpty(config.formQuery[key])) {
          param[key] = config.formQuery[key];
        }
      }
      if (config.paging) param.page = config.currentPage;
      if (config.paging) param.pageSize = config.pageSize;

      if (config.transport?.read) {
        let axiosRequestConfig: AxiosRequestConfig = {};
        if (typeof config.transport?.read === "function") {
          axiosRequestConfig = config.transport?.read(param);
        } else {
          axiosRequestConfig = config.transport?.read;
        }
        result = await request(axiosRequestConfig);
      } else if (config.queryUrl) {
        result = await request({
          url: config.queryUrl,
          params: param,
        });
      } else {
        throw new Error("queryUrl和transport.read至少有一项");
      }
      let list = [];
      if (result.data?.list) {
        list = result.data.list;
        config.total = result.data.total;
      } else {
        list = result.data;
        config.total = result.data?.length || 0;
      }

      const source = events.response ? events.response(list) : list;
      tableData.length = 0;
      tableData.push(...source);

      events?.onLoad && (await events.onLoad(obj, tableData));
    } finally {
      config.disabled = false;
    }
  };

  /**
   * 加载数据
   * @description 会覆盖当前数据
   */
  const load = (data: any[]) => {
    tableData.length = 0;
    tableData.push(...data);
    config.currentPage = 1;
  };

  /**
   * 设置分页大小
   */
  const handleSize = (size: number) => {
    config.pageSize = size;
  };

  /**
   * 设置分页
   */
  const handleCurrent = (page: number) => {
    config.currentPage = page;
  };

  /**
   * 设置加载状态
   */
  const setLoading = (loading: boolean) => {
    config.butQuery = loading;
  };

  /**
   * 设置表单数据
   */
  const setFormData = (data: any) => {
    config.formQuery = data;
  };

  /**
   * 设置选中数据
   */
  const setMultipleSelection = (data: any) => {
    config.multipleSelection = data;
  };

  const setSort = (data: Sort[]) => {
    sort.length = 0;
    sort.push(...data);
  };

  initDataSet();

  const obj = {
    config,
    tableData,
    events,
    sort,
    query,
    load,
    handleSize,
    handleCurrent,
    setLoading,
    setFormData,
    setMultipleSelection,
    setSort,
  };

  return obj;
}

export default useDataSet;

export type useDataSetType = ReturnType<typeof useDataSet>;
