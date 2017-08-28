<template>
  <el-row type="flex">
    <el-col :span="4">&nbsp;</el-col>
    <el-col :span="16">
      <div>
        <div class="campaign-hr">
          <span>活动基本信息</span>
          <div class="edit">
            <el-button type="text" @click="changeBaseInfoEditStatus" v-show="!this.isEditBaseInfo" :disabled="isEditOutlets || isEditAudTarget || isEditContent || isEditCoupon"> <i class="el-icon-edit" ></i></el-button>
            <el-button type="text" @click="changeBaseInfoEditStatus" v-show="this.isEditBaseInfo && this.baseInfo.id > 0">取消</el-button>
            <el-button type="text" @click="changeBaseInfoEditStatus('save')" v-show="this.isEditBaseInfo || this.isCreate">保存</el-button>
          </div>
        </div>
        <!-- 基本信息 -->
        <base-info :inputs="baseInfo" :is-edit="isEditBaseInfo" ref="baseInfo"   v-on:handleBaseInfo="handleBaseInfo" v-on:handleSelectClass="changeTpClass"></base-info>
      </div>
      <!-- 选择活动门店 -->
      <div class="campaign-md"  v-if="!this.isCreate">
        <div class="campaign-hr" >
          <span>活动执行门店</span>
          <div class="edit">
            <el-button type="text" @click="changeOutletsEditStatus" v-show="!isEditOutlets" :disabled="isEditBaseInfo || isEditAudTarget || isEditContent || isEditCoupon"><i class="el-icon-edit" ></i></el-button>
            <el-button type="text" @click="changeOutletsEditStatus('cancel')" v-show="isEditOutlets">取消</el-button>
            <el-button type="text" @click="changeOutletsEditStatus('save')" v-show="isEditOutlets">保存</el-button>
          </div>
        </div>
        <outlets :inputs="outletsInfo" :is-edit="isEditOutlets" :regionId="this.baseInfo.regionId" ref="outletsInfo" v-on:handleOutletsInfo="handleOutletsInfo"></outlets>
      </div>

      <!-- 选择活动对象 -->
      <div class="campaign-md" v-if="!this.isCreate">
        <div class="campaign-hr">
          <span>活动对象</span>
          <span style="color: #bbb; font-size: 16px;">（预计推送人数：<span v-text="audTargetsNum"></span>）</span>
          <div class="edit">
            <el-button type="text" @click="changeAudTargetEditStatus" v-show="!isEditAudTarget" :disabled="isEditBaseInfo || isEditOutlets || isEditContent || isEditCoupon"><i class="el-icon-edit" ></i></el-button>
            <el-button type="text" @click="changeAudTargetEditStatus" v-show="isEditAudTarget" >取消</el-button>
            <el-button type="text" @click="changeAudTargetEditStatus('save')" v-show="isEditAudTarget">保存</el-button>
          </div>
        </div>
        <div class="campaign-md-content">
          <el-checkbox v-model="baseInfo.isTargetingAll" :disabled="!isEditAudTarget" @change="updateIsTargetingAll">全部人群</el-checkbox>
          <el-row v-show="!baseInfo.isTargetingAll">
            <el-col :span="24">
              <div class="label-content">
                <span  class="campaign-red">*</span>选择地域 &nbsp;
                 <el-button type="text" @click="editAudTargetGeoDialog" v-show="isEditAudTarget">添加人群地域规则</el-button>
              </div>
              <div class="geo-tag-rule">
                <el-tag
                  class="item-tag"
                  v-for="tag in this.audTargetsInfo.geosRule"
                  :key="tag.valueIds"
                  type="gray"
                  :closable="isEditAudTarget"
                  @close="removeGeoTag(tag)"
                >
                  <span v-text="tag.tagName"></span>
                </el-tag>
              </div>
              <el-dialog :title="editAudTargetGeoArgs.title" v-model="editAudTargetGeoArgs.show"
                         :close-on-click-modal="false"
                         custom-class="role-dialog">
                <aud-targets-geo :filterGeos="editAudTargetGeoArgs.rulesFilter" :arges="editAudTargetGeoArgs" v-on:editGeos="saveAudTargetGeos">
                </aud-targets-geo>
              </el-dialog>

            </el-col>
            <el-col :span="24">
              <div class="label-content" >
                <span class="campaign-red">*</span>人群定向规则 &nbsp;
                <el-button type="text" @click="editAudTargetDialogStatus({name: '新增活动规则', items:[], ruleGroup: 0})" v-show="isEditAudTarget">添加人群定向规则</el-button>
              </div>
              <div>
                <div class="aud-target-rule" v-for="(rule, index) in audTargetsInfo.rules">
                  <div class="edit-rule">
                    <div style="float: left;">定向规则<span v-text="index + 1"></span></div>
                    <div style="float: right">
                      <el-button type="text" @click="editAudTargetDialogStatus(rule, index + 1)" :disabled="!isEditAudTarget">编辑</el-button>
                      <el-button type="text" @click="removeRule(rule, index + 1)" :disabled="!isEditAudTarget">删除</el-button>
                    </div>
                  </div>
                  <div class="tag-rule">
                    <el-tag
                      class="item-tag"
                      v-for="tag in rule.items"
                      :key="tag.tagId"
                      type="gray"
                      :closable="isEditAudTarget"
                      @close="removeTag(rule, tag)"
                    >
                      <span v-text="tag.valueNames"></span>
                  </el-tag>
                  </div>
                </div>
              </div>

              <el-dialog :title="editAudTargetArgs.title" v-model="editAudTargetArgs.show"
                         :close-on-click-modal="false"
                         custom-class="role-dialog">
                <aud-targets-rule :inputs="editAudTargetArgs" v-on:editdone="handleAudTargetEditDone"></aud-targets-rule>
              </el-dialog>
            </el-col >
          </el-row>
        </div>
      </div>

      <!-- 活动内容 -->
      <div class="campaign-md" v-if="!this.isCreate">
        <div class="campaign-hr">
          <span>活动内容</span>
          <div class="edit">
            <el-button type="text" @click="changePromoEditStatus" v-show="!isEditContent"  :disabled="isEditBaseInfo || isEditAudTarget || isEditOutlets || isEditCoupon"><i class="el-icon-edit" ></i></el-button>
            <el-button type="text" @click="changePromoEditStatus" v-show="isEditContent">取消</el-button>
            <!--<i class="icon-save" @click="changePromoEditStatus" v-show="isEditContent">保存</i>-->
          </div>
        </div>
        <div class="campaign-md-content">
          <el-row>
            <el-col :span="7">
              <el-select filterable placeholder="请选择活动模板" ref="campaignSelect" v-model="baseInfo.contentTemplateId" :disabled="!isEditContent">
                <el-option
                  v-for="item in promoTemplates"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-button @click="handlePromoEdit" :disabled="!isEditContent">编辑</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 优惠券内容 -->
      <div class="campaign-md" v-if="!this.isCreate">
        <div class="campaign-hr" >
          <span>优惠券内容 <span style="font-size: 12px; color: red;">先维护活动内容是否需要优惠券</span></span>
          <div class="edit">
            <el-button type="text" @click="changeCouponEditStatus" v-show="this.isCanEditCoupon && !isEditCoupon"  :disabled="isEditBaseInfo || isEditAudTarget || isEditOutlets || isEditContent"><i class="el-icon-edit" ></i></el-button>
            <el-button type="text" @click="changeCouponEditStatus" v-show="isEditCoupon">取消</el-button>
            <!--<i class="icon-save" @click="changeCouponEditStatus" v-show="isEditCoupon">保存</i>-->
          </div>
        </div>
        <div class="campaign-md-content">
          <el-row class="">
            <el-col :span="7">
              <el-select filterable placeholder="请选择优惠券模板" ref="couponSelect" v-model="baseInfo.couponTemplateId" :disabled="!isEditCoupon">
                <el-option
                  v-for="item in couponTemplates"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button @click="handleCouponsEdit" :disabled="!isEditCoupon">编辑</el-button>
            </el-col>
          </el-row>
        </div>
        </div>

      <!-- 活动内容弹窗 -->
      <promo :inputs="editPromoArgs" v-on:editdone="handlePromoEditDone"></promo>
      <!-- 优惠券内容弹窗 -->
      <coupons :inputs="editCouponsArgs" v-on:editdone="handleCouponsEditDone"></coupons>

    </el-col>
    <el-col :span="4">&nbsp;</el-col>
  </el-row>
