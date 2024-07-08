<template>
    <div class="box">
        <el-input style="width: 240px; margin-right: 10px" v-model="data.name" placeholder="请输入名称查询"></el-input>
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
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column label="操作" header-align="center" width="260">
                <template #default="scope">
                    <el-button plain type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="box" v-if="data.total">
        <el-pagination background layout="total,prev,pager,next" :total="data.total" v-model:current-page='data.pageNum'
            v-model:page-sizes="data.pageSize" @current-change="load"></el-pagination>
    </div>

    <el-dialog v-model="data.formVisible" title="分类信息" width="40%" destroy-on-close>
        <el-form :model="data.form" ref="formRef" :rules="data.rules" label-width="70px" style="padding: 20px;">
            <el-form-item label="名称" prop="name">
                <el-input v-model="data.form.name" autocomplete="off" placeholder="请输入名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="data.formVisible = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import request from "@/utils/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const data = reactive({
    user: JSON.parse(localStorage.getItem("flash-sale-user") || '{}'),
    name: "",
    tableData: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    formVisible: false,
    form: {},
    ids: [],
    rules: {
        name: [
            { required: true, message: "请输入名称", trigger: 'blur' }
        ],
    },
});

const formRef = ref()

const load = () => {
    request
        .get("/category/selectPage", {
            params: {
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                name: data.name,
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
    data.name = null
    load()
}

const handleEdit = (row) => {
    data.form = JSON.parse(JSON.stringify(row))
    data.formVisible = true
}

const del = (id) => {
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/category/delete/" + id).then(res => {
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
    request.post("/category/add", data.form).then(res => {
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
    request.put("/category/update", data.form).then(res => {
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
        request.delete("/category/deleteBatch", { data: data.ids }).then(res => {
            if (res.code === '200') {
                ElMessage.success("删除成功")
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(err => { })

}

const handleAvatarSuccess = (res) => {
    data.form.avatar = res.data;
}
</script>
