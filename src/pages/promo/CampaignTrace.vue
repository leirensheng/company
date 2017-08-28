<template>
<div class="trace">
  <el-row :gutter="20">
    <el-col :span="6"></el-col>
    <el-col :span="6"></el-col>
    <!--<el-col :span="6" :offset="6">-->
      <!--<el-button>暂停活动</el-button>-->
      <!--<el-button type="primary">终止活动</el-button>-->
    <!--</el-col>-->
  </el-row>

  <el-row class="total">
    <el-col>
      <div class="tl-title">
        <!--<span>总预算(元)</span>-->
        <span>触达</span>
        <span>到店</span>
        <span>购物</span>
        <span>转化率</span>
        <span>总消费</span>
      </div>
      <div class="tl-result">
        <!--<span >{{traceTotal.budget}}</span>-->
        <span>{{latestRecord.totalReaches}}</span>
        <span>{{latestRecord.totalOutlets}}</span>
        <span>{{latestRecord.totalOrders}}</span>
        <span>{{latestRecord.totalRate}}</span>
        <span>{{latestRecord.totalOrderAmount}}</span>
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="20" class="campaign">
    <el-col :span="12" class="info" >
      <p class="relative">基本信息:</p>
      <!--<div class="edit-icon-left" @click="handleCampaignEdit"><i class="el-icon-edit" title="编辑"> </i></div>-->
      <span class="clear"></span>
      <div class="content">
        <campaign-view :inputs="this.campaignInfo" :companyCode="this.campaignInfo.ownerCompany"></campaign-view>
        <!--<campaign-form :inputs="this.campaignInfo"></campaign-form>-->
      </div>
    </el-col>
    <el-col :span="12" class="info">
      <p class="relative">活动门店:</p>
      <!--<div class="edit-icon-right" @click="handleOutletsEdit"><i class="el-icon-edit" title="编辑"></i></div>-->
      <span class="clear"></span>
      <div class="content" style="min-height: 250px;">
        <outlets-view :inputs="this.outlets"></outlets-view>
        <!--<select-outlets :inputs="this.outlets"></select-outlets>-->
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <p>活动内容:</p>
    <el-col :span="6">
      <span>活动模板: </span> &nbsp;
      <span>
        <el-button type="primary" @click="pagePreview()">预览</el-button>
      </span>
    </el-col>
    <el-col :span="6">
      <span>推送模板:</span> &nbsp;
      <span>
        <el-button type="primary" @click="smsPreview()">预览</el-button>
      </span>
    </el-col>
    <el-col :span="6">
      <span>优惠券模板:</span> &nbsp;
      <span>
        <el-button type="primary" @click="couponPreview()">预览</el-button>
      </span>
    </el-col>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="24">
      <p>活动报告:</p>
      <campaign-report :campId="campaignInfo.id" :tableData="fullRecord"></campaign-report>
    </el-col>
  </el-row>

  <!-- 活动基本信息 -->
  <template>
    <el-dialog :title="editCampaignInfoArgs.title" v-model="editCampaignInfoArgs.show" :close-on-click-modal="false">
      <campaign-form :inputs="editCampaignInfoArgs.data"></campaign-form>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="editCampaignInfoArgs.show = false">取 消</el-button>
        <el-button type="primary" @click="editCampaignInfoSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </template>


  <!-- 选择门店 -->
  <template>
    <el-dialog :title="editOutletsArgs.title" v-model="editOutletsArgs.show" :close-on-click-modal="false" :modal="false">
      <select-outlets :inputs=" this.editOutletsArgs.data"></select-outlets>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="editOutletsArgs.show = false">取 消</el-button>
        <el-button type="primary" @click="editOutletsInfoSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </template>

  <!-- 活动模板预览 -->
  <template>
    <el-dialog title="活动模板预览" :visible.sync="pagePreviewVisiable" top="2%" size="small">
      <div class="activityTemplate">
        <iframe :src="iframeUrl" frameborder="0" width="375" height="667"></iframe>
      </div>
      <!--<span slot="footer" class="dialog-footer" style="text-align: center;">-->
        <!--<el-button @click="editOutletsArgs.show = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="editOutletsInfoSubmit">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>
  </template>

  <!-- 短信模板预览 -->
  <template>
    <el-dialog title="短信模板预览" :visible.sync="smsPreviewVisiable" top="2%" size="tiny">
      <div class="activityTemplate">
        <span v-if="smsContent !== '' || smsContent !== undefined">{{smsContent}}</span>
        <span v-if="smsContent == '' || smsContent == undefined">暂无短信模板</span>
      </div>
    </el-dialog>
  </template>

  <!-- 优惠券模板预览 -->
  <template>
    <el-dialog title="优惠券模板预览" :visible.sync="couponPreviewVisiable" top="2%" size="tiny">
      <div>
        <coupon-item :couponColor="couponData.color" :title="couponData.name" :smallerSpan="amtType(couponData.amtType,couponData.amount,couponData.subType,couponData.cumulative)" :biggerSpan="discountMethod(couponData.subType,couponData.discount)" :couponCode="1234567"></coupon-item>
      </div>
    </el-dialog>
  </template>


