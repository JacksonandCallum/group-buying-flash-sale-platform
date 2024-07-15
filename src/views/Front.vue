<template>
    <div>
        <!--头部-->
        <div class="front-header">
            <div class="front-header-left" @click="$router.push('/front/home')">
                <img src="@/assets/imgs/logo.png" alt="">
                <div class="title">团购秒杀平台</div>
            </div>
            <div class="front-header-center">
                <div class="front-header-nav" style="flex: 1">
                    <el-menu :default-active="router.currentRoute.value.path" mode="horizontal" router>
                        <el-menu-item index="/front/home">首页</el-menu-item>
                        <el-menu-item index="/front/group">团购专区</el-menu-item>
                        <el-menu-item index="/front/flash">秒杀专区</el-menu-item>
                        <el-menu-item index="/front/orders">订单中心</el-menu-item>
                        <el-menu-item index="/front/comment">评价中心</el-menu-item>
                        <el-menu-item index="/front/person">个人中心</el-menu-item>
                    </el-menu>
                </div>
                <div style="width: 300px; background-color: #e00b0b; height: 60px"
                    v-if="router.currentRoute.value.path === '/front/home'">
                    <el-input v-model="data.goodsName" style="width: 200px; margin-right: 5px"
                        placeholder="请输入商品名称"></el-input>
                    <el-button type="warning" @click="search">搜索</el-button>
                </div>
            </div>
            <div class="front-header-right">
                <div v-if="!data.user.username">
                    <el-button @click="router.push('/login')">登录</el-button>
                    <el-button @click="router.push('/register')">注册</el-button>
                </div>
                <div v-else>
                    <el-dropdown>
                        <div class="front-header-dropdown">
                            <img :src="data.user.avatar" alt="">
                            <div style="margin-left: 10px; color: white">
                                <span>{{ data.user.name }}</span>
                            </div>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <!--主体-->
        <div class="main-body" style="min-height: 550px">
            <router-view ref="child" @updateUser="updateUser" />
        </div>
        <div class="front-footer" style="padding: 10px 0">
            <div
                style="width: 70%; margin: 10px auto 0 auto; line-height: 30px; font-size: 14px; color: #93999F; text-align: center">
                <span style="color: #666666">友情链接：</span>
                <span style="margin-left: 10px"><a style="margin-left: 10px; color: #93999F"
                        href="https://github.com/JacksonandCallum" target="_blank">城北吕公</a></span>
            </div>
            <div style="text-align: center; line-height: 30px; font-size: 13px; color: #93999F">
                Copyright ©2024 团购秒杀平台 版权所有 <a style="margin-left: 10px; color: #93999F"
                    href="https://beian.miit.gov.cn/" target="_blank">xxxICP备 xxxxxx号-xx</a>
            </div>
        </div>
    </div>

</template>

<script setup>
import { reactive } from "vue";
import router from "@/router";
import { ElMessage } from "element-plus";

const data = reactive({
    user: JSON.parse(localStorage.getItem("flash-sale-user") || '{}'),
    goodsName: "",
})

const updateUser = () => {
    data.user = JSON.parse(localStorage.getItem('flash-sale-user') || '{}')   // 重新获取下用户的最新信息
}

// 退出登录
const logout = () => {
    localStorage.removeItem("flash-sale-user");
    router.push("/login");
}

const search = () => {
    if (data.goodsName) {
        location.href = '/front/goods?name=' + data.goodsName
    } else {
        ElMessage.info('请输入搜索内容')
    }
}
</script>

<style scoped>
@import "@/assets/css/front.css";
</style>