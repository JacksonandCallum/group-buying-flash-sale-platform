<template>
    <div class="box">
        <el-input style="width: 240px; margin-right: 10px" v-model="data.goodsName" placeholder="请输入商品名称查询"></el-input>
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
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="img" label="推荐图片">
                <template #default="scope">
                    <el-image v-if="scope.row.img" :src="scope.row.img" :preview-src-list="[scope.row.img]"
                        preview-teleported style="width: 100px; height: 60px"></el-image>
                </template>
            </el-table-column>
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

    <el-dialog v-model="data.formVisible" title="广告信息" width="40%" destroy-on-close>
        <el-form :model="data.form" ref="formRef" :rules="data.rules" label-width="100px" style="padding: 20px;">
            <el-form-item label="推荐商品" prop="goodsId">
                <el-select v-model="data.form.goodsId" style="width: 100%">
                    <el-option v-for="item in data.goodsList" :key="item.id" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="推荐图片" prop="img">
                <el-upload :action="fileUploadUrl" :headers="{ flashsaletoken: data.user.token }"
                    :on-success="handleImgSuccess">
                    <el-button type="primary">上传商品图片</el-button>
                </el-upload>
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
    goodsName: "",
    tableData: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    formVisible: false,
    form: {},
    ids: [],
    goodsList: [],
    rules: {
        goodsId: [
            { required: true, message: "请选择商品", trigger: 'blur' }
        ],
        img: [
            { required: true, message: "请上传图片", trigger: 'blur' }
        ],
    },
});

const formRef = ref()

const fileUploadUrl = import.meta.env.VITE_BASE_URL + '/files/upload'

const load = () => {
    request
        .get("/carousel/selectPage", {
            params: {
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                goodsName: data.goodsName,
            },
        })
        .then((res) => {
            data.tableData = res.data.list
            data.total = res.data.total
        });
};

const loadGoods = () => {
    request.get('/goods/selectAll').then(res => {
        data.goodsList = res.data
    })
}

onMounted(() => {
    load();
    loadGoods()
});

const reset = () => {
    data.goodsName = null
    load()
}

const handleEdit = (row) => {
    data.form = JSON.parse(JSON.stringify(row))
    data.formVisible = true
}

const del = (id) => {
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/carousel/delete/" + id).then(res => {
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
    request.post("/carousel/add", data.form).then(res => {
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
    request.put("/carousel/update", data.form).then(res => {
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
        request.delete("/carousel/deleteBatch", { data: data.ids }).then(res => {
            if (res.code === '200') {
                ElMessage.success("删除成功")
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(err => { })

}

const handleImgSuccess = (res) => {
    data.form.img = res.data
}
</script>
