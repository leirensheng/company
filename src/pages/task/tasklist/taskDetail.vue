<template>
  <el-row type="flex">
    <el-col :span="4"> </el-col>
    <el-col :span="16">
      <div>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" v-on:updateTask="updateForm">
          <el-form-item label="任务类型" prop="taskType">
            <el-select v-model="form.taskType" placeholder="请选择任务类型" required disabled>
              <el-option :label="item.taskTypeName" :value="item.taskType" v-for="(item, key) in taskList" :key="key" @click.native="getTpClass(item.tpClass)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动分区" prop="regionId">
          <el-select v-model="form.regionId" placeholder="请选择活动分区" disabled>
            <el-option :label="item.regionName" :value="item.regionId" v-for="(item,key) in partitionList" :key="key" @click.native="getCampaignList(item.regionId)"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="选择活动" prop="campaignId">
            <el-select v-model="form.campaignName" placeholder="请选择活动" disabled>
              <el-option :label="item.campaignName" :value="item.id" v-for="(item,key) in campaignList" :key="key" @click.native="getTpCategory(item.tpCategory),getCampaignItemList(item.id),getTargets(item.id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否周期性">
            <el-switch on-text="是" off-text="否" v-model="form.isPeriodic" :on-value="1" :off-value="0" disabled></el-switch>
          </el-form-item>
          <el-form-item label="任务执行人" prop="ownerType">
            <el-select v-model="form.ownerType" placeholder="请选择任务执行对象" disabled>
              <el-option :value="2" label="导购"></el-option>
              <el-option :value="1" label="系统" v-if="form.taskType != '90'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务标题" prop="taskTitle">
            <el-input v-model="form.taskTitle" placeholder="标题最多15字" :maxlength="15" disabled></el-input>
          </el-form-item>
          <el-form-item label="任务操作" prop="operationType">
            <el-select v-model="form.operationType" placeholder="请选择任务操作" disabled>
              <el-option label="发送短信" :value="2" v-if="form.taskType != '90'"></el-option>
              <el-option label="拨打电话" :value="1" v-if="form.taskType != '90' && form.ownerType != '1'"></el-option>
              <el-option label="陈列" :value="3" v-if="form.taskType != '10' && form.taskType != '20' && form.ownerType != '1'"></el-option>
              <el-option label="分享" :value="4" v-if="form.taskType != '10' && form.taskType != '90' && form.ownerType != '1'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="短信模板" v-if="form.operationType != '' && form.operationType == 2">
            <el-select v-model="form.templateId" placeholder="请选择短信模板" disabled>
              <el-option :label="item.tplName" :value="item.id" v-for="(item,key) in smsList" :key="key"></el-option>
            </el-select>
            <el-input v-model="templateContent" type="textarea" disabled></el-input>
          </el-form-item>
          <el-form-item label="话术指引" v-if="form.operationType != '' && form.operationType == 1">
            <el-input v-model="form.templateContent" placeholder="话术指引" type="textarea" disabled></el-input>
          </el-form-item>
          <el-form-item label="分享" v-if="form.operationType != '' && form.operationType == 4">
            <el-select v-model="form.shareContentType" placeholder="请选择分享内容" disabled>
              <el-option label="分享活动" :value="1"></el-option>
              <el-option label="分享商品" :value="2"></el-option>
              <el-option label="分享图片" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分享图片" v-if="form.shareContentType == 3">
            <el-upload action="/crm/api/pa/uploadImg" list-type="picture-card" :on-remove="handleRemove" :on-success="onSuccess" disabled>
              <img width="100%" :src="sharedImageUrl" alt="" v-if="sharedImageUrl">
              <i class="el-icon-plus" v-else></i>
            </el-upload>
            <el-dialog v-model="dialogVisible" size="tiny">
            </el-dialog>
          </el-form-item>
          <el-form-item label="分享商品" v-if="form.shareContentType == 2">
            <el-select v-model="form.itemIds" placeholder="请选择" multiple disabled>
              <el-option :label="item.itemName" :value="item.id" v-for="(item,key) in campaignItemList" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务内容" v-if="form.taskType != '' && form.taskType == 90">
            <el-upload
              action="/crm/api/pa/uploadFile"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="onSuccess"
              :show-file-list="false">
              <img width="100%" :src="sharedImageUrl" alt="" v-if="sharedImageUrl" disabled>
              <i class="el-icon-plus" v-else></i>
            </el-upload>
            <el-dialog v-model="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="是否需要导购上传回执" v-if="form.taskType != '' && form.taskType == 90">
            <el-switch on-text="是" off-text="否" v-model="form.needFeedback" :on-value="1" :off-value="0" disabled></el-switch>
          </el-form-item>
          <el-form-item label="任务时间">
            <el-row v-if="form.campaignId != ''">
              <span>任务时间应在{{campaignStartDate | formatDate('yyyy-MM-dd')}}到{{campaignEndDate | formatDate('yyyy-MM-dd')}}之间</span>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="plannedStartDate">
                  <el-date-picker type="datetime" placeholder="选择日期" :picker-options="pickerOptionsOne" v-model="form.plannedStartDate" style="width: 100%;" format="yyyy-MM-dd HH:00:00" disabled></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="plannedEndDate">
                  <el-date-picker type="datetime" placeholder="选择日期" :picker-options="pickerOptionsOne" v-model="form.plannedEndDate" style="width: 100%;" format="yyyy-MM-dd HH:00:00" disabled></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <div v-if="form.taskType != 90">
          <span class="activityObject">任务对象：</span>
          <el-form-item label="地域选择">
            <template>
              <span>活动已选择：</span><el-tag v-for="(item,key) in tagList.audTargetGeos" :key="key">{{item.valueNames}}&nbsp;</el-tag>
              <br>
              <span>任务选择：</span><el-tag v-for="(item,key) in audTargetGeos" :key="key">{{item.valueNames}}&nbsp;</el-tag>
            </template>
          </el-form-item>
          <el-form-item label="人群规则">
            <div class="label-content" >
              <span class="campaign-red"></span>人群定向规则 &nbsp;
            </div>
            <div>
            <div class="aud-target-rule" v-if="tagList.audTargetRules" v-for="(rule,key) in tagList.audTargetRules">
              <span v-text="'活动已选择定向规则' + (key+1) + ':'"></span>
              <el-tag class="item-tag" :key="k" type="gray" v-for="(tag,k) in rule">
                {{tag.valueNames}}
              </el-tag>
              <el-tag class="item-tag" v-for="(tag,k) in audTargetRules" :key="k" type="gray">
                {{tag.valueNames}}
              </el-tag>
            </div>
            <div v-if="tagList.audTargetRules && audTargetRules">
              <span>任务规则:</span>
              <el-tag class="item-tag" v-for="(tag,k) in audTargetRules" :key="k" type="gray">
                {{tag.valueNames}}
              </el-tag>
            </div>
          </div>
          </el-form-item>
          </div>
          <template>
            <el-dialog
              :visible.sync="editGeoVisible"
              :before-close="handleClose">
              <el-row>
                <aud-targets-geo :filterGeos="editAudTargetGeoArgs.rulesFilter" :arges="editAudTargetGeoArgs" v-on:editGeos="saveAudTargetGeos"></aud-targets-geo>
              </el-row>
            </el-dialog>
          </template>

          <template>
            <el-dialog
              :visible.sync="editDialogVisible"
              :before-close="handleClose">
              <el-row>
                <aud-targets-rule :inputs="editAudTargetArgs" v-on:editdone="handleAudTargetEditDone"></aud-targets-rule>
              </el-row>
            </el-dialog>
          </template>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4"> </el-col>
  </el-row>
