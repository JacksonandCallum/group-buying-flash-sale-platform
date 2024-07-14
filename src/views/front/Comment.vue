<template>
  <div style="width: 70%;margin: 20px auto">
    <div class="box" style="margin-bottom: 5px">
      <el-table :data="data.tableData" stripe>
        <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip fixed="left">
          <template v-slot="scope">
            <a :href="'/front/goodsDetail?id=' + scope.row.goodsId" target="_blank">{{ scope.row.goodsName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容"></el-table-column>
        <el-table-column prop="score" label="评分"></el-table-column>
        <el-table-column prop="createTime" label="评价时间"></el-table-column>
        <el-table-column prop="reply" label="回复内容" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" header-align="center" width="260" fixed="right">
          <template #default="scope">
            <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="data.total" style="margin: 30px auto">
      <el-pagination background layout="total,prev,pager,next" :total="data.total" v-model:current-page='data.pageNum'
        v-model:page-sizes="data.pageSize" @current-change="load"></el-pagination>
    </div>
  </div>
</template>

<script setup>
import request from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive } from 'vue';
import router from "@/router/index.js";

const data = reactive({
  user: JSON.parse(localStorage.getItem("flash-sale-user") || '{}'),
  tableData: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
})

const load = () => {
  request
    .get("/comment/selectPage", {
      params: {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        userId: data.user.id,
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
