<template>
  <section>
    <el-row>
        <task-form></task-form>
    </el-row>
  </section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import TaskForm from './taskForm.vue';

    export default {
      components: {
          TaskForm
      },
      data() {
            return {
                form:{
                    taskType:'',
                    regionId: '',
                    campaignId:'',
                    ownerType:'',
                    taskTitle:'',
                    speechcraft:'',
                    operationType:'',
                    templateId:'',
                    templateContent:'',
                    shareContentType:'',
                    plannedStartDate:'',
                    plannedEndDate:'',
                    itemIds:'',
                    isPeriodic:''
                },
                taskList:[],
                smsList:[],
                campaignList:[],
                dialogImageUrl:'',
                dialogVisible:false,
                tpCategory:'',
                sharedImageUrl:'',
                campaignItemList:[]
            }
        },
      methods:{
        getTaskType() {
          var that = this;
          paApi.getTaskType().then(rst=>{
            that.taskList = rst.data;
          })
        },
        getSmsList(current,strfliter){
            var that = this;
          campaignApi.getSmsList(current,'').then(function (data) {
            that.smsList = data.data.records;
          }).catch(function (reason) {
            // console.log(reason);
          })
        },
        getCampaignList(tpClass){
            this.form.campaignId = '';
            var that = this;
            let params = {
                companyCode:that.selectCompanyInfo.companyCode,
                tpClass:tpClass
            };
          campaignApi.getCampaignByClass(params).then(rst=>{
              that.campaignList = rst.data;
          })
        },
        getTpCategory(tpCategory){
          this.tpCategory = tpCategory;
        },
        handlePictureCardPreview(){},
        handleRemove(){},
        onSuccess(response,file,fileList){
            this.sharedImageUrl = response.data.url;
        },
        getCampaignItemList(campaignId){
          campaignApi.getCampaignItemList(campaignId).then(rst=>{
              this.campaignItemList = rst.data;
          })
        },
        submitForm(){
          this.form.templateContent = this.templateContent;
          this.form.companyCode = this.selectCompanyInfo.companyCode;
          var paTaskPlanFiles;
          if(this.form.shareContentType.toString() === '3'){
            paTaskPlanFiles = [{fileType:2, fileUrl:this.sharedImageUrl}];
          }
          var paTaskPlan = this.form;
          if(this.form.shareContentType.toString() === '2'){
            paTaskPlan.itemIds = paTaskPlan.itemIds.join(',');
          }
          var postData = {
              paTaskPlan:paTaskPlan,
              paTaskPlanFiles:paTaskPlanFiles
          };
          paApi.submitTaskForm(postData).then(rst=>{
          })
        }
      },
      computed: {
        ...mapGetters({
          selectCompanyInfo: 'getSelectCompanyInfo',
        }),
//        campaignItemImg(){
//            var that = this;
//            for(let i = 0;i<that.campaignItemList.length;i++){
//                if(that.form.itemids.includes(that.campaignItemList[i].id)){
//                    return that.campaignItemList[i].displayPics.picUrl;
//                }
//            }
//        },
        templateContent() {
          var that = this;
          for(let i = 0;i<that.smsList.length;i++){
              if(that.smsList[i].id === that.form.templateId.toString()){
                  return that.smsList[i].tplContent;
              }
          }
        }
      },
      mounted(){
      }
    }
</script>

<style>

</style>
