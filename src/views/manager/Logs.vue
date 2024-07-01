<template>
    <div class="box">
        <el-input style="width: 240px; margin-right: 10px" v-model="data.operate" placeholder="请根据操作查询"></el-input>
        <el-button type="primary" plain @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
    </div>

    <div class="box">
        <el-button type="info" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="box" style="margin-bottom: 5px">
        <el-table :data="data.tableData" stripe @selection-change="handleSelectChange">
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column prop="module" label="模块"></el-table-column>
            <el-table-column prop="operate" label="操作"></el-table-column>
            <el-table-column prop="userName" label="操作人"></el-table-column>
            <el-table-column prop="ip" label="ip"></el-table-column>
            <el-table-column prop="time" label="操作时间"></el-table-column>
            <el-table-column label="操作" header-align="center" width="260">
                <template #default="scope">
                    <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="box" v-if="data.total">
        <el-pagination background layout="total,prev,pager,next" :total="data.total" v-model:current-page='data.pageNum'
            v-model:page-sizes="data.pageSize" @current-change="load"></el-pagination>
    </div>
</template>

<script setup>
import request from "@/utils/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const data = reactive({
    user: JSON.parse(localStorage.getItem("flash-sale-user") || '{}'),
    operate: null,
    tableData: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    ids: [],
    
});

const load = () => {
    request
        .get("/logs/selectPage", {
            params: {
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                operate: data.operate,
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
    data.operate = null
    load()
}

const del = (id) => {
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/logs/delete/" + id).then(res => {
            if (res.code === '200') {
                ElMessage.success("删除成功")
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(err => { })
}

const handleSelectChange = (value) => {
    data.ids = value.map(v => v.id)
}

const delBatch = () => {
    if (data.ids.length === 0) {
        ElMessage.warning("请选择数据")
        return
    }
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/logs/deleteBatch", { data: data.ids }).then(res => {
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
