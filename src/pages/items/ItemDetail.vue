<template>
  <el-row>
    <el-col :span="6">&nbsp;</el-col>
    <el-col :span="12">
      <span class="subTopic">商品详情：</span>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品标题">
          <el-input v-model="form.itemName"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="form.itemDesc"></el-input>
        </el-form-item>
        <el-form-item label="吊牌价">
          <span>{{form.listPrice}}</span>
        </el-form-item>
        <el-form-item label="现价">
          <span>{{form.discountPrice}}</span>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="form.itemGroup1">
            <el-option label="上装" value="上装"></el-option>
            <el-option label="下装" value="下装"></el-option>
            <el-option label="套装" value="套装"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span class="subTopic">商品图片：</span>
      <span style="display: block">尺寸1：1</span>
      <div class="box">
        <div v-for="(item,key) in form.picMap[1]" class="pic">
          <img :src="item.picUrl" alt="" width="150" height="150">
        </div>
      </div>
      <span style="display: block">尺寸7：10</span>
      <div class="box">
        <div v-for="(item,key) in form.picMap[3]" class="pic">
          <img :src="item.picUrl" alt="" width="140" height="200">
        </div>
      </div>
      <div class="box" style="padding-top:20px;"><span>所属分区:{{form.regionNames}}</span></div>
      <div style="text-align: center;padding-top:5px;">
        <el-button type="primary" @click.native="submitChanges">保存</el-button>
      </div>
    </el-col>
    <el-col :span="6">&nbsp;</el-col>
  </el-row>
</template>

<script>
  import spApi from '../../api/sp';
  import { mapGetters } from 'vuex'
  export default {
      data() {
          return {
              form:{},
              itemId:''
          }
      },
      computed: {
        ...mapGetters({
          selectCompanyInfo: 'getSelectCompanyInfo',
        }),
      },
      methods:{
//          获取当前编辑商品的信息
          getItemDetail(id){
              spApi.getItemInfo(id,this.selectCompanyInfo.companyCode).then(rst=>{
                this.form = rst.data;
            })
          },
          submitChanges(){
              let postData = {
                  id:this.form.id,
                  itemDesc:this.form.itemDesc,
                  itemGroup1:this.form.itemGroup1,
                  itemName:this.form.itemName
              };
              spApi.updateItem(postData).then(rst=>{
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  duration: 1000,
                  type: 'success'
                });
                  this.$router.push({path:'/sp/items/list'})
              }).catch(err=>{
                  this.$notify.error({
                  title: '失败',
                  message: '保存失败',
                  duration: 1000
                });
              })
          }
      },
      mounted(){
          this.itemId = this.$route.query.id;
          this.getItemDetail(this.itemId);
      }
  }
</script>

<style>
  .subTopic{
    font-size: 20px;
    display: inline-block;
    margin: 10px 0;
  }
  .box{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content:space-between;
  }
  .pic{
    margin:10px
  }
</style>
