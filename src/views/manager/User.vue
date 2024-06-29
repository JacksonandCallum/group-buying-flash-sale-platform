<template>
    <div class="box">
        <el-input style="width: 240px; margin-right: 10px" v-model="data.username" placeholder="请输入账号查询"></el-input>
        <el-button type="primary" plain @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
    </div>

    <div class="box">
        <el-button type="primary" plain @click="handleAdd">新增</el-button>
        <el-button type="info" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="box" style="margin-bottom: 5px">
        <el-table :data="data.tableData" stripe @selection-change="handleSelectChange">
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column prop="avatar" label="头像"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column label="操作" header-align="center" width="260">
                <template #default="scope">
                    <el-button plain type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button plain type="primary" @click="handlePassword(scope.row)">修改密码</el-button>
                    <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="box" v-if="data.total">
        <el-pagination background layout="total,prev,pager,next" :total="data.total" v-model:current-page='data.pageNum'
            v-model:page-sizes="data.pageSize" @current-change="load"></el-pagination>
    </div>

    <el-dialog v-model="data.formVisible" title="用户信息" width="40%" destroy-on-close>
        <el-form :model="data.form" ref="formRef" :rules="data.rules" label-width="70px" style="padding: 20px;">
            <el-form-item label="账号" prop="username">
                <el-input v-model="data.form.username" autocomplete="off" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="data.form.password" autocomplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="data.form.name" autocomplete="off" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select v-model="data.form.role" style="width: 100%;" placeholder="请选择角色">
                    <el-option value="ADMIN" label="管理员"></el-option>
                    <el-option value="USER" label="用户"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="data.form.phone" autocomplete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="data.form.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="data.formVisible = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="data.formVisible1" title="修改密码" width="40%" destroy-on-close>
        <el-form :model="data.form" ref="formRef1" :rules="data.rules1" label-width="80px" style="padding: 20px;">
            <el-form-item label="新密码" prop="newPassword">
                <el-input show-password v-model="data.form.newPassword" autocomplete="off"
                    placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="comfirmPassword">
                <el-input show-password v-model="data.form.comfirmPassword" autocomplete="off"
                    placeholder="请确认密码"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="data.formVisible1 = false">取消</el-button>
            <el-button type="primary" @click="savePassword">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import request from "@/utils/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const validatePass = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请确认密码'))
    } else if (value !== data.form.newPassword) {
        callback(new Error("确认密码与原密码不匹配!"))
    } else {
        callback()
    }
}

const data = reactive({
    username: "",
    tableData: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    formVisible: false,
    formVisible1: false,
    form: {},
    ids: [],
    rules: {
        username: [
            { required: true, message: "请输入账号", trigger: 'blur' }
        ],
        password: [
            { required: true, massage: "请输入密码", trigger: 'blur' }
        ],
        role: [
            { required: true, message: "请选择角色", trigger: 'change' }
        ]
    },
    rules1: {
        newPassword: [
            { required: true, message: "请输入新密码", trigger: 'blur' }
        ],
        comfirmPassword: [
            { required: true, validator: validatePass, trigger: 'blur' }
        ]
    }
});

const formRef = ref()
const formRef1 = ref()

const load = () => {
    request
        .get("/user/selectPage", {
            params: {
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                username: data.username,
            },
        })
        .then((res) => {
            data.tableData = res.data.list
            data.total = res.data.total
        });
};

onMounted(() => {
    load();
});

const reset = () => {
    data.username = null
    load()
}

const handleEdit = (row) => {
    data.form = JSON.parse(JSON.stringify(row))
    data.formVisible = true
}

const del = (id) => {
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/user/delete/" + id).then(res => {
            if (res.code === '200') {
                ElMessage.success("删除成功")
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(err => { })
}

const handleAdd = () => {
    data.form = {}
    data.formVisible = true
}

const add = () => {
    request.post("/user/add", data.form).then(res => {
        if (res.code === '200') {
            ElMessage.success("保存成功")
            data.formVisible = false
            load()
        } else {
            ElMessage.error(res.msg)
        }
    })
}

const update = () => {
    request.put("/user/update", data.form).then(res => {
        if (res.code === '200') {
            ElMessage.success("修改成功")
            data.formVisible = false
            load()
        } else {
            ElMessage.error(res.msg)
        }
    })
}

const save = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            if (data.form.id) {
                update()
            } else {
                add()
            }
        }
    })
}

const savePassword = () => {
    formRef1.value.validate((valid) => {
        if (valid) {
            request.put("/web/updatePassword", data.form).then(res => {
                if (res.code === '200') {
                    ElMessage.success("修改成功")
                    data.formVisible1 = false
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })
}

const handlePassword = (row) => {
    data.form = JSON.parse(JSON.stringify(row))
    data.formVisible1 = true
}

const handleSelectChange = (value) => {
    data.ids = value.map(v => v.id)
    console.log(data.ids)
}

const delBatch = () => {
    if (data.ids.length === 0) {
        ElMessage.warning("请选择数据")
        return
    }
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/user/deleteBatch", { data: data.ids }).then(res => {
            if (res.code === '200') {
                ElMessage.success("删除成功")
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(err => { })

}
</script>