</div>
</template>

<script>
  import CampaignForm from './trace/CampaignForm.vue';
  import SelectOutlets from './trace/SelectOutlets.vue';

  import CampaignView from './trace/CamaignView.vue';
  import OutletsView from './trace/OutletsView.vue';
  import CampaignReport from './trace/CampaignReport.vue';
  import couponItem from './trace/couponItem.vue';

  import { mapGetters, mapActions } from 'vuex';
  import regionApi from 'src/api/region';
  import campaignApi from 'src/api/campaign';
  import _ from 'underscore';
  import $vx from '../../supports/util/vx';
  import settings from '../../supports/settings/config';

  export default {
    data () {
      return {
        traceTotal: {
          budget: '20000',
          readNum: 12300,
          arriveShop: 2300,
          shopping:1800,
          conversionRate:'15.5%',
          totalOrderAmount:'291,856.38'
        },
        campaignInfo:{
          id:"",
          tpCategory:"",
          tpType:"",
          campaignName:"",
          startDate:"",
          endDate:"",
          noticeTime:"",
          isPeriodic: "",
          noticePriorDays:"",
          startTime:"",
          endTime:"",
          ownerCompany:"",
          createdBy:"",
          sendVia:"",
          status:"",
          weekList: [], // 执行周期
          sendList: [], // 发送渠道
          scheduleStr:"",
          smsTemplateId:"",  //短信模板
          smsContent:"", // 短信模板数据JSON 字符串
          contentTemplateId:"",  //活动内容模板
          contentData:"", //活动内容模板数据JSON 字符串
        },
        outlets: {tags:[], selectTags:[]}, //regionTree 门店数据 tags: 选中的门店 选中门店的key
        editCampaignInfoArgs:{title:"编辑", data:"", show:false}, //{campaignInfo:{CampaignInfo}, show title}
        editOutletsArgs:{title:"编辑", data:"", show:false},
        pagePreviewVisiable:false,
        smsPreviewVisiable:false,
        couponPreviewVisiable:false,
        smsContent:'',
        smsTemplateId:'',
        iframeUrl:'',
        templateList:[],
        ITEMTemplates:[],
        SMSTemplates:[],
        COUPONTemplates:[],
        latestRecord: {
          totalReaches: '',
          totalOutlets: '',
          totalOrders: '',
          totalRate: '',
          totalOrderAmount:''
        },
        fullRecord:[],
        customCrowd:[],
        standardCrowd:[],
        couponData:''
      }
    },
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    components: {
      CampaignForm,
      SelectOutlets,
      CampaignView,
      OutletsView,
      CampaignReport,
      couponItem
    },
    methods:{
      initData: function (id) {
        this.getCampaignTrace(id);
      },
      getCampaignTrace: function (id) {
        let param = {id:id, companyCode: this.userInfo.companyCode};
        campaignApi.getCampaignById(param).then(res=>{
          if (res.errcode){
            this.$message.error(res.message);
          }else{
            this.campaignInfo = Object.assign(this.campaignInfo, res.data);
//            this.smsContent = JSON.parse(res.data.smsContent).desc;
            this.smsTemplateId = res.data.smsTemplateId;
            this.couponData = JSON.parse(res.data.couponData);
            this.outlets.tags = this.campaignInfo.tpCampaignOutlets;
            // this.campaignInfo.guideTrack = this.campaignInfo.guideTrack == 1?'是':'否';
            this.outlets.selectTags = this.campaignInfo.tpCampaignOutlets.map(item=>{ return item["remark"]; });
          }
        })
      },
      handleCampaignEdit: function () {
        if (this.campaignInfo.status === 10 || this.campaignInfo.status === 40 || this.campaignInfo.status === 55){
          this.editCampaignInfoArgs.show = true;
          this.editCampaignInfoArgs.title = "促销活动信息编辑";
          this.editCampaignInfoArgs.data = JSON.parse(JSON.stringify(this.campaignInfo));
        } else {
            this.$message.error("请先暂停活动，才能进行编辑");
        }
      },
      editCampaignInfoSubmit: function () {
        let cpCI = this.editCampaignInfoArgs.data;
        // 活动主信息处理
        cpCI.sendVia = cpCI.sendList.join(',');
        cpCI.scheduleStr = cpCI.weekList.join(',');

        cpCI.sendList && delete cpCI.sendList;
        cpCI.weekList && delete cpCI.weekList;

        cpCI.tpCampaignOutlets && delete cpCI.tpCampaignOutlets;
        cpCI.tpCampaignLists && delete cpCI.tpCampaignLists;
        cpCI.tpCampaignCompanies && delete cpCI.tpCampaignCompanies;

        //组装保存数据结构
        cpCI.startDate = new Date(cpCI.startDate).getTime();
        cpCI.endDate = new Date($vx.date.format(new Date(cpCI.endDate), 'yyyy-MM-dd') + ' 23:59:59').getTime();
        cpCI.ownerCompany = this.userInfo.companyCode;
        cpCI.createdBy = this.userInfo.id;

        let param = {id:cpCI.id, companyCode:cpCI.ownerCompany, tpCampaigns:cpCI, type:2};
        campaignApi.savePartCampaigns(param).then(res=>{
          if (res.errcode){
            this.$message.error("基本信息保存失败" + res.message);
          }else {
            this.$message.success("基本信息保存成功");
            this.editCampaignInfoArgs.show = false;
            Object.assign(this.campaignInfo, cpCI);
          }
        }).catch(err=>{
          this.$message.error("基本信息保存失败");
        });

      },
      handleOutletsEdit: function () {
        if (this.campaignInfo.status === 10 || this.campaignInfo.status === 40 || this.campaignInfo.status === 55){
          this.editOutletsArgs.show = true;
          this.editOutletsArgs.title = "促销活动门店编辑";
          this.editOutletsArgs.data = JSON.parse(JSON.stringify(this.outlets));
        } else {
          this.$message.error("请先暂停活动，才能进行编辑");
        }
      },
      editOutletsInfoSubmit: function () {
        let param = { companyCode:this.userInfo.companyCode,tpCampaigns:{id:this.campaignInfo.id,tpCampaignOutlets:[]}, type:5};
        param.tpCampaigns.tpCampaignOutlets = this.editOutletsArgs.data.tags;
        campaignApi.savePartCampaigns(param).then(res=>{
           if (res.errcode){
             this.$message.error("门店保存失败" + res.message);
           }else {
             this.$message.success("门店保存成功");
             this.editOutletsArgs.show = false;
             Object.assign(this.outlets, this.editOutletsArgs.data);
           }
        }).catch(err=>{
            this.$message.error("门店保存失败");
        });
      },
      pagePreview() {
        this.pagePreviewVisiable = true;
        let that = this;
        let long_url = `${settings.SHORT_DOMAIN}` ;
        let campaign = {
          id:that.campaignInfo.id,
          tpCategory:that.campaignInfo.tpCategory
        };
        this.iframeUrl = $vx.generateLink(long_url,campaign);
      },
      smsPreview() {
        var that = this;
        if(this.smsContent === ''){
          that.SMSTemplates.forEach(function (index) {
            if(that.smsTemplateId == index.id){
                that.smsContent = index.templateContent;
            } else {

            }
            })
        }
        this.smsPreviewVisiable = true;
      },
      couponPreview() {
        this.couponPreviewVisiable = true;
      },
      getTracking(id) {
        let that = this;
        let params = {campaignId:id};
        campaignApi.getTrackingById(params).then((rst)=>{
          that.fullRecord = rst.data;
          if(that.fullRecord.length > 0){
            that.latestRecord = that.fullRecord[rst.data.length-1];
          } else {
            that.latestRecord = [
              {
                totalReaches: 0,
                totalOutlets: 0,
                totalOrders: 0,
                totalRate: 0,
                totalOrderAmount:0,
                totalRate:0
              }
            ]
          }
        }).catch((err)=>{
          console.log(err);
        })
      },
      getAllTemplate: function(){
        //获取所有模板
        campaignApi.listByType().then(res=>{
          if (res.errcode){
            this.$message.error(res.message);
//              this.showSMSTemplates = this.SMSTemplates;
//              // 当拿到模板时主动触发一次 为了修改是可编辑品宣区
//              this.changeItemTemplate(this.campaignInfo.contentTemplateId);
//
//              // 触发下绑定 短信模板
//              this.changeCategory(this.campaignInfo.tpCategory);
          } else{
            this.templateList = res.data;
            if (res.data){
              for (let i=0; i < res.data.length; i++){
                let obj = res.data[i];
                // TODO 为了让选模板自动绑定 因为获取的模板ID是字符串
                obj.id = parseInt(obj.id);
                if (obj["templateDataStru"]) {
                  obj["templateDataStru"] = JSON.parse(obj["templateDataStru"]);
                } else {
                  obj["templateDataStru"] = {}
                }
                if (obj.templateType === 'CAMPAIGN'){
                  this.ITEMTemplates.push(obj);
                }
                if (obj.templateType === 'SMS'){
                  this.SMSTemplates.push(obj);
                }
                if (obj.templateType === 'COUPON'){
                  this.COUPONTemplates.push(obj);
                }
              }
            }
          }
        }).catch((err)=>{
          this.$message.error("根据模板类型查询模板接口异常");
          console.log(err);
        });
      },
      amtType(type, font, subtype, cumulative) {
        if (type === '1') {
          if (subtype == 1) {
            if (cumulative === '1') {
              return '每满' + font + '可减';
            } else if (cumulative === '0') {
              return '满' + font + '可减';
            }
          } else if (subtype == 2) {
            if (cumulative === '1') {
              return '每满' + font;
            } else if (cumulative === '0') {
              return '满' + font;
            }
          } else if (subtype == 3) {
            return '';
          } else if (subtype == 4) {
            return '满' + font + '元减';
          } else if (subtype == 5) {
            return '任意' + font + '件';
          }
        }
        if (type === '2') {
          if (subtype == 1) {
            if (cumulative === '1') {
              return '每满' + font + '件减';
            } else if (cumulative === '0') {
              return '满' + font + '件减';
            }
          } else if (subtype == 2) {
            return '满' + font + '件';
          } else if (subtype == 3) {
            return '';
          } else if (subtype == 4) {
            return '满' + font + '件减';
          } else if (subtype == 5) {
            return '任意' + font + '件';
          }
          return font + '件';
        }
      },
      discountMethod(subtype, discount) {
        switch (subtype) {
          case '1':
            discount = '￥' + discount;
            break;
          case '2':
            discount = discount * 10 + '折';
            break;
          case '3':
            discount = discount * 10 + '折';
            break;
          case '4':
            discount = '￥' + discount;
            break;
          case '5':
            discount = '￥' + discount;
            break;
        }
        return discount;
      }
    },
    mounted (){
      let id = this.$route.params.id;
      this.initData(id);
      this.getAllTemplate();
      this.getTracking(id);
    }
  }

</script>

<style scoped>

  .activityTemplate{text-align: center}

  .trace {margin: 20px;}

  .trace .total .tl-title {padding: 5px 0; color: #999999;font-size: 18px;}
  .trace .total .tl-result {padding: 5px 0; color: #0000CC;font-size: 16px;}
  .trace .total .tl-title span,.trace .tl-result span {display: inline-block; width: 10%; }
  .trace .total .tl-title span:first-child,.trace .tl-result span:first-child {margin-right: 15px;}
  .trace .total .tl-title span + span, .trace .tl-result span + span {margin-left: 20px;}

  .trace .campaign .info {padding: 10px;}
  .trace .campaign .info .content {background-color: #f2f2f2;padding: 10px;}

  .trace .campaign .info .clear{clear: both;}
  .trace .campaign .info .relative {position: relative;}
  .trace .campaign .info .edit-icon-left{ position: absolute;left: 47%;top: 30px;font-size: 18px;cursor: pointer; width: 20px;}
  .trace .campaign .info .edit-icon-right{ position: absolute;left: 96%;top: 30px;font-size: 18px;cursor: pointer; width: 20px;}

</style>
