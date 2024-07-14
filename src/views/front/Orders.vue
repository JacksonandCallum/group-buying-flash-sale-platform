<template>
  <div style="width: 80%;margin: 2px auto">
    <div class="box" style="margin-bottom: 5px">
      <el-table :data="data.tableData" stripe @selection-change="handleSelectChange">
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="goodsImg" label="商品图片">
          <template #default="scope">
            <el-image v-if="scope.row.goodsImg" :src="scope.row.goodsImg" :preview-src-list="[scope.row.goodsImg]"
              preview-teleported style="width: 55px; height: 55px"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="商品单价"></el-table-column>
        <el-table-column prop="num" label="购买数量"></el-table-column>
        <el-table-column prop="total" label="商品总价"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="payNo" label="支付编号"></el-table-column>
        <el-table-column prop="payTime" label="支付时间"></el-table-column>
        <el-table-column prop="userName" label="下单人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.status === 'CANCEL'">已取消</el-tag>
            <el-tag type="primary" v-if="scope.row.status === 'NOT_PAY'">待支付</el-tag>
            <el-tag type="primary" v-if="scope.row.status === 'IN_GROUP'">拼团中</el-tag>
            <el-tag type="primary" v-if="scope.row.status === 'NOT_SEND'">待发货</el-tag>
            <el-tag type="primary" v-if="scope.row.status === 'NOT_ACCEPT'">待收货</el-tag>
            <el-tag type="success" v-if="scope.row.status === 'DONE'">已完成</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 'REFUND_DONE'">已退款</el-tag>
            <el-tag type="success" v-if="scope.row.status === 'COMMENT_DONE'">已评价</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="订单类型">
          <template #default="scope">
            <span v-if="scope.row.type === 'COMMON'">普通</span>
            <span v-if="scope.row.type === 'GROUP'">团购</span>
            <span v-if="scope.row.type === 'FLASH'">秒杀</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="260">
          <template #default="scope">
            <el-button plain type="primary" @click="update(scope.row)">发货</el-button>
            <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box" v-if="data.total">
      <el-pagination background layout="total,prev,pager,next" :total="data.total" v-model:current-page='data.pageNum'
        v-model:page-sizes="data.pageSize" @current-change="load"></el-pagination>
    </div>
  </div>
</template>

<script setup>
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';
import router from "@/router/index.js";

const data = reactive({

})

onMounted(() => {

})
</script>

<style scoped>
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
