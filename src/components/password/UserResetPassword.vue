<template>
  <el-form :model="resetFrom" label-width="100px" :rules="resetFromRules" ref="resetFrom">
    <el-form-item label="旧密码" prop="oldPassword" v-if="resetPass !== 'resetPass' ">
      <el-input v-model="resetFrom.oldPassword" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="resetFrom.password" type="password" placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="再输一次" prop="checkPassword">
      <el-input v-model="resetFrom.checkPassword" type="password" placeholder="请再次输入密码"></el-input>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="submit()">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      userId: {
        type: String,
        required: true
      },
      account: {
        type: String,
        required: true
      },
      resetPass: {
        type: String,
        default: 'resetPass'
      }
    },
    data () {
      let validateOldPass = (rule, value, callback) => {
        if (this.resetPass === 'new' && value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.resetFrom.password !== '') {
            this.$refs.resetFrom.validateField('password');
          }
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.resetFrom.checkPassword !== '') {
            this.$refs.resetFrom.validateField('checkPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.resetFrom.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        resetFrom: {
          oldPassword: '',
          password: '',
          checkPassword: ''
        },
        resetFromRules:{
          oldPassword: [
            { validator: validateOldPass, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      cancel: function () {
        this.$refs.resetFrom.resetFields();
        this.$emit('submitDone', {status: 0, message: '取消'});
      },
      submit: function () {
        let _self = this;
        this.$refs["resetFrom"].validate((valid) => {
          if (valid) {
            let params = {
              userId: _self.userId,
              account: _self.account,
              password: _self.resetFrom.password,
              checkPassword: _self.resetFrom.checkPassword
            };
            if (_self.resetPass === 'new'){
              params['oldPassword'] = _self.resetFrom.oldPassword;
              if (_self.resetFrom.oldPassword === _self.resetFrom.password){
                _self.$message.error('新密码和旧密码不能相同');
                return;
              }
            }
            _self.$fetch.post('/crm/api/user/reset-user-pwd', params).then((res)=>{
              this.$refs.resetFrom.resetFields();
              _self.$emit('submitDone', {status: 1, message: '重置成功'});
            }).catch((e)=>{
              _self.$message.error(e.message);
            });
          } else {
            return false;
          }
        });
      }
    },
    mounted() {
    }
  };
</script>

<style lang="scss">

</style>
