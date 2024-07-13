<template>
    <div v-html="data.content"></div>
</template>

<script setup>
import router from "@/router/index.js";
import { reactive } from "vue";

let baseURL = import.meta.env.VITE_BASE_URL;
let orderNo = router.currentRoute.value.query.orderNo;
const user = JSON.parse(localStorage.getItem("flash-sale-user") || "{}");

const data = reactive({
    content: "",
});

let xhr = new XMLHttpRequest();
xhr.open("GET", baseURL + "/alipay/pay?orderNo=" + orderNo, true);
xhr.setRequestHeader("flashsaletoken", user.token);
xhr.send();

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        data.content = xhr.responseText;
        setTimeout(() => {
            // console.log(document.getElementsByName('punchout_form'))
            document.getElementsByName("punchout_form")[0].submit();
        }, 50);
    }
};
</script>
