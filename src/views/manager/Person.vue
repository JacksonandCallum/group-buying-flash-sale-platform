<template>
    <div class="card" style="width: 50%">
        <el-form :model="data.form" ref="formRef" label-width="70px" style="padding: 20px">
            <div style="text-align: center; margin-bottom: 20px">
                <el-upload class="avatar-uploader" :action="fileUploadUrl" :show-file-list="false"
                    :headers="{ flashsaletoken: data.form.token }" :on-success="handleAvatarSuccess">
                    <img v-if="data.form.avatar" :src="data.form.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </div>
            <el-form-item label="账号" prop="username">
                <el-input disabled v-model="data.form.username" autocomplete="off" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="data.form.name" autocomplete="off" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="data.form.phone" autocomplete="off" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="data.form.email" autocomplete="off" placeholder="请输入邮箱" />
            </el-form-item>
            <div style="text-align: center">
                <el-button type="primary" @click="save">保 存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import request from "@/utils/request.js";
import { ElMessage } from "element-plus";

const fileUploadUrl = import.meta.env.VITE_BASE_URL + '/files/upload'

const data = reactive({
    form: JSON.parse(localStorage.getItem('flash-sale-user') || '{}'),
})

const handleAvatarSuccess = (res) => {
    data.form.avatar = res.data
}

const emit = defineEmits(['updateUser'])

const save = () => {
    request.put('/user/update', data.form).then(res => {
        if (res.code === '200') {
            ElMessage.success('保存成功')
            // 更新缓存
            localStorage.setItem('flash-sale-user', JSON.stringify(data.form))
            emit('updateUser')
        } else {
            ElMessage.error(res.msg)
        }
    })
}

</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #ccc;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar {
    width: 150px;
    height: 150px;
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: center;
}
</style>