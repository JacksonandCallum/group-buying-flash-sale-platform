<template>
  <div style="width: 80%;margin: 2px auto">
    <el-carousel height="350px">
      <el-carousel-item v-for="item in data.carouselData" :key="item">
        <img :src="item.img" alt="" style="width: 100%; height: 350px">
      </el-carousel-item>
    </el-carousel>
    <!-- 最新商品 -->
    <div style="margin-top: 30px;">
      <div style="display: flex;">
        <div style="flex: 1;font-weight: bold;font-size: 18px;">最新商品</div>
        <div style="width: 100px;text-align: right;cursor: pointer;">查看更多</div>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="5" v-for="item in data.goodslData" style="margin-bottom: 10px;">
          <img :src="item.img" alt="" style="width: 100%;height: 235px;border-radius: 10px;border: 1px solid #ccc;">
          <div class="overflow" style="font-size: 17px;font-weight: bold;color: #333;margin-top: 10px">{{ item.name }}
          </div>
          <div style="display: flex;align-items: center;font-size: 15px;font-weight: bold;color: red;margin-top: 5px;">
            <div style="flex: 1;">商品价格：￥{{ item.originPrice }}</div>
            <div style="width: 80px;"><el-button type="warning">去购买</el-button></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { onMounted, reactive } from 'vue';

const data = reactive({
  carouselData: [],
  goodslData: []
})

const loadCarousel = () => {
  request.get("/carousel/selectAll").then(res => {
    if (res.code === '200') {
      data.carouselData = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const loadGoods = () => {
  request.get("/goods/selectAll").then(res => {
    if (res.code === '200') {
      data.goodslData = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}

onMounted(() => {
  loadCarousel()
  loadGoods()
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
