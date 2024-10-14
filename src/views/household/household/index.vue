<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="户号" prop="housetypeId">
        <el-input
          v-model="queryParams.housetypeId"
          placeholder="请输入户号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="户主姓名" prop="pid">
        <el-input
          v-model="queryParams.pid"
          placeholder="请输入户主姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="办理人id" prop="holderId">
        <el-input
          v-model="queryParams.holderId"
          placeholder="请输入办理人id"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['household:household:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['household:household:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['household:household:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['household:household:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="householdList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="户号" align="center" prop="housetypeId" />
      <el-table-column label="户主姓名" align="center" prop="pid" />
      <el-table-column label="地址" align="center" prop="housenum" />
      <el-table-column label="办理人id" align="center" prop="holderId" />
      <el-table-column label="立户日期" align="center" prop="setdata" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.setdata, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['household:household:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['household:household:remove']">删除</el-button>
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

    <!-- 添加或修改户口本对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="householdRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="户号" prop="housetypeId">
          <el-input v-model="form.housetypeId" placeholder="请输入户号" />
        </el-form-item>
        <el-form-item label="户主姓名" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入户主姓名" />
        </el-form-item>
        <el-form-item label="地址" prop="housenum">
          <el-input v-model="form.housenum" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="办理人id" prop="holderId">
          <el-input v-model="form.holderId" placeholder="请输入办理人id" />
        </el-form-item>
        <el-form-item label="立户日期" prop="setdata">
          <el-date-picker clearable
            v-model="form.setdata"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择立户日期">
          </el-date-picker>
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

<script setup name="Household">
import { listHousehold, getHousehold, delHousehold, addHousehold, updateHousehold } from "@/api/household/household";

const { proxy } = getCurrentInstance();

const householdList = ref([]);
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
    housetypeId: null,
    pid: null,
    holderId: null,
  },
  rules: {
    housetypeId: [
      { required: true, message: "户号不能为空", trigger: "blur" }
    ],
    pid: [
      { required: true, message: "户主姓名不能为空", trigger: "blur" }
    ],
    housenum: [
      { required: true, message: "地址不能为空", trigger: "blur" }
    ],
    holderId: [
      { required: true, message: "办理人id不能为空", trigger: "blur" }
    ],
    setdata: [
      { required: true, message: "立户日期不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询户口本列表 */
function getList() {
  loading.value = true;
  listHousehold(queryParams.value).then(response => {
    householdList.value = response.rows;
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
    id: null,
    housetypeId: null,
    pid: null,
    housenum: null,
    holderId: null,
    setdata: null,
    createTime: null,
    updateTime: null,
    isDelete: null
  };
  proxy.resetForm("householdRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加户口本";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getHousehold(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改户口本";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["householdRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateHousehold(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addHousehold(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除户口本编号为"' + _ids + '"的数据项？').then(function() {
    return delHousehold(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('household/household/export', {
    ...queryParams.value
  }, `household_${new Date().getTime()}.xlsx`)
}

getList();
</script>
