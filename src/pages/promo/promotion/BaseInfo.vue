<template>
    <el-form :model="inputs" label-width="120px" ref="createForm" :rules="baseInfoRules">
      <el-form-item label="活动大类" prop="tpClass">
        <el-select v-model="inputs.tpClass" filterable @change="changeClass" :disabled="inputs.id > 0">
          <el-option value="" label="请选择"></el-option>
          <el-option
            v-for="item in classOptions"
            :key="item.tpClass"
            :label="item.className"
            :value="item.tpClass">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动目的" prop="tpCategory">
        <el-select v-model="inputs.tpCategory" filterable :disabled="!isEdit">
          <el-option value="" label="请选择"></el-option>
          <el-option
            v-for="item in categoriesOptions"
            :key="item.tpCategory"
            :label="item.name"
            :value="item.tpCategory">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称" prop="campaignName" min-width="120">
        <el-input v-model.trim="inputs.campaignName" placeholder="请输入活动名称" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item label="活动描述" prop="campaignDesc" min-width="120">
        <el-input type="textarea" v-model="inputs.campaignDesc" :rows="2" placeholder="请输入活动描述" :disabled="!isEdit"></el-input>
      </el-form-item>

      <el-form-item label="活动分区" prop="regionId">
        <el-select v-model="inputs.regionId" filterable :disabled="!isEdit || inputs.id > 0">
          <el-option
            v-for="it in userRegion"
            :key="it.regionId"
            :label="it.regionName"
            :value="it.regionId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="活动细则" prop="desc">
        <el-input type="textarea" v-model="inputs.detailRules" :rows="4" placeholder="请输入活动细则" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item label="活动周期"  min-width="160" required>

        <el-col :span="12" prop="startDate">
          <el-date-picker type="date" placeholder="选择开始日期"
                          v-model="inputs.startDate"
                          :editable=false style="width: 140px;" :disabled="!isEdit || this.inputs.status === 55" :picker-options="pickerOptionsOne"></el-date-picker>
          <div style="display: inline-block;">
            <el-tooltip content="开始时间是活动开始日期的 00:00:00 " placement="bottom">
              <i class="el-icon-information" style="color: #ccc; font-size: 18px;"></i>
            </el-tooltip>
          </div>
        </el-col>
        <el-col :span="12" prop="endDate">
          <el-date-picker type="date" placeholder="选择截止日期"
                          v-model="inputs.endDate"
                          :editable=false style="width: 140px;" :disabled="!isEdit" :picker-options="pickerOptionsOne"></el-date-picker>
          <div style="display: inline-block;">
            <el-tooltip content="截止时间是活动结束日期的 23:59:59 " placement="bottom">
              <i class="el-icon-information" style="color: #ccc; font-size: 18px;"></i>
            </el-tooltip>
          </div>
        </el-col>
      </el-form-item>

      <el-form-item label="发布提前期" prop="publishPriorDays">
        <el-select placeholder="天数" style="width: 100px;" v-model="inputs.publishPriorDays" name="publishPriorDay" :disabled="!isEdit">
          <el-option :value="0"  label="0" ></el-option>
          <el-option :value="1"  label="1" ></el-option>
          <el-option :value="2"  label="2" ></el-option>
          <el-option :value="3"  label="3" ></el-option>
          <el-option :value="4"  label="4" ></el-option>
          <el-option :value="5"  label="5" ></el-option>
          <el-option :value="6"  label="6" ></el-option>
          <el-option :value="7"  label="7" ></el-option>
          <el-option :value="8"  label="8" ></el-option>
          <el-option :value="9"  label="9" ></el-option>
          <el-option :value="10"  label="10" ></el-option>
          <el-option :value="11"  label="11" ></el-option>
          <el-option :value="12"  label="12" ></el-option>
          <el-option :value="13"  label="13" ></el-option>
          <el-option :value="14"  label="14" ></el-option>
          <el-option :value="15"  label="15" ></el-option>
          <el-option :value="16"  label="16" ></el-option>
          <el-option :value="17"  label="17" ></el-option>
          <el-option :value="18"  label="18" ></el-option>
          <el-option :value="19"  label="19" ></el-option>
          <el-option :value="20"  label="20" ></el-option>
          <el-option :value="21"  label="21" ></el-option>
          <el-option :value="22"  label="22" ></el-option>
          <el-option :value="23"  label="23" ></el-option>
          <el-option :value="24"  label="24" ></el-option>
          <el-option :value="25"  label="25" ></el-option>
          <el-option :value="26"  label="26" ></el-option>
          <el-option :value="27"  label="27" ></el-option>
          <el-option :value="28"  label="28" ></el-option>
          <el-option :value="29"  label="29" ></el-option>
          <el-option :value="30"  label="30" ></el-option>
        </el-select> 天
      </el-form-item>

      <el-form-item label="活动优先级" min-width="120">
        <el-select placeholder="活动优先级" style="width: 100px;" v-model="inputs.priority" :disabled="!isEdit">
          <el-option :value="1"  label="1" ></el-option>
          <el-option :value="2"  label="2" ></el-option>
          <el-option :value="3"  label="3" ></el-option>
          <el-option :value="4"  label="4" ></el-option>
          <el-option :value="5"  label="5" ></el-option>
          <el-option :value="6"  label="6" ></el-option>
          <el-option :value="7"  label="7" ></el-option>
          <el-option :value="8"  label="8" ></el-option>
          <el-option :value="9"  label="9" ></el-option>
        </el-select>
        <div style="display: inline-block;">
          <el-tooltip content="优先级 1最高, 9最低！" placement="bottom">
            <i class="el-icon-information" style="color: #ccc;font-size: 18px;"></i>
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>

