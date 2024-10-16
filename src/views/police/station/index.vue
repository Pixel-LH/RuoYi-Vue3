<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="派出所名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入派出所名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="警局编号" prop="pNum">
        <el-input
          v-model="queryParams.pNum"
          placeholder="请输入警局编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="删除" prop="isDelete">
        <el-select v-model="queryParams.isDelete" placeholder="请选择删除" clearable>
          <el-option
            v-for="dict in sys_is_delete"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['police:station:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['police:station:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['police:station:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['police:station:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="派出所编号" align="center" prop="pid" />
      <el-table-column label="派出所名称" align="center" prop="name" />
      <el-table-column label="警局编号" align="center" prop="pNum" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="创建数据时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新数据时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除" align="center" prop="isDelete">
        <template #default="scope">
          <dict-tag :options="sys_is_delete" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['police:station:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['police:station:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改存储派出所信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="stationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="派出所名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入派出所名称" />
        </el-form-item>
        <el-form-item label="警局编号" prop="pNum">
          <el-input v-model="form.pNum" placeholder="请输入警局编号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除" prop="isDelete">
          <el-radio-group v-model="form.isDelete">
            <el-radio
              v-for="dict in sys_is_delete"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Station">
import { listStation, getStation, delStation, addStation, updateStation } from "@/api/police/station";

const { proxy } = getCurrentInstance();
const { sys_is_delete } = proxy.useDict('sys_is_delete');

const stationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    pNum: null,
    address: null,
    isDelete: null
  },
  rules: {
    name: [
      { required: true, message: "派出所名称不能为空", trigger: "blur" }
    ],
    pNum: [
      { required: true, message: "警局编号不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "地址不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询存储派出所信息列表 */
function getList() {
  loading.value = true;
  listStation(queryParams.value).then(response => {
    stationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    pid: null,
    name: null,
    pNum: null,
    address: null,
    createTime: null,
    updateTime: null,
    isDelete: null
  };
  proxy.resetForm("stationRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.pid);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加存储派出所信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _pid = row.pid || ids.value
  getStation(_pid).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改存储派出所信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["stationRef"].validate(valid => {
    if (valid) {
      if (form.value.pid != null) {
        updateStation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStation(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _pids = row.pid || ids.value;
  proxy.$modal.confirm('是否确认删除存储派出所信息编号为"' + _pids + '"的数据项？').then(function() {
    return delStation(_pids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('police/station/export', {
    ...queryParams.value
  }, `station_${new Date().getTime()}.xlsx`)
}

getList();
</script>