</template>

<script>
  import _ from 'underscore';
  import campaignApi from 'src/api/campaign';
  import tagApi from 'src/api/tag';
  import commonApi from 'src/api/common';
  import { mapGetters } from 'vuex';
  import BaseInfo from './promotion/BaseInfo.vue';
  import Coupons from './promotion/CouponsEdit.vue';
  import Promo from './promotion/PromoEdit.vue';
  import Outlets from './promotion/OutletsEdit.vue';
  import AudTargetsRule from 'components/AudTargets/AudTargetsRule.vue';
  import AudTargetsGeo from 'components/AudTargets/AudTargetsGeo.vue';
  import regionApi from 'src/api/region';

  export default {
    components: {
      BaseInfo,
      Promo,
      Coupons,
      Outlets,
      AudTargetsRule,
      AudTargetsGeo,
    },
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    data () {
      return {
        campaignId: '',
        isCreate: true,
        isEditBaseInfo: false,
        baseInfo:{
          id:'',
          tpCategory: '',
          tpClass: '',
          campaignName: '',
          campaignDesc: '',
          startDate: '',
          endDate: '',
          publishPriorDays: 0,
          ownerCompany: '',
          campaignCompany: '',
          priority: 5,
          detailRules: '',
          couponTemplateId: '',
          contentTemplateId: '',
          isTargetingAll: false,
          regionId: '',
          status: ''
        },
        isEditAudTarget: false,
        audTargetsInfo: {
          geos: [],
          geosRule: [],
          rules: [],
        },
        editAudTargetGeoArgs: {
          title: '人群地域规则',
          show: false, // 是否显示
          rulesFilter:[]
        },
        editAudTargetArgs: {
          title: '人群定向规则',
          rules: [],          // 数据
          show: false,     // 是否显示
          ruleGroup: 0,       // 分组
          checkTagValue: []   //选中标签id
        }, // tag
        isEditOutlets: false,
        outletsInfo:{
          regionId: '',
          outlets: [],
          tags:[],
          selectTags:[],
          outletsType:[],
          options: []
        },
        outletsInfoOrigin: [],
        isEditContent: false,
        promoInfo: {},
        promoTemplates: [],
        isCanEditCoupon: false, // 是否能编辑优惠券
        isEditCoupon: false,  // 优惠券区域是否是编辑状态
        couponsInfo: {
          id: '',
          couponType: '',
          couponQty: '',
          couponPeriodType: 1 ,
          couponBeginDate: '',
          couponEndDate: '',
          couponDays: '',
          couponData: {
            defaultColor: '',
            name: '',   // 优惠券名称
            color: '',  // 优惠券颜色
            cumulative: '1', // 1:可累计（每满减多少） 0: 不可累积
            amtType: '1', //  1 金额  2: 件数
            amount: '', // 消费金额或件数  300元, 3件
            discount: '', // 0.8  8折   30 减30块钱  根据  subType 决定是打折还是减元
            desc: '', // 描述
            btnLabel: '立即领券',
            multRules:[

            ],
            couponDesc:''
          }
        },
        couponTemplates: [],
        editPromoArgs: {title: '活动内容',data: {},show: false}, // 商品信息
        editCouponsArgs: {title: '编辑',data: {},show: false}, // 优惠券信息
        audTargetsNum: 369
      };
    },
    methods: {
      changeTpClass: function (tpClass) {
        let param = {params:{subType: tpClass}};
        campaignApi.getCampTplByClass(param).then(res=>{
          if (!res.errcode) {
            this.promoTemplates = res.data;
          }
        }).catch(e=>{
          console.log(e);
        });
      },
      // 活动基本信息
      getBaseInfo: function (){
        campaignApi.getCampaignsMainById({campaignId: this.campaignId}).then(res=>{
          // pick 萃取 要使用的 key
          this.baseInfo = _.pick(res.data, 'id', 'tpCategory', 'tpClass', 'campaignName', 'campaignDesc', 'startDate', 'endDate','publishPriorDays', 'ownerCompany','campaignCompany', 'priority','detailRules','contentTemplateId','couponTemplateId','isTargetingAll', 'regionId', 'status') ;
          if (this.baseInfo.couponTemplateId === '0') this.baseInfo.couponTemplateId = null;
          if (this.baseInfo.contentTemplateId === '0') this.baseInfo.contentTemplateId = null;
          this.isCreate = false;
          if (this.baseInfo.contentTemplateId){  // 活动内容已编辑
            campaignApi.getCampaignsContentById({campaignId:this.baseInfo.id, tplId:this.baseInfo.contentTemplateId}).then(res=>{
              if ( res.data.tpCampaignContents && res.data.tpCampaignContents.hasCoupon) {
                this.isCanEditCoupon = true;
              }
            }).catch(e=>{})
          }
          if (this.baseInfo.regionId) {
            this.$eventHub.$emit('getRegionId', this.baseInfo.regionId);
          }
        }).catch(e=>{
          this.isCreate = false;
        });
      },
      saveBaseInfo: function (baseInfo) {
        campaignApi.saveCampaignsMain(baseInfo).then(res=>{
          if (!res.errcode) {
            if (this.isCreate){
              this.isEditBaseInfo = false;
              this.isCreate = false;
              this.baseInfo.id = res.data;
              window.location.href = window.location.href + `?id=` + res.data;
            } else {
              this.isEditBaseInfo = false;
              // 获取门店
              this.getOutletsTypeAndGradeList();
            }
          }
        }).catch(e=>{
          this.$message.error('活动主信息保存失败 ' + e.message );
        })
      },
      handleBaseInfo: function (res) {
        if (res.operate === 10) {
          // 活动所属公司ownerCompany 活动执行门店 campaignCompany
          res.data.ownerCompany = res.data.ownerCompany || this.userInfo.companyCode;
          res.data.campaignCompany = res.data.campaignCompany || this.selectCompanyInfo.companyCode;
          this.saveBaseInfo(res.data);
        } else {
          this.isEditBaseInfo = false;
        }
      },
      changeBaseInfoEditStatus: function (type) {
        if (this.isCreate) {
          this.$refs['baseInfo'].saveBtn();
          return;
        };
        type = type || 'cancel';
        if (this.isEditBaseInfo && type ==='save'){
          this.$refs['baseInfo'].saveBtn();
        } else {
          this.isEditBaseInfo = !this.isEditBaseInfo;
        }
      },
      // 活动门店
      getOutletsInfo : function () {
        campaignApi.getCampaignsOutletsById({campaignId: this.campaignId}).then(res=>{
          // 解析绑定tags
          if (res.data.tpCampaignOutlets){
            res.data.tpCampaignOutlets = res.data.tpCampaignOutlets.map(item => {
              if (item.remark) {
                item['label'] = item.remark.split('_').pop() || '';
              }
              return item;
            });
            this.outletsInfo.regionId = this.baseInfo.regionId;
            this.outletsInfo.tags = res.data.tpCampaignOutlets;
            this.outletsInfo.selectTags = res.data.tpCampaignOutlets.map(item=>{ return item['remark']; });
          }
          // 1. 选中记录中构造出 {attrValue, attrType} 对象
          // 2. 在源数据中匹配出包含1的对象 。 1:{attrValue, attrType}对象
          // 3  匹配2的结果中取 row id 出来默认选中
          let findObj = [];
          let origin = this.outletsInfoOrigin;
          _.each(res.data.tpCampaignOutletAttrs, function (item) {
            let tmp = {codeType: item.attrType, codeValue: item.attrValue}; // 1
            findObj = findObj.concat(_.where(origin, tmp));  // 2
          });
          this.outletsInfo.outletsType = _.pluck(findObj, 'id'); //3
        }).catch(e=>{});
      },
      getOutletsTypeAndGradeList: function () {
        let param = {companyCode: this.selectCompanyInfo.companyCode};
        commonApi.getOutletsTypeAndGradeList(param).then((res)=>{
          this.outletsInfo.options = res.data;
          if (res.data[0] && res.data[0].options && res.data[1] && res.data[1].options){
            this.outletsInfoOrigin = res.data[0].options.concat(res.data[1].options);
          }
          this.getOutletsInfo();
        })
      },
      handleOutletsInfo: function () {

      },
      changeOutletsEditStatus: function (type) {
        type = type || 'cancel';
        if (this.isEditOutlets && type ==='save'){
          let param = {
            id: this.campaignId,
            tpCampaignOutlets: this.outletsInfo.tags,
            tpCampaignOutletAttrs: []
          };
          if (this.outletsInfo.outletsType.length > 0){
            let origin = this.outletsInfoOrigin;
            let findObj = [];
            // 1.根据选中id在源数据中找对应的对象 2. 只保留'codeType', 'codeValue' key
            _.each(this.outletsInfo.outletsType, function (item) {
              let nItem = _.findWhere(origin, {id: item});
              findObj.push({attrType: nItem.codeType, attrValue: nItem.codeValue});
            });
            param.tpCampaignOutletAttrs = findObj;
          }
          if (param.tpCampaignOutlets.length > 0) {
            campaignApi.saveCampaignsOutlets(param).then(res => {
              this.isEditOutlets = !this.isEditOutlets;
              this.$message.success('活动执行门店修改成功');
            }).catch(e=>{
              this.$message.error('活动执行门店修改失败 ' + e.message );
            })
          } else {
            this.$message.error('活动执行门店区域必选');
          }
        } else {
          this.isEditOutlets = !this.isEditOutlets;
        }
      },
      // 活动对象
      getAudTarget: function(){
        campaignApi.getCampaignsAudTargetsById({campaignId: this.campaignId}).then(res=>{
            this.audTargetsInfo.geosRule = _.where(res.data.tpCampaignAudTargets, {ruleType: 'GEO'});
          let rules = _.where(res.data.tpCampaignAudTargets, {ruleType: 'OTHER'});
          this.audTargetsInfo.rules = this.handleAudTargetRulesToShow(rules);
        }).catch(e=>{
          console.log(e);
        });
      },
      editAudTargetGeoDialog: function () {
        this.editAudTargetGeoArgs.show = true;
        this.editAudTargetGeoArgs.rulesFilter = [];
      },
      saveAudTargetGeos: function (res) {
        let that = this;
        res.forEach(function(i){
          if(that.audTargetsInfo.geosRule.some(function(item) {
            return item.valueIds == i.valueIds;
          })) {
            console.log('有重复');
          } else {
            that.audTargetsInfo.geosRule.push(i);
          }
        })
        let newGeo = this.audTargetsInfo.geosRule;
        let param = {
          id: this.baseInfo.id,
          tpCampaignAudTargets:newGeo
        };
        campaignApi.saveCampaignsAudTargets(param).then(rst=>{
          this.audTargetsInfo.show = false;
          this.getAudTarget();
          this.$message.success('活动对象 地域规则修改成功');
        }).catch(e=>{
          console.log(e);
        })
      },
      handleAudTargetRulesToShow: function (rules) {
        let nList = [];
        let _groupBy = _.groupBy(rules, item => item.ruleGroup);
        let _values = Object.keys(_groupBy);
        _values.forEach(item => {
          let _map = {name: '', items:[], ruleGroup: item};
          _map.name = `活动规则` + item;
          _groupBy[item].forEach(subItem=>{
            let obj = {tagId: subItem.tagId, tagName:subItem.tagName, valueIds: subItem.valueIds.split(','), id:subItem.id, valueNames: subItem.valueNames, type:'tag'};
            if (subItem.tagId === '999999'){
              obj.type = 'list';
              obj.tagId = subItem.valueIds;
            }
            _map.items.push(obj);
          });
          nList.push(_map);
        });
        return nList;
      },
      changeAudTargetEditStatus: function (type) {
        type = type || 'cancel';
        if (type === 'save' && !this.baseInfo.isTargetingAll) {
          let geoLen = this.audTargetsInfo.geosRule.length;
          let ruleLen = this.audTargetsInfo.rules.length;
          if (ruleLen > 0  || geoLen >0) {
            this.isEditAudTarget = !this.isEditAudTarget;
          } else {
            this.$message.error('活动当前不是定向全部人群，请添加地域规则或者人群定向规则');
          }
        } else {
          this.isEditAudTarget = !this.isEditAudTarget;
        }
      },
      editAudTargetDialogStatus: function (rule, index) {
        let _rule = JSON.parse(JSON.stringify(rule));
        this.editAudTargetArgs.rules = _rule.items;
        this.editAudTargetArgs.title =  (index? '定向人群规则' + index:'新增定向人群规则');
        this.editAudTargetArgs.show = true;
        this.editAudTargetArgs.ruleGroup = _rule.ruleGroup;
        this.editAudTargetArgs.checkTagValue = [];
        _rule.items.forEach(item=>{
          this.editAudTargetArgs.checkTagValue = this.editAudTargetArgs.checkTagValue.concat(item.valueIds);
        });
      },
      handleAudTargetEditDone: function (res) {
        let param = {
          id: this.baseInfo.id,
          tpCampaignAudTargets:res
        };
        campaignApi.saveCampaignsAudTargets(param).then(rst=>{
//          this.editAudTargetArgs.show = false;
//          let exist = false;
//          this.audTargetsInfo.rules.forEach(item=>{
//            if (item.ruleGroup === rst.data) {
//              exist = true;
//              item.items = res;
//            }
//          });
//          if (!exist) {
//            let newRule = {
//              name: `活动规则${rst.data}`,
//              items: res,
//              ruleGroup: rst.data
//            };
//            this.audTargetsInfo.rules.push(newRule);
//          }
          this.editAudTargetArgs.show = false;
          this.getAudTarget();
          this.$message.success('活动对象 活动规则修改成功');
        }).catch(e=>{
          this.$message.error(e.message);
        })
      },
      removeGeoTag: function (tag) {
        this.$confirm(`你确定要删除 地域 ${tag.tagName} 标签？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let param = {campaignId: this.campaignId, targetId: tag.id};
            tagApi.deleteTagRuleById(param).then(rst=>{
              // 删除 tag 当rule tag 删完时 整个rule 不显示
              let tagIndex = this.audTargetsInfo.geosRule.indexOf(tag);
              this.audTargetsInfo.geosRule.splice(tagIndex, 1);
              // 为了保存时数据不一致
              this.audTargetsInfo.geos.splice(this.audTargetsInfo.geos.indexOf(tag), 1);
            }).catch(e=>{
              this.$message.warning(e.message || '根据Id删除地域标签失败');
            })
        }).catch(e=>{})
      },
      removeTag: function (rule, tag) {
        this.$confirm(`你确定要删除 ${tag.valueNames} 标签？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {campaignId: this.campaignId, targetId: tag.id};
          tagApi.deleteTagRuleById(param).then(rst=>{
            // 删除 tag 当rule tag 删完时 整个rule 不显示
//            let ruleIndex = this.audTargetsInfo.rules.indexOf(rule);
//            let oldRule = this.audTargetsInfo.rules[ruleIndex];
//            if (oldRule.items && oldRule.items.length === 1) {
//              this.audTargetsInfo.rules.splice(ruleIndex, 1);
//            } else {
//              let itemsIndex = oldRule.items.indexOf(tag);
//              this.audTargetsInfo.rules[ruleIndex].items.splice(itemsIndex, 1);
//            }
            this.getAudTarget();
          }).catch(e=>{
            this.$message.warning(e.message || '根据Id删除标签失败');
          })
        }).catch(() => {
        });
      },
      removeRule: function (rule, index) {
        this.$confirm(`你确定要删除 定向规则${index} ？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {campaignId: this.campaignId, ruleGroup: rule.ruleGroup};
          tagApi.deleteTagRuleByGroup(param).then(rst=>{
            this.audTargetsInfo.rules.splice(this.audTargetsInfo.rules.indexOf(rule), 1);
          }).catch(e=>{
            this.$message.warning(e.message || '根据Id删除标签失败');
          })
        }).catch(() => {
        });
      },
      updateIsTargetingAll: function (event) {
        let tragetAll = event.target.checked;
        let displayStr = tragetAll ? '活动定向人群不生效!': '你确定取消选中全部人群？';
        this.$confirm(displayStr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((rst) => {
          let param = {id: this.campaignId, isTargetingAll: tragetAll};
          campaignApi.updateCampIsTargetingAll(param).then(res=>{
            this.$message.success('活动对象全部人群修改成功');
          }).catch(e=>{
            this.$message.warning(e.message || '活动对象 全部人群修改失败');
            this.baseInfo.isTargetingAll = !this.baseInfo.isTargetingAll;
          })
        }).catch(e=>{
          this.baseInfo.isTargetingAll = !this.baseInfo.isTargetingAll;
        })
      },
      // 活动内容
      changePromoEditStatus: function () {
        this.isEditContent = !this.isEditContent;
      },
      handlePromoEdit: function () {
        if (!this.baseInfo.id){
          this.$message.warning('请先保存活动,再编辑活动模板');
          return;
        }
        if (!this.baseInfo.contentTemplateId) {
          this.$message.warning('请先选择活动模板,再编辑活动模板');
          return;
        }
        campaignApi.getCampaignsContentById({campaignId:this.baseInfo.id, tplId:this.baseInfo.contentTemplateId}).then(res=>{
          this.editPromoArgs.show = true;
          this.editPromoArgs.data = Object.assign(res.data, {tpClass: this.baseInfo.tpClass});
        }).catch(e=>{
          this.$message.warning(res.message || '获取活动内容失败');
        })
      },
      handlePromoEditDone: function (campContent) {
        let ncampContent = Object.assign({}, campContent);
        let tpCampaignItems = ncampContent.tpCampaignItems;
        ncampContent.tpCampaignItems && delete ncampContent.tpCampaignItems;
        let param = {
          id: this.baseInfo.id,
          contentTemplateId: this.baseInfo.contentTemplateId,
          tpCampaignContents: ncampContent,
          tpCampaignItems: tpCampaignItems
        };
        campaignApi.saveCampaignsContent(param).then(res=>{
          // loading 优惠券
          this.editPromoArgs.show = false;
          this.changePromoEditStatus();
          this.$message.success('活动内容编辑成功!');
          if (ncampContent.hasCoupon){
            this.isCanEditCoupon = true;
            this.isEditCoupon = true;
          } else {
            this.isEditCoupon = false;
          }
        }).catch(e=>{
          this.$message.error(e.message || '活动内容编辑失败!');
        });

      },
      // 优惠券
      getCouponTpl: function () {
        let param = {params:{}};
        campaignApi.getCouponTplByClass(param).then(res=>{
          this.couponTemplates = res.data;
        }).catch(e=>{
          console.log(e);
        });
      },
      changeCouponEditStatus: function () {
        this.isEditCoupon = !this.isEditCoupon;
      },
      handleStructureCoupons: function (couponType, data) {
        let cp = Object.assign({}, this.couponsInfo, data ? data: {});
        if (typeof cp.couponData  === 'string'){
          cp.couponData = JSON.parse(cp.couponData);
        } else {
          cp.couponData = this.couponsInfo.couponData;
        }
        if (!cp.couponPeriodType){
          cp.couponPeriodType = 1;
        }
        cp.couponType = couponType;
        switch (couponType){
          case 1:
            cp.couponData.defaultColor = '#ff858d';
//            cp.couponData.cumulative = data.couponData.cumulative;
            break;
          case 2: // 满折码
            cp.couponData.defaultColor = '#ff8571';
//            cp.couponData.cumulative = data.couponData.cumulative;
            cp.discount = cp.discount * 10;
            break;
          case 3:  // 折扣码
            cp.couponData.defaultColor = '#e2ba30';
//            cp.couponData.cumulative = data.couponData.cumulative;
            cp.discount = cp.discount * 10;
            break;
          case 4:  // 抵用券
            cp.couponData.defaultColor = '#ff858d';
//            cp.couponData.cumulative = data.couponData.cumulative;
            break;
          case 5:
            cp.couponData.defaultColor = '#ff9751';
            cp.couponData.amtType = '2';
            break;
          case 6:
            cp.couponData.defaultColor = '#ff858d';
            cp.couponData.amtType = '1';
            break;
          case 7:
            cp.couponData.defaultColor = '#ff858d';
            cp.couponData.amtType = '2';
            break;
          default :
            cp.couponData.defaultColor = '#ff858d';
//            cp.couponData.cumulative = data.couponData.cumulative;
            break;
        }
        return cp;
      },
      handleCouponsEdit: function () {
        if (!this.baseInfo.id){
          this.$message.warning('请先保存活动,再编辑优惠券!');
          return;
        }
        if (!this.baseInfo.couponTemplateId) {
          this.$message.warning('请先选择优惠券模板,再编辑!');
          return;
        }
        let findObj = _.findWhere(this.couponTemplates, {id: this.baseInfo.couponTemplateId});
        campaignApi.getCampaignsCouponById({campaignId: this.campaignId}).then(res=>{
          this.editCouponsArgs.data = this.handleStructureCoupons(findObj['subType'], res.data.tpCampaignCoupons);
          this.editCouponsArgs.data['isReused'] = findObj.isReused;
          this.editCouponsArgs.show = true;
          this.editCouponsArgs.title = '优惠券编辑';
        }).catch(e=>{
          this.$message.warning(e.message || '根据模板ID获取优惠券信息失败');
        });
      },
      handleCouponsEditDone: function (coupons) {
        let nCoupons = Object.assign({}, coupons);
        if ([2, '2', 3,'3'].indexOf(nCoupons.couponType) > -1){
          nCoupons.discount = (nCoupons.discount / 10.0).toFixed(2);
        }
        nCoupons.couponData = JSON.stringify(nCoupons.couponData);
        let param = {
          id: this.baseInfo.id,
          tpCampaignCoupons: nCoupons,
          couponTemplateId: this.baseInfo.couponTemplateId
        };
        campaignApi.saveCampaignsCoupon(param).then(res=>{
          this.editCouponsArgs.show = false;
          this.changeCouponEditStatus();
          this.$message.success('优惠券信息保存成功');
        }).catch(e=>{
          this.$message.warning(e.message || '优惠券信息保存失败');
        })
      }
    },
    mounted() {
      if (this.$route.query.id){
        this.campaignId = this.$route.query.id;
        this.getBaseInfo();
        // 加载初始化数据
        this.getOutletsTypeAndGradeList();
        this.getAudTarget();
        this.getCouponTpl();
      } else {
        this.isEditBaseInfo = true;
      }
    }
  };
</script>

<style lang="scss">
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
  .label-content {
    margin-top: 10px;
  }

  .aud-target-rule{
    margin: 10px 0;
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

  .geo-tag-rule {
    margin-top: 10px;
    padding: 0 5px 5px 5px;
    .item-tag {margin-top: 5px;}
    .item-tag:first-child {margin-left: 5px;}
    .item-tag + .item-tag {margin-left: 5px;}
  }



</style>
