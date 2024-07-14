<template>
  <div style="width: 80%;margin: 2px auto">
    <el-carousel height="350px">
      <el-carousel-item v-for="item in data.carouselData" :key="item">
        <img :src="item.img" alt="" style="width: 100%; height: 350px">
      </el-carousel-item>
    </el-carousel>
    <!-- 秒杀、团购 -->
    <div style="margin-top: 20px;height: 350px;">
      <el-row :gutter="10">
        <el-col :span="8">
          <div style="background-color: #faf5f5;height: 350px;border-radius: 10px;padding: 10px 15px">
            <div style="line-height: 30px;height: 30px;font-size: 16px;font-weight: bold;">🔥火热秒杀</div>
            <div style="margin: 10px 0;height: 140px;" v-for="item in data.flashData">
              <el-row :gutter="10">
                <el-col :span="9">
                  <img :src="item.img" alt="" style="width: 135px;height: 135px;border-radius: 10px;">
                </el-col>
                <el-col :span="15">
                  <div class="ellipsis2" style="font-size: 17px;font-weight: bold;">{{ item.name }}</div>
                  <div style="margin-top: 5px;font-size: 16px;font-weight: bold;color: red;">秒杀价：￥{{ item.flashPrice }}
                  </div>
                  <div style="margin-top: 5px;color: red;">秒杀倒计时：23:35:21:8</div>
                  <div style="margin-top: 8px;">
                    <el-button type="danger" @click="navTo('/front/goodsDetail?id=' + item.id)">去秒杀</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <div style="background-color: #faf7f0;height: 350px;border-radius: 10px;padding: 10px 15px">
            <div style="line-height: 30px;height: 30px;font-size: 16px;font-weight: bold;">🔥热门团购</div>
            <el-carousel height="300px" direction="vertical" :interval='4000' style="border-radius: 10px"
              :pause-on-hover="false" indicator-position="none" @change="getGroup">
              <el-carousel-item style="padding: 10px 10px" v-for="it in data.pages" :key="it">
                <div style="padding: 5px 10px 5px 10px; display: flex; align-items: center"
                  v-for="item in data.groupData" :key="item">
                  <img :src="item.goodsImg" alt=""
                    style="height: 60px; width: 60px; border-radius: 10px; border: 1px solid #cccccc">
                  <div style="width: 240px; margin-left: 10px">
                    <div style="font-weight: bold; font-size: 17px" class="overflow">{{ item.goodsName }}</div>
                    <div style="margin-top: 10px; color: red; font-weight: bold">拼团价：￥{{ item.goodsPrice }}</div>
                  </div>
                  <div style="width: 180px; margin-left: 10px; display: flex; align-items: center">
                    <img :src="item.userAvatar" alt="" style="height: 50px; width: 50px; border-radius: 50%">
                    <div style="margin-left: 10px; flex: 1; width: 0" class="overflow">{{ item.userName }}</div>
                    <div style="margin-left: 5px; width: 90px" class="overflow">正在拼团中</div>
                  </div>
                  <div style="flex: 1; color: red">倒计时：23:34:21.8</div>
                  <div style="width: 80px; margin-left: 10px">
                    <el-button type="warning" style="background-color: #faa303"
                      @click="navTo('/front/GoodsDetail?id=' + item.goodsId + '&orderId=' + item.id)">我要参团</el-button>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 最新商品 -->
    <div style="margin-top: 30px;">
      <div style="display: flex;">
        <div style="flex: 1;font-weight: bold;font-size: 18px;">最新商品</div>
        <div style="width: 100px;text-align: right;cursor: pointer;" @click="navTo('/front/goods')">查看更多</div>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="5" v-for="item in data.goodsData" style="margin-bottom: 10px;">
          <img :src="item.img" alt="" style="width: 100%;height: 235px;border-radius: 10px;border: 1px solid #ccc;">
          <div class="overflow" style="font-size: 17px;font-weight: bold;color: #333;margin-top: 10px">{{ item.name }}
          </div>
          <div style="display: flex;align-items: center;font-size: 15px;font-weight: bold;color: red;margin-top: 5px;">
            <div style="flex: 1;">商品价格：￥{{ item.originPrice }}</div>
            <div style="width: 80px;"><el-button type="warning"
                @click="navTo('/front/goodsDetail?id=' + item.id)">去购买</el-button></div>
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
  goodsData: [],
  flashData: [],
  groupData: [],
  pages: 1
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
  request.get("/goods/selectPage", {
    params: {
      pageNum: 1,
      pageSize: 5,
      hasFlash: false,
      hasGroup: false
    }
  }).then(res => {
    if (res.code === '200') {
      data.goodsData = res.data?.list
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const loadFlash = () => {
  request.get("/goods/selectFlash", {
    params: {
      hasFlash: true,
      hasGroup: false
    }
  }).then(res => {
    if (res.code === '200') {
      data.flashData = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const loadGroup = (pageNum) => {
  request.get("/orders/selectGroupPage", {
    params: {
      type: "GROUP",
      pageNum: pageNum,
      pageSize: 4

    }
  }).then(res => {
    if (res.code === '200') {
      data.groupData = res.data.list
      data.pages = res.data.pages
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const navTo = (url) => {
  location.href = url
}

const getGroup = (index) => {
  loadGroup(index + 1)
}

onMounted(() => {
  loadCarousel()
  loadGoods()
  loadFlash()
  loadGroup(1)
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
