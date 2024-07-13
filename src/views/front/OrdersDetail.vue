<template>
  <div style="width: 50%;margin: 20px auto">
    <el-row :gutter="10">
      <el-col :span="4">
        <img :src="data.ordersData.goodsImg" alt=""
          style="width: 100%;height: 110px;border-radius: 10px;border:1px solid #cccccc">
      </el-col>
      <el-col :span="20">
        <div style="font-size: 20px;font-weight: bold;margin-bottom: 10px;line-height: 30px;">{{
          data.ordersData.goodsName }}</div>
        <div style="margin-top: 15px;font-size: 15px;">订单编号：{{ data.ordersData.orderNo }}</div>
        <div style="margin-top: 15px;font-size: 15px;">创建时间：{{ data.ordersData.createTime }}</div>
        <!-- NOT_PAY -->
        <div style="margin-top: 15px;font-size: 15px;" v-if="data.ordersData.status === '待支付'">支付状态：<el-tag
            type="danger">{{ data.ordersData.status }}</el-tag></div>
        <div style="margin-top: 15px;font-size: 15px;">商品价格：￥{{ data.ordersData.goodsPrice }}</div>
        <div style="margin-top: 15px;font-size: 15px;">购买数量：{{ data.ordersData.num }}</div>
        <div style="margin-top: 15px;font-size: 15px;">订单总价：<span style="font-size: 18px;color: red;">￥{{
          data.ordersData.total }}</span></div>
        <div style="margin-top: 15px;"><el-button type="primary" plain style="padding: 20px 30px;"
            @click="pay">去支付</el-button></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import router from '@/router/index.js';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';

const data = reactive({
  ordersId: router.currentRoute.value.query.id,
  ordersData: {}
})

const loadOrders = () => {
  request.get("/orders/selectById/" + data.ordersId).then(res => {
    if (res.code === '200') {
      data.ordersData = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const pay = () => {
  window.open("/pay?orderNo=" + data.ordersData.orderNo)
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
</style>
