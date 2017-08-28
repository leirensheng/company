<template>
  <el-row type="flex">
    <el-col :span="4"> </el-col>
    <el-col :span="16">
      <div>
      <el-form ref="form" :model="form" label-width="100px" :rules="rules" v-on:updateTask="updateForm">
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="form.taskType" placeholder="请选择任务类型" required>
            <el-option :label="item.taskTypeName" :value="item.taskType" v-for="(item, key) in taskList" :key="key" @click.native="getTpClass(item.tpClass)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动分区" prop="regionId">
          <el-select v-model="form.regionId" placeholder="请选择活动分区" required>
            <el-option :label="item.regionName" :value="item.regionId" v-for="(item,key) in partitionList" :key="item.regionId" @click.native="getCampaignList(item.regionId)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择活动" prop="campaignId">
          <el-select v-model="form.campaignId" placeholder="请选择活动">
            <el-option :label="item.campaignName" :value="item.id" v-for="(item,key) in campaignList" :key="item.id" @click.native="getTpCategory(item.tpCategory),getCampaignItemList(item.id),getTargets(item.id),getShortLink(item.shortLink)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否周期性">
          <el-switch on-text="是" off-text="否" v-model="form.isPeriodic" :on-value="1" :off-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="任务执行人" prop="ownerType">
          <el-select v-model="form.ownerType" placeholder="请选择任务执行对象">
            <el-option :value="2" label="导购"></el-option>
            <el-option :value="1" label="系统" v-if="form.taskType != '90'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务标题" prop="taskTitle">
          <el-input v-model="form.taskTitle" placeholder="标题最多15字" :maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="任务操作" prop="operationType">
          <el-select v-model="form.operationType" placeholder="请选择任务操作">
            <el-option label="发送短信" :value="2" v-if="form.taskType != '90'"></el-option>
            <el-option label="拨打电话" :value="1" v-if="form.taskType != '90' && form.ownerType != '1'"></el-option>
            <el-option label="陈列" :value="3" v-if="form.taskType != '10' && form.taskType != '20' && form.ownerType != '1'"></el-option>
            <el-option label="分享" :value="4" v-if="form.taskType != '10' && form.taskType != '90' && form.ownerType != '1'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信模板" v-if="form.operationType != '' && form.operationType == 2">
          <el-select v-model="form.templateId" placeholder="请选择短信模板">
            <el-option :label="item.tplName" :value="item.id" v-for="(item,key) in smsList" :key="key" @click.native="getSmsMsg(item.id)"></el-option>
          </el-select>
          <el-input v-model="smsText" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="话术指引" v-if="form.operationType != '' && form.operationType == 1">
          <el-input v-model="form.templateContent" placeholder="话术指引最多80个字" type="textarea" :maxlength="80"></el-input>
        </el-form-item>
        <el-form-item label="分享" v-if="form.operationType != '' && form.operationType == 4">
          <el-select v-model="form.shareContentType" placeholder="请选择分享内容">
            <el-option label="分享活动" :value="1"></el-option>
            <el-option label="分享商品" :value="2"></el-option>
            <el-option label="分享图片" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分享图片" v-if="form.shareContentType == 3">
          <el-upload 
            action="/crm/api/pa/uploadImg" 
            list-type="picture-card"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :on-remove="handleRemove" 
            :on-preview="handlePictureCardPreview"
            :on-success="onSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
        <el-form-item label="分享商品" v-if="form.shareContentType == 2">
          <el-select v-model="form.itemIds" placeholder="请选择" multiple>
            <el-option :label="item.itemName" :value="item.id" v-for="(item,key) in campaignItemList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务内容" v-if="form.taskType != '' && form.taskType == 90">
          <el-upload
            action="/crm/api/pa/uploadFile"
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="onSuccess">
            <div slot="tip" class="el-upload__tip">只能上传 jpg / docx / doc / pdf 格式的文件</div>
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
        <el-form-item label="是否需要导购上传回执" v-if="form.taskType != '' && form.taskType == 90">
          <el-switch on-text="是" off-text="否" v-model="form.needFeedback" :on-value="1" :off-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="任务时间">
          <el-row v-if="form.campaignId != ''">
            <span>任务时间应在{{ campaignStartDate | formatDate('yyyy-MM-dd')}}到{{campaignEndDate | formatDate('yyyy-MM-dd')}}之间</span>
          </el-row>
          <el-row v-if="form.taskType != '90'">
            <el-col :span="11">
              <el-form-item prop="plannedStartDate">
                <el-date-picker type="datetime" placeholder="选择日期" :picker-options="pickerOptionsOne" v-model="form.plannedStartDate" style="width: 100%;" format="yyyy-MM-dd HH:00:00"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item prop="plannedEndDate">
                <el-date-picker type="datetime" placeholder="选择日期" :picker-options="pickerOptionsOne" v-model="form.plannedEndDate" style="width: 100%;" format="yyyy-MM-dd HH:00:00"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.taskType == '90'">
            <el-col :span="11">
              <el-form-item prop="plannedStartDate">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="form.plannedStartDate" style="width: 100%;" format="yyyy-MM-dd HH:00:00"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item prop="plannedEndDate">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="form.plannedEndDate" style="width: 100%;" format="yyyy-MM-dd HH:00:00"></el-date-picker>
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
            <span>任务选择：</span><el-tag v-for="(item,key) in audTargetGeos" :key="key" :closable="true" @close="clearAudTargetGeos(item)">{{item.valueNames}}&nbsp;</el-tag>
            <el-button type="text" @click="addGeo">添加地域定向规则</el-button>
          </template>
        </el-form-item>
        <el-form-item label="人群规则">
          <div class="label-content" >
            <span class="campaign-red"></span>人群定向规则 &nbsp;
            <el-button type="text" @click="addRules">添加人群定向规则</el-button>
          </div>
          <div>
            <div class="aud-target-rule" v-if="tagList.audTargetRules" v-for="(rule,key) in tagList.audTargetRules">
              <span v-text="'活动已选择定向规则' + (key+1) + ':'"></span>
              <el-tag class="item-tag" :key="k" type="gray" v-for="(tag,k) in rule">
                {{tag.valueNames}}
              </el-tag>
              <el-tag class="item-tag" v-for="(tag,k) in audTargetRules" :key="k" type="gray" :closable="true" @close="clearAudTargetRules(tag)">
                {{tag.valueNames}}
              </el-tag>
            </div>
            <div v-if="tagList.audTargetRules && audTargetRules">
              <span>任务规则:</span>
              <el-tag class="item-tag" v-for="(tag,k) in audTargetRules" :key="k" type="gray" :closable="true" @close="clearAudTargetRules(tag)">
                {{tag.valueNames}}
              </el-tag>
            </div>
          </div>
        </el-form-item>
        </div>
        <template>
          <el-dialog
            v-model="editAudTargetGeoArgs.show"
            :close-on-click-modal="false"
            >
            <el-row>
              <aud-targets-geo :filterGeos="editAudTargetGeoArgs.rulesFilter" :arges="editAudTargetGeoArgs" v-on:editGeos="saveAudTargetGeos"></aud-targets-geo>
            </el-row>
          </el-dialog>
        </template>

        <template>
          <el-dialog
            v-model="editAudTargetArgs.show"
            :close-on-click-modal="false">
            <el-row>
              <aud-targets-rule :inputs="editAudTargetArgs" v-on:editdone="handleAudTargetEditDone"></aud-targets-rule>
            </el-row>
          </el-dialog>
        </template>
        <el-form-item v-if="formSubmitVisible !== false">
          <el-button type="primary" @click="submitForm(form)" v-if="isCreate == true">立即创建</el-button>
          <el-button type="primary" @click="updateForm" v-if="!isCreate == true">更新</el-button>
          <el-button @click="$router.push({path:'/pa/task-plan/list'})">取消</el-button>
        </el-form-item>
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
  import _ from 'underscore';

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
            isShortLink: true,
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
            smsText: '',
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
            fileList: [],
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
          });
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
        templateContent(content) {
          var that = this;
          if(that.form.templateContent.length >0 && that.form.templateContent != '' && that.form.templateContent != 'null') {
            that.smsText = that.form.templateContent;
          }
        },
        getSmsMsg(Id){
          var that = this;
          for(let i = 0;i<that.smsList.length;i++){
            if(that.form.templateId != null && that.smsList[i].id === Id.toString()){
              that.smsText = that.smsList[i].tplContent;
            }
          }
        },
        getShortLink(shortLink){
          let that = this;
          if(!shortLink) {
            that.$notify.error({
              title: '选择活动失败',
              message: '该活动没有短链接，请生成短链接后重试',
              duration: 6000
            });
            that.isShortLink = false;
          }
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
        beforeUpload () {
          if (this.fileList.length >0) {
            this.$message({
              type: 'error',
              message: '最多上传1张图片或一个文件',
              duration: 2000
            })
            return false;
          }
        },
        handlePictureCardPreview(){
          this.dialogImageUrl = this.sharedImageUrl;
          this.dialogVisible = true;
        },
        // handleChange(file, fileList){
        //   console.log('file', file);
        //   console.log('fileList', fileList);
        //   this.fileList = fileList.slice(-3);
        // },
        handleRemove(file, fileList){
          if(file){
            this.sharedImageUrl = '';
            this.fileList = [];
          }
        },
        onSuccess(response,file,fileList){
          if(response.errcode) {
            this.$message({
              type: 'error',
              message: response.message,
              duration: 2000
            })
            this.sharedImageUrl = '';
            this.fileList = [];
            return false;
          }
          let data = {
            name: Math.random()*1000,
            uid: Math.random()*1000,
            url: response.data.url
          }
          this.fileList.push(data);
          this.sharedImageUrl = response.data.url;
          this.fileSize = response.data.fileSize;
        },
        getCampaignItemList(campaignId){
          campaignApi.getCampaignItemList(campaignId).then(rst=>{
            this.campaignItemList = rst.data;
          })
        },
        submitForm(){
          let that = this;
          if(!that.isShortLink) {
            that.getShortLink(false);
            return false;
          }
          this.$refs.form.validate((valid)=>{
            if(valid){
              if(that.smsText && that.smsText != ''){
                let pattern = /\${camp_url}/;
                if (!pattern.test(that.smsText) && that.form.templateId !== '25') {
                  that.$notify.error({
                    title: '失败',
                    message: '短信模板中必须含有网页链接',
                    duration: 2000
                  });
                  return false;
                }
                this.form.templateContent = this.smsText;
              }
              this.form.companyCode = this.selectCompanyInfo.companyCode;
              this.form.plannedStartDate = this.deleteMinutes(this.form.plannedStartDate);
              this.form.plannedEndDate = this.deleteMinutes(this.form.plannedEndDate);
              if (this.form.plannedEndDate <= this.form.plannedStartDate) {
                this.$notify.error({
                  title: '失败',
                  message: '任务结束时间要在任务开始时间之后',
                  duration: 1000
                });
                return false;
              }
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
          let that = this;
          if(that.smsText && that.smsText != ''){
            let pattern = /\${camp_url}/;
            if (!pattern.test(that.smsText) && that.form.templateId !== '25') {
              that.$notify.error({
                title: '失败',
                message: '短信模板中必须含有网页链接',
                duration: 2000
              });
              return false;
            }
            this.form.templateContent = this.smsText;
          }
          this.form.companyCode = this.selectCompanyInfo.companyCode;
          this.form.plannedStartDate = this.deleteMinutes(this.form.plannedStartDate);
          this.form.plannedEndDate = this.deleteMinutes(this.form.plannedEndDate);
          if (this.form.plannedEndDate <= this.form.plannedStartDate) {
            this.$notify.error({
              title: '失败',
              message: '任务结束时间要在任务开始时间之后',
              duration: 2000
            });
            return false;
          }
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
        getTargets(campaignId){
          campaignApi.getTargetByCampaignId(campaignId).then(rst=>{
            this.tagList = rst.data;
            for(let i=0;i<rst.data.audTargetGeos.length;i++){
              this.editAudTargetGeoArgs.rulesFilter.push(rst.data.audTargetGeos[i]);
            }
          })
        },
        addRules(){
          this.editAudTargetArgs.checkTagValue = [];
          this.editAudTargetArgs.rules = [];
          this.editAudTargetArgs.show = true;
        },
        handleAudTargetEditDone(res){
          let that = this;
          res.forEach(function(item) {
            that.audTargetRules.push(item);
          });
          that.editAudTargetArgs.show = false;
        },
        saveAudTargetGeos(res){
          let that = this;
          res.forEach(function(i){
            if(that.audTargetGeos.some(function(item) {
              return item.valueIds == i.valueIds;
            })) {
              console.log('有重复');
            } else {
              that.audTargetGeos.push(i);
            }
          })
          this.editAudTargetGeoArgs.show = false;
        },
        deleteMinutes(time){
          if(typeof time === 'object'){
            let changeTime = time.setMinutes(0,0);
            return changeTime;
          } else {
            return time;
          }
        },
        addGeo(){
          this.editAudTargetGeoArgs.show = true;
        },
        clearAudTargetGeos(item){
          let itemIndex = this.audTargetGeos.indexOf(item);
          this.audTargetGeos.splice(itemIndex, 1);
        },
        clearAudTargetRules(tag){
          let tagIndex = this.audTargetRules.indexOf(tag);
          this.audTargetRules.splice(tagIndex, 1);
        },
        getTaskDetail(id){
          let that = this;
          paApi.getTaskDetail(id).then(rst=>{
            this.form = rst.data.paTaskPlan;
            this.form.regionId = '' + this.form.regionId;
            if (rst.data.paTaskPlanTargets.paTargetRules[0]) {
              this.audTargetRules = rst.data.paTaskPlanTargets.paTargetRules[0];
            } else {
              this.audTargetRules = [];
            }
            this.audTargetGeos = rst.data.paTaskPlanTargets.paTargetGeos;
            if(rst.data.paTaskPlanFiles[0]){
              this.sharedImageUrl = rst.data.paTaskPlanFiles[0].fileUrl;
              let arr = {
                name: Math.random()*1000,
                uid: Math.random()*1000,
                url: this.sharedImageUrl
              }
              this.fileList.push(arr);
            }
            this.getTargets(this.form.campaignId);
            this.getCampaignList(this.form.regionId);
            this.templateContent(this.form.templateContent);
          })
        },
      },
    computed: {
      ...mapGetters({
        selectCompanyInfo: 'getSelectCompanyInfo',
        userInfo: 'getUserInfo'
      }),
      campaignStartDate() {
          var campaignId = this.form.campaignId;
          for(let i = 0;i<this.campaignList.length;i++){
              if(this.campaignList[i].id === campaignId){
                  return this.campaignList[i].startDate - this.campaignList[i].publishPriorDays * 24 * 3600 * 1000;
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
      this.getSmsList(1);
      this.getPartition();
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
  }
  .el-tag{
    margin-left: 10px;
  }
</style>
