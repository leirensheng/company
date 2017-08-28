<template>
  <el-dialog
    title="修改客户信息"
    :visible.sync="inputs.show"
    size="small">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="公司名称">
        <el-input v-model="form.companyName"></el-input>
      </el-form-item>
      <el-form-item label="公司简称">
        <el-input v-model="form.companyShortName"></el-input>
      </el-form-item>
      <!--<el-form-item label="公司编号">-->
        <!--<el-input v-model="form.companyCode"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="公众号类型">
        <el-radio-group v-model="form.wxMpPrivate">
          <el-radio :label="0">公用小优会</el-radio>
          <el-radio :label="1">使用客户自有公众号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="微信公众号ID" v-if="form.wxMpPrivate != 0">
        <el-input v-model="form.wxMpId"></el-input>
      </el-form-item>
      <el-form-item label="appSecret" v-if="form.wxMpPrivate != 0">
        <el-input v-model="form.appSecret"></el-input>
      </el-form-item>
      <el-form-item label="appID" v-if="form.wxMpPrivate != 0">
        <el-input v-model="form.appKey"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelSubmit()">取 消</el-button>
    <el-button type="primary" @click="submitForm(form)">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import sys from '../../../api/sys';

  export default {
    props:['inputs','form'],
    data() {
      return {
        dialogVisible:false
      }
    },
    methods:{
      submitForm(form) {
        this.inputs.show = false;
        sys.editCompany(form).then(rst=>{
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          });
          this.$emit('handleCreateUser', true);
        })
      },
      cancelSubmit() {
        this.inputs.show = false;
        this.$emit('handleUpdateUser', true);
      }
    },
    mounted() {

    }
  }
</script>

<style>

</style>
