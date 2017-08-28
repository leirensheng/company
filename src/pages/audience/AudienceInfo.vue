<template>
  <el-dialog title="会员详情" v-model="inputs.show" :close-on-click-modal="false" @open="onOpen">
    <b>基本信息</b>
    <el-form :model="infoForm" label-position="left" v-loading="formLoading" inline class="demo-table-expand">
      <el-form-item label="会员昵称:">
        <span>{{infoForm.nickName}}</span>
      </el-form-item>
      <el-form-item label="姓名:">
        <span>{{infoForm.fullName}}</span>
      </el-form-item>
      <el-form-item label="手机:">
        <span>{{infoForm.cellPhone}}</span>
      </el-form-item>
      <el-form-item label="性别:">
        <span>{{infoForm.gender|sex}}</span>
      </el-form-item>
      <el-form-item label="会员等级:">
        <template>
          <el-rate disabled v-model="infoForm.grade"></el-rate>
        </template>
      </el-form-item>
      <el-form-item label="激活日期:">
        <span>{{infoForm.activateDate|formatDate}}</span>
      </el-form-item>
      <el-form-item label="OpenID:">
      <span>{{infoForm.wechatOpenId}}</span>
      </el-form-item>
      <!--<el-form-item label="最近修改日期:">-->
        <!--<span>{{infoForm.updatedTime|formatDate}}</span>-->
      <!--</el-form-item>-->
    </el-form>

    <div>
      <b>会员标签</b>
      <el-form :model="infoForm" label-position="left" class="tag-table">
        <el-form-item>
          <template>
            <el-tag v-for="tag in infoForm.audTags" key="" class="tag">{{tag}}</el-tag>
          </template>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <b>人群标签</b>
      <el-form :model="infoForm" label-position="left" class="tag-table">
        <el-form-item>
          <template>
            <el-tag v-for="list in infoForm.lists" key="" class="tag">{{list}}</el-tag>
          </template>
        </el-form-item>
      </el-form>
    </div>

    <!--<div v-for="tag in infoForm.tags">-->
    <!--<b>{{tag.label}}</b>-->
    <!--<el-form :model="infoForm" label-position="left" class="tag-table">-->
      <!--<el-form-item>-->
        <!--<template>-->
          <!--<el-tag v-for="t in tag.values" key="" class="tag">{{t}}</el-tag>-->
        <!--</template>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</div>-->

    <div slot="footer" class="dialog-footer">
      <el-button @click.native="inputs.show = false">关闭</el-button>
    </div>
  </el-dialog>
</template>


<script>

  import AudienceApi from 'src/api/audience';

  export default {
    props: ['inputs'],
    data() {
      return {
        formLoading:false,
        infoForm:{
          nickName:'',
          fullName:'',
          cellPhone:'',
          gender:'',
          grade:'',
          activateDate:'',
          initialDate:'',
          updatedTime:'',
          audTags: '',
          tags:[],
          lists: []
        }
      }
    },
    methods:{
      onOpen: function(){
        this.infoForm.tags=[];
        Object.assign(this.infoForm, this.inputs.data);
        let audTags = this.infoForm.audTags;
        this.getAudienceLists(this.inputs.data.companyCode, this.inputs.data.id);

//        this.getAudienceInfo(this.inputs.data.cellPhone);
      },
      getAudienceLists(companyCode, audienceId){
        this.formLoading = true;
        AudienceApi.getAudienceLists(companyCode, audienceId).then(res=>{
          this.infoForm.audTags=res.audTag || [];
          this.infoForm.lists=res.listTag || [];
          this.formLoading = false;
        }).catch(e => {
          this.formLoading = false;
//          this.infoForm.audTags = ["性别:男", "年龄:45~50岁", "星座:射手座", "品类:T恤", "尺码:XL", "流行:大众流行", "年购物频次:1次", "年消费金额:0-39元"];
//          this.infoForm.lists = ["低价值", "不活跃会员"];
        });
      },
      getAudienceInfo(cellPhone){
        this.formLoading = true;
        AudienceApi.getAudienceInfo(cellPhone).then(res=>{
          this.infoForm.tags=res;
          this.formLoading = false;
        }).catch(e => {
          this.formLoading = false;
        });
      }
    },
    mounted(){
    }
  }

</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
    border-top: 2px solid lightgray;
    margin-bottom: 5px;
  }
  .demo-table-expand label {
    width: 90px;
    /*color: #99a9bf;*/
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .tag-table{
    border-top: 2px solid lightgray;
    margin-bottom: 5px;
  }
  .tag{
    margin-left: 10px;
  }
</style>
