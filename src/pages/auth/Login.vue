<template>
  <div>
    <div>
       <span class="login"></span>
    </div>
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="loginForm.account" auto-complete="new-password" placeholder="账号" @keyup.native.enter="doLogin"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="loginForm.checkPass" auto-complete="new-password" placeholder="密码" @keyup.native.enter="doLogin"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" ref="btSubmit" :loading="logining"  @click="doLogin">登录</el-button>
        <!--<el-button @click.native.prevent="doReset">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import { mapActions } from 'vuex'
  import { requestLogin } from '../../api/api';
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: '',
          checkPass: ''
        },
        loginRules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      ...mapActions(['signIn']),
      doReset() {
        this.$refs.loginForm.resetFields();
      },
      getCookieInfo: function () {
        let userStr = this.$cookie.get('CRM_RECENT_USER');
        if (userStr) {
          let user = JSON.parse(userStr);
          if (user && user.name) {
            this.loginForm.account = user.name;
          }
          if (user && user.pass && this.checked){
            this.loginForm.checkPass = user.pass;
          }
        }
      },
      setCookieInfo: function (user) {
        let userStr = {name: user.username, pass: ''};
        if (this.checked) { userStr.pass = user.password;}
        // cookie 失效 7 天
        this.$cookie.set('CRM_RECENT_USER', JSON.stringify(userStr), {expires: 7})
      },
      doLogin(ev) {
        var _this = this;
        this.$refs.loginForm.validate((valid) =>  {
          if (valid) {
            this.logining = true;
            let loginInfo = {username: this.loginForm.account,  password: this.loginForm.checkPass};
            this.signIn(loginInfo).then((u)=>{
              _this.setCookieInfo(loginInfo);
              this.logining = false;
              this.$router.push({ path: '/main' });
            }).catch((e) => {
              this.logining = false;
              this.$notify({
                title: '错误',
                message: e.message,
                type: 'error'
              });
            })
          } else {
            return false;
          }
        });
      }
    },
    mounted (){
      this.getCookieInfo()
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .login {
    display: inline-block;
    width: 300px;
    height: 80px;
    background: url("../../assets/img/auth/logo.png") no-repeat fixed 50px 30px;
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
