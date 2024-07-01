<template>
    <div class="card" style="width: 50%">
        <el-form :model="data.form" ref="formRef" :rules="data.rules" label-width="80px" style="padding: 20px">
            <el-form-item label="原密码" prop="password">
                <el-input show-password v-model="data.form.password" autocomplete="off" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input show-password v-model="data.form.newPassword" autocomplete="off" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input show-password v-model="data.form.confirmPassword" autocomplete="off" placeholder="请确认密码" />
            </el-form-item>
            <div style="text-align: center">
                <el-button type="primary" @click="save">保 存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import request from "@/utils/request.js";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";

const validatePass = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请确认新密码'))
    } else if (value !== data.form.newPassword) {
        callback(new Error("确认密码与原密码不匹配!"))
    } else {
        callback()
    }
}

const formRef = ref()

const data = reactive({
    user: JSON.parse(localStorage.getItem('flash-sale-user') || '{}'),
    form: {},
    rules: {
        password: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
            { validator: validatePass, trigger: 'blur' }
        ]
    }
})

const save = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            data.form.username = data.user.username
            request.put('/web/updatePassword', data.form).then(res => {
                if (res.code === '200') {
                    ElMessage.success('修改密码成功')
                    router.push('/login')
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })
}

</script>