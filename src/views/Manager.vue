<template>
    <div class="manager-container">
        <div class="manager-header">
            <div class="manager-header-left">
                <!-- 标题和Logo -->
                <img src="@/assets/imgs/logo.png" alt="">
                <div class="title">团购秒杀后台</div>
            </div>
            <div class="manager-header-center">
                <!-- 面包屑 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item to="/manager/home">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ router.currentRoute.value.meta.name }}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="manager-header-right">
                <!-- 右侧头像和用户名 -->
                <el-dropdown style="cursor: pointer;">
                    <div style="padding-right: 20px; display: flex; align-items: center;">
                        <img v-if="data.user" :src="data.user?.avatar" alt=""
                            style="width: 40px; height: 40px; display: block; border-radius: 50%">
                        <img v-else src="@/assets/imgs/avatar.png" alt=""
                            style="width: 40px; height: 40px; display: block; border-radius: 50%">
                        <span style="margin-left: 5px">{{ data.user?.username }}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click.native="router.push('/manager/person')">个人资料</el-dropdown-item>
                            <el-dropdown-item @click.native="router.push('/manager/password')">修改密码</el-dropdown-item>
                            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>

        <div style="display: flex">
            <div class="manager-main-left">
                <!-- 菜单区域 -->
                <el-menu :default-active="router.currentRoute.value.path" :default-openeds="['/manager/home', 'info']"
                    router>
                    <el-menu-item index="/manager/home">
                        <el-icon><home-filled /></el-icon>
                        <span>系统首页</span>
                    </el-menu-item>
                    <el-sub-menu index="info">
                        <template #title>
                            <el-icon>
                                <UserFilled />
                            </el-icon>
                            <span>信息管理</span>
                        </template>
                        <el-menu-item index="/manager/user">用户信息</el-menu-item>
                        <el-menu-item index="/manager/logs">日志信息</el-menu-item>
                        <el-menu-item index="/manager/category">商品分类</el-menu-item>
                        <el-menu-item index="/manager/goods">商品管理</el-menu-item>
                        <el-menu-item index="/manager/carousel">广告信息</el-menu-item>
                        <el-menu-item index="/manager/orders">订单信息</el-menu-item>
                        <el-menu-item index="/manager/comment">评价信息</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>

            <div class="manager-main-right">
                <!-- 内容区域 -->
                <router-view @updateUser="updateUser" />
            </div>
        </div>

    </div>
</template>

<script setup>
import router from '@/router/index.js';
import { reactive } from "vue"

const data = reactive({
    user: JSON.parse(localStorage.getItem("flash-sale-user" || '{}'))
})

const logout = () => {
    localStorage.removeItem("flash-sale-user");
    location.href = '/login'
}

const updateUser = () => {
    data.user = JSON.parse(localStorage.getItem('flash-sale-user') || '{}')   // 重新获取下用户的最新信息
}
</script>

<style scoped>
@import "@/assets/css/manager.css";
</style>