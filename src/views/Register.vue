<template>
  <div class="login-container">
    <div class="login-box">
      <div
        style="
          font-weight: bold;
          font-size: 24px;
          text-align: center;
          margin-bottom: 30px;
          color: #ea5455;
        "
      >
        欢 迎 注 册
      </div>
      <el-form :model="data.form" ref="formRef" :rules="data.rules">
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            size="large"
            v-model="data.form.username"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            size="large"
            v-model="data.form.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            :prefix-icon="Lock"
            size="large"
            v-model="data.form.confirmPassword"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="large"
            type="primary"
            style="
              width: 100%;
              background-color: #ea5455;
              border-color: #ea5455;
            "
            @click="register"
            >注 册</el-button
          >
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        已有账号？请 <a style="color: orangered" href="/login">登录</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";

const validatePass = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请确认密码"));
  } else if (value !== data.form.password) {
    callback(new Error("确认密码与原密码不匹配!"));
  } else {
    callback();
  }
};

const data = reactive({
  form: {},
  rules: {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    confirmPassword: [{ validator: validatePass, trigger: "blur" }],
  },
});

const formRef = ref();

const register = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      //  valid 是 true表示表单验证通过
      alert("调用后台发起注册");
    } else {
      alert("表单验证不通过");
    }
  });
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(135deg, #feb692 10%, #ea5455 100%);
}
.login-box {
  width: 350px;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
