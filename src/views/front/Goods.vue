<template>
  <div style="width: 80%;margin: 2px auto">
    <div style="margin-top: 20px;">
      <el-input style="width: 350px; margin-right: 10px" v-model="data.name" placeholder="请输入名称查询" clearable
        @clear="reset"></el-input>
      <el-button type="primary" plain @click="load">搜索</el-button>
    </div>
    <div style="margin-top: 10px;">
      <el-tag type="primary" size="large" style="margin-right: 10px;cursor: pointer;" v-for="item in data.categoryData"
        @click="changeCategory(item.id)">{{ item.name
        }}</el-tag>
    </div>
    <div style="margin-top: 10px;">
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

    <div v-if="data.total">
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
  name: router.currentRoute.value.query.name,
  pageNum: 1,
  pageSize: 10,
  total: 0,
  categoryId: "",
  goodsData: [],
  categoryData: []
})

const load = () => {
  request
    .get("/goods/selectPage", {
      params: {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        name: data.name,
        categoryId: data.categoryId,
        hasFlash: false,
        hasGroup: false
      },
    })
    .then((res) => {
      data.goodsData = res.data.list
      data.total = res.data.total
    });
};

const loadCategory = () => {
  request.get("/category/selectAll").then(res => {
    if (res.code === '200') {
      data.categoryData = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const reset = () => {
  data.name = ""
  load()
}

const changeCategory = (id) => {
  data.categoryId = id
  load()
}

const navTo = (url) => {
  location.href = url
}

onMounted(() => {
  load()
  loadCategory()
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
