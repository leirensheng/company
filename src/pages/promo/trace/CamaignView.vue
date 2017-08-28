<template>
  <div class="campaign-view">
    <el-form label-width="110px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="活动目的:">
            <span >{{inputs.tpCategory | lookup('TPCategoriesType')}}</span>
          </el-form-item>
        </el-col >
        <el-col :span="10">
          <el-form-item label="活动形式:">
            <span >{{inputs.tpType | lookup('TPType')}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="活动名称:">
            <span >{{inputs.campaignName}}</span>
          </el-form-item>
        </el-col >
        <el-col :span="10">
          <el-form-item label="活动分区:">
            <span >{{inputs.regionName}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="活动期间:">
            <span >{{inputs.startDate | formatDate('yyy-MM-dd')}} 至 {{inputs.endDate | formatDate('yyy-MM-dd')}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="活动时间段:">
            <span >{{inputs.startTime | empty}} 至 {{inputs.endTime | empty}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="周期类型:">
            <span >{{inputs.isPeriodic | lookup('PeriodicType')}}</span>
          </el-form-item>
        </el-col >
        <el-col :span="10">
          <el-form-item label="执行周期:">
            <span >{{inputs.scheduleStr | lookup('WeekType', methodName='getNameByJoinedCode')}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="发送渠道:">
            <span >{{inputs.sendVia | lookup('SendViaType', methodName='getNameByJoinedCode')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="发送时间:">
            <span >活动期间前{{inputs.noticePriorDays | empty('0')}}天的{{inputs.noticeTime |empty('00:00')}}点发送</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="活动状态:">
            <span >{{inputs.status | lookup('BAStatusType')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="活动发布时间:">
            <span >提前{{inputs.publishPriorDays}}天</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11">
          <el-form-item label="目标人群:">
            <span >{{crowdName.join(' ')}}</span>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
  </div>

</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import campaignApi from 'src/api/campaign';

  export default {
    props: ['inputs','companyCode'],
    data () {
      return {
        crowdName:[],
        usedTimes:0
      }
    },
    methods:{
      getTagData:function (companyCode) {
        let that = this;
        if(that.usedTimes === 0){
          that.usedTimes++;
          let params = {
            companyCode:companyCode
          };
          campaignApi.classifyListByCode(params).then((res)=>{
            if (res.errcode){
              this.$message.error(res.message);
            }else{
              let customCrowd=[];
              let standardCrowd=[];
              res.data.forEach(item => {
                if (item.code=='1'){  // code:1 标准人群
                  standardCrowd = item.children;
                }else {  // code:2 自定义人群
                  customCrowd = item.children;
                }
              });
              standardCrowd.forEach(index=>{
                if(that.inputs.standardChecked.includes(index.id)){
                  that.crowdName.push(index.name);
                }
              });
              customCrowd.forEach(index=>{
                if(that.inputs.standardChecked.includes(index.id)){
                  that.crowdName.push(index.name);
                }
              });
            }
          })
        } else {
          return false;
        }
      }
    },
    mounted() {

    },
    beforeUpdate() {
      this.getTagData(this.inputs.ownerCompany);
    }
  };
</script>

<style>
  .campaign-view .el-form-item {margin-bottom: 5px;}
</style>