</template>

<script>
  import campaignApi from 'src/api/campaign';
  import $vx from 'supports/util/vx';
  import { mapGetters } from 'vuex';
  export default {
   props:['inputs', 'isEdit'],
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo: 'selectCompanyInfo'
      })
    },
    data () {
      return {
        userRegion: [{regionName: '测试1', regionId: 10001},{regionName: '测试2', regionId: 10002}],
        classOptions:  [],
        categoriesOptions:  [],
        pickerOptionsOne: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        baseInfoRules:{
          tpClass: [
            {type: 'string', required: true, message: '请选择活动大类', trigger: 'change'}
          ],
          tpCategory: [
            {type: 'string', required: true, message: '请选择活动目的', trigger: 'change'}
          ],
          campaignName: [
            {required: true, type: 'string', message: '请输入活动名称(16字内)', trigger: 'blur' , max: 16 },
          ],
          campaignDesc: [
            {required: true, type: 'string', message: '请输入活动描述(56字内)', trigger: 'blur' , max: 56 },
          ],
          startDate: [
            { type: 'date', required: true, message: '请选择活动执行开始日期', trigger: 'change' }
          ],
          endDate: [
            { type: 'date', required: true, message: '请选择活动执行截止日期', trigger: 'change' }
          ],
          publishPriorDays: [
            { type: 'number', required: true, message: '请选择活动发布提前天', trigger: 'change' }
          ],
          desc: [
            { type: 'string', required: false, message: '活动细则不能超过128字', trigger: 'change' , max: 128}
          ],
          regionId: [
            { type: 'string', required: true, message: '请选择活动分区', trigger: 'change' }
          ]
        },
      };
    },
    methods: {
      getClassList: function () {
        campaignApi.getTpClassList({}).then(res => {
          if (!res.errcode){
            this.classOptions = res.data;
          }
        })
      },
      changeClass: function (flag) {
        this.$emit('handleSelectClass', flag);
        campaignApi.getCampaignCategoriesList({flag: flag}).then(res =>{
          if (res.data && res.data.length > 0){
            this.categoriesOptions = res.data;
          };
        })
      },
      saveBtn: function () {
        this.$refs['createForm'].validate((valid) => {
          if (valid) {
            let param = Object.assign({}, this.inputs);
            // 设置结束时间为
            param.endDate = new Date($vx.date.format(new Date(param.endDate), 'yyyy-MM-dd') + ' 23:59:59').getTime();
            param.startDate = new Date($vx.date.format(new Date(param.startDate), 'yyyy-MM-dd') + ' 00:00:00').getTime();
            if (param.endDate < param.startDate){
              this.$message.error('活动截止日期必须大于活起始日期');
              return false;
            }
            this.$emit('handleBaseInfo', {operate: 10, data: param});
          }
        });
      },
      getUserRegionById: function () {
        let params = {userId: this.userInfo.id};
        campaignApi.getUserRegionById(params).then(res =>{
          this.userRegion = res.data;
        })
      }
    },
    mounted() {
      this.getClassList();
      if (this.inputs && this.inputs.tpClass){
        this.changeClass(this.inputs.tpClass);
      }
      this.getUserRegionById();
    }
  };
</script>

<style lang="scss" scoped>
</style>
