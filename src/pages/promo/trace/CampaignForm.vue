<template>
  <el-form :model="inputs" label-width="100px" ref="stepForm" :rules="stepOneRules" class="el-form-self">

    <el-form-item label="活动名称" prop="campaignName" min-width="120">
      <el-input v-model.trim="inputs.campaignName"></el-input>
    </el-form-item>
    <el-form-item label="活动描述" prop="campaignDesc" min-width="120">
      <el-input v-model.trim="inputs.campaignDesc"></el-input>
    </el-form-item>
    <el-form-item label="活动目的" prop="tpCategory">
      <el-select v-model="inputs.tpCategory" filterable @change="changeCategory">
        <el-option value="" label="请选择"></el-option>
        <el-option
          v-for="item in categoriesOptions"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="活动形式" prop="tpType">
      <el-select v-model="inputs.tpType" filterable >
        <el-option value="" label="请选择"></el-option>
        <el-option
          v-for="item in typeOptions"
          :key="item.Code"
          :label="item.DisplayName"
          :value="item.Code">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="周期类型" prop="isPeriodic">
      <el-radio-group v-model.trim="inputs.isPeriodic">
        <el-radio class="radio" label="0" name="periodic">一次性活动</el-radio>
        <el-radio class="radio" label="1" name="periodic">周期性活动</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="活动执行期间"  min-width="160" required>
      <el-col :span="12" prop="startDate">
        <el-date-picker type="date" placeholder="选择开始日期" v-model.trim="inputs.startDate" :editable=false style="width: 140px;"></el-date-picker>
      </el-col>
      <el-col :span="12" prop="endDate">
        <el-date-picker type="date" placeholder="选择结束日期" v-model.trim="inputs.endDate" :editable=false style="width: 140px;"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="执行周期" >
      <el-col :span="16" prop="weekList">
        <el-checkbox-group v-model="inputs.weekList" @change="handleCheckedChange">
          <el-checkbox v-for="week in weekOption" :label="week.Code" :key="week.Code" name="week" >{{week.DisplayName}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col :span="8">
        <el-checkbox :indeterminate="isIndeterminate" v-model="allCheck" @change="handleCheckAllChange">全选</el-checkbox>
      </el-col>
    </el-form-item>

    <el-form-item label="活动时间段">
        <el-col :span="12">
          <el-time-select v-model="inputs.startTime" :picker-options="{start: '00:00', step:'00:15', end:'23:45'}" minTime="00:00" :editable=false placeholder="活动开始时间" style="width: 140px;"></el-time-select>
        </el-col>
        <el-col :span="12">
          <el-time-select v-model="inputs.endTime" :picker-options="{start: '00:00', step:'00:15', end:'23:45'}" minTime="00:00" :editable=false placeholder="活动结束时间" style="width: 140px;"></el-time-select>
        </el-col>
    </el-form-item>

    <el-form-item label="活动发布时间" >
      <el-col :span="8" >
        提前&nbsp;
          <el-select placeholder="天数" style="width: 80px;" v-model="inputs.publishPriorDays" name="publishPriorDay" >
            <el-option value="0"  label="0" ></el-option>
            <el-option value="1"  label="1" ></el-option>
            <el-option value="2"  label="2" ></el-option>
            <el-option value="3"  label="3" ></el-option>
            <el-option value="4"  label="4" ></el-option>
            <el-option value="5"  label="5" ></el-option>
            <el-option value="6"  label="6" ></el-option>
            <el-option value="7"  label="7" ></el-option>
            <el-option value="8"  label="8" ></el-option>
            <el-option value="9"  label="9" ></el-option>
            <el-option value="10"  label="10" ></el-option>
            <el-option value="11"  label="11" ></el-option>
            <el-option value="12"  label="12" ></el-option>
            <el-option value="13"  label="13" ></el-option>
            <el-option value="14"  label="14" ></el-option>
            <el-option value="15"  label="15" ></el-option>
            <el-option value="16"  label="16" ></el-option>
            <el-option value="17"  label="17" ></el-option>
            <el-option value="18"  label="18" ></el-option>
            <el-option value="19"  label="19" ></el-option>
            <el-option value="20"  label="20" ></el-option>
            <el-option value="21"  label="21" ></el-option>
            <el-option value="22"  label="22" ></el-option>
            <el-option value="23"  label="23" ></el-option>
            <el-option value="24"  label="24" ></el-option>
            <el-option value="25"  label="25" ></el-option>
            <el-option value="26"  label="26" ></el-option>
            <el-option value="27"  label="27" ></el-option>
            <el-option value="28"  label="28" ></el-option>
            <el-option value="29"  label="29" ></el-option>
            <el-option value="30"  label="30" ></el-option>
          </el-select> 天
      </el-col>
    </el-form-item>
    <el-form-item label="发送渠道" prop="checkList">
      <el-checkbox-group v-model="inputs.sendList">
        <el-checkbox label="WeChat" name="send" disabled>公众号</el-checkbox>
        <el-checkbox label="APP" name="send" disabled>APP</el-checkbox>
        <el-checkbox label="SMS" name="send">短信</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="短信发送时间" >
      <el-col :span="8" prop="noticePriorDays">
        提前&nbsp;<el-select v-model="inputs.noticePriorDays" name="noticePriorDays" placeholder="天数" style="width: 80px;">
        <el-option value="0" label="0" ></el-option>
        <el-option value="1" label="1" ></el-option>
        <el-option value="2" label="2" ></el-option>
        <el-option value="3" label="3" ></el-option>
        <el-option value="4" label="4" ></el-option>
        <el-option value="5" label="5" ></el-option>
      </el-select> 天
      </el-col>
      <el-col :span="16"  prop="noticeTime">
        <el-time-select v-model="inputs.noticeTime" :picker-options="{start: '00:00', step:'00:15', end:'23:45'}" minTime="00:00" :editable=false placeholder="选择时间" style="width: 140px;"></el-time-select>
      </el-col>
    </el-form-item>

    <el-form-item label="需导购跟进">
      <el-select v-model="inputs.guideTrack" placeholder="请选择">
        <el-option key="1" label="否" :value="0"></el-option>
        <el-option key="2" label="是" :value="1"></el-option>
      </el-select>
    </el-form-item>


  </el-form>

</template>

<script>
  import lookup from 'supports/lookup';
  import campaignApi from 'src/api/campaign';
  export default {
    props:['inputs'], // {readonly}
      data (){
        return {
          isIndeterminate: true,
          allCheck: true,
          categoriesOptions:  [], // lookup.TPCategoriesType.getList(),
          typeOptions:lookup.TPType.getList(),
          weekOption:lookup.WeekType.getList(),
          stepOneRules:{
            tpCategory: [
              {type: 'string', required: true, message: '请选择活动目的', trigger: 'change'}
            ],
            tpType:[
              {type: 'string', required: true, message: '请选择活动类型', trigger: 'change'}
            ],
            campaignName: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
            ],
            startDate: [
              { type: 'date', required: true, message: '请选择活动开始日期', trigger: 'change' }
            ],
            endDate: [
              { type: 'date', required: true, message: '请选择活动结束日期', trigger: 'change' }
            ],
            weekList: [
              { type: 'array', required: true, message: '至少选择一个执行周期', trigger: 'change' }
            ],
            isPeriodic: [
              {type: 'string', required: true, message: '请选择周期类型', trigger: 'change'}
            ],
            noticePriorDays: [{type: 'string', required: true, message: '请选择执行时间', trigger: 'blur' }],
            noticeTime: [
              { type: 'string', required: true, message: '请选择执行时间', trigger: 'change' }
            ],
            sendSmsTime: [
              { type: 'string', required: true, message: '短信发送时间', trigger: 'blur' }
            ],
            campaignDesc: [
              {type: 'string', required: true, message: '请输入活动描述', trigger: 'blur'}
            ]
          },
          publishPriorList: [{label: '0', value: '0'},{label: '1', value: '1'}]
        }
      },
      methods: {
        handleCheckAllChange(event) {
          this.inputs.weekList = event.target.checked ? ['0', '1', '2','3','4','5','6'] : [];
          this.isIndeterminate = false;
        },
        handleCheckedChange(value) {
          let checkedCount = value.length;
          this.allCheck = checkedCount === this.weekOption.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekOption.length;
        },
        changeCategory (val) {
          this.$emit('editdone', val);
        },
        getCategoriesOptions(){
          campaignApi.getCategories({}).then((res)=>{
            if (!res.errcode){
              this.categoriesOptions = res.data
            }
          }).catch((err)=>{
            this.$message.error(err.message || "获取活动目的异常");
          });
        }
      },
      mounted (){
        this.getCategoriesOptions();
      }
  };

</script>

<style scoped>
  .el-form-self {padding-top: 10px;}
 .el-form-self .el-checkbox-group label.el-checkbox:first-child {margin-right: 10px;}
 .el-form-self .el-checkbox-group label.el-checkbox + label.el-checkbox {margin-right: 10px;margin-left: 0;}
</style>
