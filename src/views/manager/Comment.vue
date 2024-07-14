<template>
  <div>
    <div class="box">
      <el-button type="info" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="box" style="margin-bottom: 5px">
      <el-table :data="data.tableData" stripe @selection-change="handleSelectChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip fixed="left"></el-table-column>
        <el-table-column prop="content" label="评价内容"></el-table-column>
        <el-table-column prop="score" label="评分"></el-table-column>
        <el-table-column prop="createTime" label="评价时间"></el-table-column>
        <el-table-column prop="reply" label="回复内容" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" header-align="center" width="260" fixed="right">
          <template #default="scope">
            <el-button plain type="primary" @click="handleEdit(scope.row)">回复</el-button>
            <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="回复信息" v-model="data.formVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="data.form" label-width="80px" style="padding: 20px 30px" ref="formRef">
        <el-form-item label="回复内容" prop="content">
          <el-input type="textarea" :rows="4" v-model="data.form.reply" placeholder="评价内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.formVisible = false">取消</el-button>
          <el-button type="primary" @click="reply">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <div v-if="data.total" class="box">
      <el-pagination background layout="total,prev,pager,next" :total="data.total" v-model:current-page='data.pageNum'
        v-model:page-sizes="data.pageSize" @current-change="load"></el-pagination>
    </div>
  </div>
</template>

<script setup>
import request from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive } from 'vue';

const data = reactive({
  user: JSON.parse(localStorage.getItem("flash-sale-user") || '{}'),
  tableData: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
  formVisible: false
})

const load = () => {
  request
    .get("/comment/selectPage", {
      params: {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
      },
    })
    .then((res) => {
      data.tableData = res.data.list
      data.total = res.data.total
    });
};

const del = (id) => {
  ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
    request.delete("/comment/delete/" + id).then(res => {
      if (res.code === '200') {
        ElMessage.success("删除成功")
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => { })
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

const reply = () => {
  request.put('/comment/update', data.form).then(res => {
    if (res.code === '200') {
      ElMessage.success('回复成功')
      data.formVisible = false
      load()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const delBatch = () => {
  if (data.ids.length === 0) {
    ElMessage.warning("请选择数据")
    return
  }
  ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
    request.delete("/comment/deleteBatch", { data: data.ids }).then(res => {
      if (res.code === '200') {
        ElMessage.success("删除成功")
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => { })

}

const handleSelectChange = (value) => {
  data.ids = value.map(v => v.id)
}

onMounted(() => {
  load()
});
</script>

<style scoped>
@import "@/assets/css/manager.css";

.overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}

.ellipsis2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.el-col-5 {
  width: 20%;
  max-width: 20%;
  padding: 10px 10px;
}
</style>
