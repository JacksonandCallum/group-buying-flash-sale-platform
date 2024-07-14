<template>
    <div>
        <div class="box">
            <el-input style="width: 240px; margin-right: 10px" v-model="data.orderNo"
                placeholder="请输入订单编号查询"></el-input>
            <el-button type="primary" plain @click="load">查询</el-button>
            <el-button type="info" plain @click="reset">重置</el-button>
        </div>

        <div class="box">
            <el-button type="info" plain @click="delBatch">批量删除</el-button>
        </div>

        <div class="box" style="margin-bottom: 5px">
            <el-table :data="data.tableData" stripe @selection-change="handleSelectChange">
                <el-table-column type="selection" width="30"></el-table-column>
                <el-table-column prop="id" label="id"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="goodsImg" label="商品图片">
                    <template #default="scope">
                        <el-image v-if="scope.row.goodsImg" :src="scope.row.goodsImg"
                            :preview-src-list="[scope.row.goodsImg]" preview-teleported
                            style="width: 55px; height: 55px"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsPrice" label="商品单价"></el-table-column>
                <el-table-column prop="num" label="购买数量"></el-table-column>
                <el-table-column prop="total" label="商品总价"></el-table-column>
                <el-table-column prop="orderNo" label="订单编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="payNo" label="支付编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="payTime" label="支付时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="userName" label="下单人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="订单状态">
                    <template #default="scope">
                        <el-tag type="danger" v-if="scope.row.status === 'CANCEL'">已取消</el-tag>
                        <el-tag type="primary" v-if="scope.row.status === 'NOT_PAY'">待支付</el-tag>
                        <el-tag type="primary" v-if="scope.row.status === 'IN_GROUP'">拼团中</el-tag>
                        <el-tag type="primary" v-if="scope.row.status === 'NOT_SEND'">待发货</el-tag>
                        <el-tag type="primary" v-if="scope.row.status === 'NOT_ACCEPT'">待收货</el-tag>
                        <el-tag type="success" v-if="scope.row.status === 'DONE'">已完成</el-tag>
                        <el-tag type="danger" v-if="scope.row.status === 'REFUND_DONE'">已退款</el-tag>
                        <el-tag type="success" v-if="scope.row.status === 'COMMENT_DONE'">已评价</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="订单类型">
                    <template #default="scope">
                        <span v-if="scope.row.type === 'COMMON'">普通</span>
                        <span v-if="scope.row.type === 'GROUP'">团购</span>
                        <span v-if="scope.row.type === 'FLASH'">秒杀</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" width="260">
                    <template #default="scope">
                        <el-button plain type="primary" @click="update(scope.row)">发货</el-button>
                        <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="box" v-if="data.total">
            <el-pagination background layout="total,prev,pager,next" :total="data.total"
                v-model:current-page='data.pageNum' v-model:page-sizes="data.pageSize"
                @current-change="load"></el-pagination>
        </div>
    </div>
</template>

<script setup>
import request from "@/utils/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const data = reactive({
    user: JSON.parse(localStorage.getItem("flash-sale-user") || '{}'),
    orderNo: "",
    tableData: [],
    pageNum: 1,
    pageSize: 10,
    total: 0,
    ids: [],
});

const load = () => {
    request
        .get("/orders/selectPage", {
            params: {
                pageNum: data.pageNum,
                pageSize: data.pageSize,
                orderNo: data.orderNo,
            },
        })
        .then((res) => {
            data.tableData = res.data.list
            data.total = res.data.total
        });
};


onMounted(() => {
    load()
});

const reset = () => {
    data.orderNo = null
    load()
}

const del = (id) => {
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/orders/delete/" + id).then(res => {
            if (res.code === '200') {
                ElMessage.success("删除成功")
                load()
            } else {
                ElMessage.error(res.msg)
            }
        })
    }).catch(err => { })
}

const update = (row) => {
    row.status = "NOT_ACCEPT"  // 修改状态为待收货
    request.put("/orders/update", row).then(res => {
        if (res.code === '200') {
            ElMessage.success("发货成功")
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
}

const delBatch = () => {
    if (data.ids.length === 0) {
        ElMessage.warning("请选择数据")
        return
    }
    ElMessageBox.confirm("删除后数据无法恢复，您确定删除吗？", "删除确认", { type: 'warning' }).then(response => {
        request.delete("/orders/deleteBatch", { data: data.ids }).then(res => {
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