</template>

<script>
  import paApi from '../../../api/pa';
  import campaignApi from '../../../api/campaign';
  import { mapGetters, mapActions } from 'vuex'
  import ElCol from "element-ui/packages/col/src/col";
  import AudTargetsGeo from '../../../components/AudTargets/AudTargetsGeo.vue';
  import AudTargetsRule from '../../../components/AudTargets/AudTargetsRule.vue';
  import ElRow from "element-ui/packages/row/src/row";
  import {formatDate} from '../../../supports/filter/filters';

  export default {
    components: {
      ElRow,
      ElCol,
      AudTargetsGeo,
      AudTargetsRule
    },
    props:['editForm','formSubmitVisible'],
    data() {
      return {
        tpClass:'',
        form:{
          taskType:'',
          regionId: '',
          campaignId:'',
          ownerType:'',
          taskTitle:'',
          operationType:'',
          templateId:'',
          shareContentType:'',
          plannedStartDate:'',
          plannedEndDate:'',
          itemIds:'',
          isPeriodic:'',
          needFeedback:'',
          templateContent:''
        },
        rules: {
          taskType: [
            { required: true, message: '请选择任务类型', trigger: 'blur' },
          ],
          regionId: [
                { required: true, message: '请选择活动分区', trigger: 'blur' },
              ],
          campaignId: [
            { required: true, message: '请选择活动', trigger: 'change' }
          ],
          ownerType: [
            { required: true, message: '请选择执行对象', trigger: 'change', type: 'number'}
          ],
          taskTitle: [
            { required: true, message: '请选择任务标题', trigger: 'change' }
          ],
          operationType: [
            { required: true, message: '请选择任务操作', trigger: 'change', type: 'number' }
          ],
          plannedStartDate: [
            { required: true, message: '请选择活动时间', trigger: 'blur' , type: 'date'}
          ],
          plannedEndDate: [
            { required: true, message: '请选择活动时间', trigger: 'blur' , type: 'date'}
          ]
        },
        taskList:[],
        partitionList:[],
        smsList:[],
        campaignList:[],
        dialogImageUrl:'',
        dialogVisible:false,
        tpCategory:'',
        sharedImageUrl:'',
        campaignItemList:[],
        editAudTargetArgs: {
          title: '人群定向规则',
          rules: [],          // 数据
          show: false,     // 是否显示
          ruleGroup: 0,       // 分组
          checkTagValue: []   //选中标签id
        },
        editAudTargetGeoArgs: {
          title: '人群地域规则',
          show: false, // 是否显示
          rulesFilter:[]
        },
        audTargetRules:[],
        audTargetGeos:[],
        editDialogVisible:false,
        tagList:{},
        editGeoVisible:false,
        taskId:'',
        isCreate:true,
        fileSize:'',
        pickerOptionsOne: {
          disabledDate(time) {
            return time.getTime() < Date.now();;
          }
        }
      }
    },
    methods:{
      getTaskType() {
        var that = this;
        paApi.getTaskType().then(rst=>{
          that.taskList = rst.data;
        })
      },
      getTpClass(tpClass) {
          this.tpClass = tpClass;
          if (this.form.regionId != '0' && this.form.regionId != '') {
            this.getCampaignList(this.form.regionId);
          }
        },
      getPartition() {
          var that = this;
          let userId = this.userInfo.id;
          paApi.getPartition({params:{userId: userId}}).then(rst=>{
            that.partitionList = rst.data;
          });
        },
      getSmsList(current,strfliter){
        var that = this;
        campaignApi.getSmsList(current,'').then(function (data) {
          that.smsList = data.data.records;
        }).catch(function (reason) {
          // console.log(reason);
        })
      },
      getCampaignList(regionId){
        if(this.isCreate === true){
          this.form.campaignId = '';
          this.form.operationType = '';
        }
        var that = this;
        let params = {
          regionId: regionId,
          companyCode:that.selectCompanyInfo.companyCode,
          tpClass:that.tpClass
        };
        campaignApi.getCampaignByClass(params).then(rst=>{
          that.campaignList = rst.data;
        })
      },
      getTpCategory(tpCategory){
        this.tpCategory = tpCategory;
        this.form.operationType = '';
        this.form.shareContentType = '';
        this.form.itemIds = '';
        this.form.templateContent = '';
      },
      handlePictureCardPreview(){},
      handleRemove(){},
      onSuccess(response,file,fileList){
        this.sharedImageUrl = response.data.url;
        this.fileSize = response.data.fileSize;
      },
      getCampaignItemList(campaignId){
        campaignApi.getCampaignItemList(campaignId).then(rst=>{
          this.campaignItemList = rst.data;
        })
      },
      submitForm(){
        this.$refs.form.validate((valid)=>{
          if(valid){
            if(this.templateContent && this.templateContent != ''){
              this.form.templateContent = this.templateContent;
            }
            this.form.companyCode = this.selectCompanyInfo.companyCode;
            this.form.plannedStartDate = this.deleteMinutes(this.form.plannedStartDate);
            this.form.plannedEndDate = this.deleteMinutes(this.form.plannedEndDate);
            var paTaskPlanFiles;
            var paTaskPlanTargets = {
              paTargetGeos:[],
              paTargetRules:[]
            };
            paTaskPlanTargets.paTargetGeos = this.audTargetGeos;
            paTaskPlanTargets.paTargetRules[0] = this.audTargetRules;
            var paTaskPlan = this.form;
            if(this.form.shareContentType != null && this.form.shareContentType.toString() === '3'){
              paTaskPlanFiles = [{fileType:2, fileUrl:this.sharedImageUrl,fileSize:this.fileSize}];
              paTaskPlan.itemIds = '';
            }
            if(this.form.shareContentType != null && this.form.shareContentType.toString() === '2'){
              paTaskPlan.itemIds = paTaskPlan.itemIds.join(',');
            }
            if(this.form.taskType.toString() === '90'){
              paTaskPlanFiles = [{fileType:1, fileUrl:this.sharedImageUrl,fileSize:this.fileSize}];
            }
            var postData = {
              paTaskPlan:paTaskPlan,
              paTaskPlanFiles:paTaskPlanFiles,
              paTaskPlanTargets:paTaskPlanTargets
            };
            paApi.submitTaskForm(postData).then(rst=>{
              this.$notify({
                title: '成功',
                message: '创建成功',
                duration: 1000,
                type: 'success'
              });
              this.$router.push({path:'/pa/task-plan/list'});
            }).catch(err=>{
              this.$notify.error({
                title: '失败',
                message: '创建失败',
                duration: 1000
              });
            })
          }
          else{
            return false;
          }
        })

      },
      updateForm(){
        if(this.templateContent && this.templateContent != ''){
          this.form.templateContent = this.templateContent;
        }
        this.form.companyCode = this.selectCompanyInfo.companyCode;
        this.form.plannedStartDate = this.deleteMinutes(this.form.plannedStartDate);
        this.form.plannedEndDate = this.deleteMinutes(this.form.plannedEndDate);
        var paTaskPlanFiles;
        var paTaskPlanTargets = {
          paTargetGeos:[],
          paTargetRules:[]
        };
        paTaskPlanTargets.paTargetGeos = this.audTargetGeos;
        paTaskPlanTargets.paTargetRules[0] = this.audTargetRules;
        var paTaskPlan = this.form;
        if(this.form.shareContentType != null && this.form.shareContentType.toString() === '3' && this.sharedImageUrl != ''){
          paTaskPlanFiles = [{fileType:2, fileUrl:this.sharedImageUrl,fileSize:this.fileSize}];
          paTaskPlan.itemIds = '';
        }
        if(this.form.shareContentType != null && this.form.shareContentType.toString() === '2'){
          paTaskPlan.itemIds = paTaskPlan.itemIds.join(',');
        }
        if(this.form.taskType.toString() === '90' && this.sharedImageUrl != ''){
          paTaskPlanFiles = [{fileType:1, fileUrl:this.sharedImageUrl,fileSize:this.fileSize}];
        }

        var postData = {
          paTaskPlan:paTaskPlan,
          paTaskPlanFiles:paTaskPlanFiles,
          paTaskPlanTargets:paTaskPlanTargets
        };
        paApi.updateTaskForm(postData).then(rst=>{
          this.$notify({
            title: '成功',
            message: '更新成功',
            duration: 1000,
            type: 'success'
          });
          this.$router.push({path:'/pa/task-plan/list'});
        }).catch(err=>{
          this.$notify.error({
            title: '失败',
            message: '更新失败',
            duration: 1000
          });
        });
      },
      handleClose(){
        this.editDialogVisible = false;
        this.editGeoVisible = false;
      },
      getTargets(campaignId){
        campaignApi.getTargetByCampaignId(campaignId).then(rst=>{
          this.tagList = rst.data;
          for(let i=0;i<rst.data.audTargetGeos.length;i++){
            this.editAudTargetGeoArgs.rulesFilter.push(rst.data.audTargetGeos[i]);
          }
        })
      },
      addRules(){
        this.editDialogVisible = true;
      },
      handleAudTargetEditDone(res){
        this.audTargetRules.push(res);
//            this.tagList.audTargetRules.push(res);
        this.editDialogVisible = false;

      },
      saveAudTargetGeos(res){
        for(let i=0;i<res.length;i++){
          this.audTargetGeos.push(res[i]);
//            this.tagList.audTargetGeos.push(res[i]);
        }
        this.editGeoVisible = false;
      },
      deleteMinutes(time){
        if(typeof time === 'object'){
          time.setMinutes(0,0);
        }
        return time;
      },
      addGeo(){
        this.editGeoVisible = true;
      },
      clearAudTargetRules(){
        this.audTargetRules = [];
      },
      getTaskDetail(id){
        let that = this;
        paApi.getTaskDetail(id).then(rst=>{
          this.form = rst.data.paTaskPlan;
          this.form.regionId = '' + this.form.regionId;
          this.audTargetRules = rst.data.paTaskPlanTargets.paTargetRules[0];
          this.audTargetGeos = rst.data.paTaskPlanTargets.paTargetGeos;
          if(rst.data.paTaskPlanFiles[0]){
            this.sharedImageUrl = rst.data.paTaskPlanFiles[0].fileUrl;
          }
          this.getTargets(this.form.campaignId);
          this.getCampaignList(this.form.regionId);
        })
      },

    },
    computed: {
      ...mapGetters({
        selectCompanyInfo: 'getSelectCompanyInfo',
        userInfo: 'getUserInfo'
      }),
      templateContent() {
        var that = this;
        for(let i = 0;i<that.smsList.length;i++){
          if(that.form.templateId != null && that.smsList[i].id === that.form.templateId.toString()){
            return that.smsList[i].tplContent;
          }
        }
      },
      campaignStartDate() {
        var campaignId = this.form.campaignId;
        for(let i = 0;i<this.campaignList.length;i++){
          if(this.campaignList[i].id === campaignId){
            return this.campaignList[i].startDate;
          }
        }
      },
      campaignEndDate() {
        var campaignId = this.form.campaignId;
        for(let i = 0;i<this.campaignList.length;i++){
          if(this.campaignList[i].id === campaignId){
            return this.campaignList[i].endDate;
          }
        }
      }
    },
    mounted(){
      this.getTaskType();
      this.getPartition();
      this.getSmsList(1);
      this.taskId = this.$route.query.id;
      if(this.taskId !== '' && this.taskId !== undefined){
        this.getTaskDetail(this.taskId);
        this.isCreate = false;
      }
    },
    watch:{
      editForm(curVal,oldVal) {
        this.form = curVal.paTaskPlan;
        this.tagList.audTargetRules = curVal.paTaskPlanTargets.paTargetRules;
        this.tagList.audTargetGeos = curVal.paTaskPlanTargets.paTargetGeos;
//          this.getTargets(this.form.campaignId);
        if(curVal.paTaskPlanFiles.length > 0){
          this.sharedImageUrl = curVal.paTaskPlanFiles[0].fileUrl
        }
      }
    }
  }
</script>

<style lang="scss">
  .activityObject{
    font-size: 16px;
    display: inline-block;
    margin-bottom: 10px;
  }
  .campaign-hr {
    border-bottom: 1px solid #bfcbd9;
    margin: 15px 0;
    font-size:18px;
    .edit {
      cursor: pointer;
      float: right;
    }
  }
  .campaign-md {
    width: 100%;
    .campaign-md-content {
      margin-left: 20px;
    }
  }
  .campaign-red {
    color: red;
  }

  .role-dialog {
    width: 75%;
  }

  .aud-target-rule{
    margin: 15px 0;
    .edit-rule {
      height: 20px;
      line-height: 20px;
    }
    .tag-rule {
      margin: 10px 0;
      .item-tag {margin-top: 10px;}
      .item-tag:first-child {margin-left: 10px;}
      .item-tag + .item-tag {margin-left: 10px;}
    }
    .el-tag{
      margin-left: 10px;
    }
  }

</style>
