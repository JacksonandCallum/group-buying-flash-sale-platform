<template>
  <div style="width: 60%;margin: 20px auto">
    <el-row :gutter="15">
      <el-col :span="7">
        <img :src="data.goodsData.img" alt=""
          style="width: 100%;height: 250px;border-radius: 10px;border: 1px solid #cccccc;">
      </el-col>
      <el-col :span="17">
        <div class="overflow" style="font-size: 20px;font-weight: bold;margin-bottom: 10px;">{{ data.goodsData.name }}
        </div>
        <div v-if="data.goodsData.hasFlash"
          style="margin: 10px 0 20px 0; background-image: linear-gradient(to right, #f83939, #f52593); padding: 10px; border-radius: 5px">
          <div style="font-size: 22px; color: white; font-weight: bold">秒杀价：￥{{ data.goodsData.flashPrice }}</div>
          <div style="margin-top: 5px; color: white">原价：<del>￥{{ data.goodsData.originPrice }}</del></div>
        </div>
        <div v-else-if="data.goodsData.hasGroup"
          style="margin: 10px 0 20px 0; background-image: linear-gradient(to right, #faa303, #ef9d84); padding: 10px; border-radius: 5px">
          <div style="font-size: 22px; color: white; font-weight: bold">团购价：￥{{ data.goodsData.groupPrice }}</div>
          <div style="margin-top: 5px; color: white">原价：<del>￥{{ data.goodsData.originPrice }}</del></div>
        </div>
        <div v-else style="font-size: 18px;font-weight: bold;color: red;margin: 20px 0 30px;">商品价格：￥{{
          data.goodsData.originPrice }}</div>
        <div style="font-size: 15px;">商品分类：{{ data.goodsData.categoryName }}</div>
        <div style="margin-top: 10px;font-size: 15px;" v-if="data.goodsData.hasFlash || data.goodsData.hasGroup">
          <span>购买数量：</span>
          <el-input-number v-model="data.num" :min="1" :max="data.goodsData.store"></el-input-number>
          <span style="margin-left: 20px;">库存：{{ data.goodsData.store }}</span>
        </div>
        <div style="margin-top: 20px;font-size: 15px;" v-else>
          <span>购买数量：</span>
          <el-input-number v-model="data.num" :min="1" :max="data.goodsData.store" @change="initNum"></el-input-number>
          <span style="margin-left: 20px;">库存：{{ data.goodsData.store }}</span>
        </div>
        <div style="margin-top: 20px;" v-if="data.goodsData.hasFlash || data.goodsData.hasGroup">
          <el-button type="danger" style="padding: 20px 30px;" v-if="data.goodsData.hasFlash"
            @click="createFlashOrder">去秒杀</el-button>
          <el-button type="warning" style="padding: 20px 30px;" v-if="data.goodsData.hasGroup"
            @click="createGroupOrder">去团购</el-button>
        </div>
        <div style="margin-top: 30px;" v-else>
          <el-button type="primary" plain style="padding: 20px 30px;" @click="createOrdinaryOrder">去购买</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top: 20px;">
      <el-tabs type="border-card">
        <el-tab-pane label="商品详情">
          <div v-html="data.goodsData.content"></div>
        </el-tab-pane>
        <el-tab-pane label="商品评价">
          <div style="color: #666666;">该商品暂无评价</div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index.js';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';

const data = reactive({
  goodsId: router.currentRoute.value.query.id,
  orderId: router.currentRoute.value.query.orderId,
  goodsData: {},
  num: 1
})

const loadGoods = () => {
  request.get("/goods/selectById/" + data.goodsId).then(res => {
    if (res.code === '200') {
      data.goodsData = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const initNum = (num) => {
  data.num = num
}

const createOrdinaryOrder = () => {
  let orderData = {
    goodsId: data.goodsId,
    num: data.num,
    type: "COMMON"
  }
  request.post("/orders/add", orderData).then(res => {
    if (res.code === '200') {
      // 创建订单成功后，会返回订单信息，然后跳转到订单详情页
      location.href = "/front/ordersDetail?id=" + res.data.id
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const createFlashOrder = () => {
  let orderData = {
    goodsId: data.goodsId,
    num: data.num,
    type: "FLASH"
  }
  request.post("/orders/addFlashOrder", orderData).then(res => {
    if (res.code === '200') {
      // 创建订单成功后，会返回订单信息，然后跳转到订单详情页
      location.href = "/front/ordersDetail?id=" + res.data.id
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const createGroupOrder = () => {
  let orderData = {
    goodsId: data.goodsId,
    num: data.num,
    type: "GROUP",
    groupOrderId: data.orderId
  }
  request.post("/orders/add", orderData).then(res => {
    if (res.code === '200') {
      // 创建订单成功后，会返回订单信息，直接走支付
      window.open("/pay?orderNo=" + res.data.orderNo)
    } else {
      ElMessage.error(res.msg)
    }
  })
}

onMounted(() => {
  loadGoods()
})
</script>

<style scoped>
.overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
</style>
