<template>
  <div>
    <div id="top">
      <p>1.选择报表</p>
      <div class="line">
        <div class="outer" :class="activeClass[0]" @click="handleTypeOfForm(0)">
          <h3>门店经营报表</h3>
          <p>门店销售和粉丝情况，以及会员销售的占比分析</p>
        </div>
        <div class="outer" :class="activeClass[1]" @click="handleTypeOfForm(1)">
          <h3>导购业绩报表</h3>
          <p>门店每个导购的粉丝情况及其会员销售构成</p>
        </div>
        <div class="outer" :class="activeClass[2]" @click="handleTypeOfForm(2)">
          <h3>会员结构报表</h3>
          <p>门店新老体系会员的RFM、活跃度情况</p>
        </div>
      </div>
      <div class="line">
        <div class="outer" :class="activeClass[3]" @click="handleTypeOfForm(3)">
          <h3>回头率分析报表</h3>
          <p>门店新老体系会员的销售额、回头率情况</p>
        </div>
        <div class="outer" :class="activeClass[4]" @click="handleTypeOfForm(4)">
          <h3>活动效果报表</h3>
          <p>活动各环节情况、涉及覆盖、触达、领券、用劵、POS数、客单价情况</p>
        </div>
        <div class="outer" :class="activeClass[5]" @click="handleTypeOfForm(5)">
          <h3>人群效果报表</h3>
          <p>从活动定向的每类人群角度，对活动更各环节转化情况分析</p>
        </div>
      </div>
    </div>
    <div id="middle">
      <p>2.选择报表周期类型</p>
      <div class="line">
        <div class="outer" :class="timeActiveClass[0]" v-if="timeShow[0].show"
             @click="handleTime(0)">
          <h3>日报</h3>
        </div>
        <div class="outer" :class="timeActiveClass[1]" v-if="timeShow[1].show"
             @click="handleTime(1)">
          <h3>周报</h3>
        </div>
        <div class="outer" :class="timeActiveClass[2]" v-if="timeShow[2].show"
             @click="handleTime(2)">
          <h3>月报</h3>
        </div>
      </div>
    </div>
    <div id="bottom">
      <p>3.选择条件</p>
      <div class="line">
        <div>
          <span>筛选时间</span>
          <template v-if="timeType=='0'">
            <el-date-picker
              v-model="selTime.date.start"
              type="date"
              placeholder="选择开始日期"
              :picker-options="startDateOpt">
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="selTime.date.end"
              type="date"
              placeholder="选择截止日期"
              :picker-options="endDateOpt">
            </el-date-picker>
          </template>
          <template v-if="timeType=='1'">
            <el-date-picker
              v-model="selTime.week"
              type="week"
              format="yyyy 第 WW 周"
              placeholder="选择周"
              :picker-options="weekPickerOptions">
            </el-date-picker>
          </template>
          <template v-if="timeType=='2'">
            <el-date-picker
              v-model="selTime.month"
              type="month"
              placeholder="选择月"
              :picker-options="monthPickerOptions">
            </el-date-picker>
          </template>
        </div>
      </div>
      <div class="line" v-if="!admin">
        <div>
          <span>所属分区</span>
          <el-select v-model="regionId" placeholder="请选择大区" name="region" @change="changeRegion">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="line" v-if="admin">
        <div>
          <span>所属分区</span>
          <el-select v-model="regionIds" placeholder="请选择大区" name="region" @change="changeRegion" multiple>
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="line" v-if="campaignShow">
        <div>
          <span>选择活动</span>
          <el-select v-model="campaigns" multiple placeholder="请选择活动" v-if="campaignShow">
            <el-option
              v-for="item in campaignOptions"
              :key="item.id"
              :label="item.campaignName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="line" v-if="!campaignShow">
        <div id="outlet">
          <outlets :inputs="outletsInfo" :regionIds="regionIds" ref="outletsInfo"></outlets>
        </div>
      </div>
      <div class="line">
        <el-button @click.native="createReport" v-if="btnStatus">生成报告</el-button>
        <el-button  disabled v-else>请选择条件</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import reportApi from 'api/report'
  import commonApi from 'api/common';
  import regionApi from 'api/region';
  import CampaignApi from 'api/campaign'
  import {mapGetters, mapActions} from 'vuex'
  import Outlets from './Outlets.vue';
  import $Rpt from '../../supports/util/report_setting';
  export default{
    components: {
      Outlets
    },
    data: function () {
      return {
        admin: false,
        regionId: '',
        regionIds: [],
        regionList: [{id: '', name: ''}],
        formType: 0,
        timeType: 0,
        activeClass: [{active: true}, {active: false}, {active: false}, {active: false}, {active: false}, {active: false}],
        timeActiveClass: [{active: true}, {active: false}, {active: false}],
        timeShow: [{show: true}, {show: true}, {show: true}],
        selTime: {
          date: {start: '', end: ''},
          week: '',
          month: ''
        },
        campaignOptions: [],
        campaigns: [],
        campaignShow: false,
        weekPickerOptions: {
          firstDayOfWeek: 1,
          disabledDate: (time) => time > new Date()
        },
        monthPickerOptions: {
          disabledDate: (time) => time > new Date()
        },
        startDateOpt: {
          disabledDate: (time) => time > new Date()
        },
        endDateOpt: {
          disabledDate: (time) => time > new Date() || time < this.selTime.date.start
        },
        isEditOutlets: true,
        outletsInfo: {
          outlets: [],
          tags: [],
          selectTags: [],
          outletsType: [],
          options: []
        }
      }
    },
    computed: {
      btnStatus: {
        get: function () {
          return this.timeType !== '' && this.formType !== '' && (this.regionId != '' || this.regionIds != '') && ((this.selTime.date.start != '' && this.selTime.date.end != '') || this.selTime.week != '' || this.selTime.month != '')
        },
        set: function () {
        }
      },
      ...mapGetters({
        companyType: 'getSelectCompanyType',
        userInfo: 'getUserInfo',
        selectCompanyInfo: 'getSelectCompanyInfo'
      })
    },
    methods: {
//     分区变化处理
      changeRegion: function (region) {
        this.resetOutletsInfo()
        this.resetCampaign()
        if (region) {
          if (this.admin == false) {
            this.regionIds[0] = this.regionId
            this.regionIds.push('onlyone')
            if (this.campaignShow) {
              this.getCampaignByClass(this.regionIds[0])
            }
          }
          else {
            if (this.campaignShow) {
              this.regionIds.forEach((regionId) => {
                this.getCampaignByClass(regionId)
              })
            }
          }
        }
      },
//      获得分区列表
      getRegionList: function () {
        let param = {companyCode: this.selectCompanyInfo.companyCode, depth: 1};
        commonApi.getOrganizationStructure(param).then((res) => {
          if (res && res.data) {
            this.regionList = res.data;
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
//      根据regionId获取活动
      getCampaignByClass: function (regionId) {
        let param = {companyCode: this.selectCompanyInfo.companyCode, regionId: regionId};
        CampaignApi.getCampaignByClass(param).then((res) => {
          if (res && res.data) {
            if (this.admin === false) {
              this.campaignOptions = res.data
            }
            else {
              this.campaignOptions.push(...res.data)
            }
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
//      报表类型选择处理
      handleTypeOfForm(index){
        this.resetData()
        this.resetOutletsInfo()
        this.formType = index
        this.activeClass.forEach((val, index0, arr) => arr[index0].active = false)
        this.activeClass[index].active = true
        switch (index) {
          case 0:
            this.timeShow.forEach((val, index0, arr) => arr[index0].show = true);
            this.campaignShow = false
            break;
          case 1:
            this.timeShow[2].show = this.timeShow[0].show = true;
            this.timeShow[1].show = false;
            this.campaignShow = false
            break;
          case 2:
            this.campaignShow = false
            this.timeShow[0].show = true;
            this.timeShow[1].show = this.timeShow[2].show = false;
            break;
          case 3:
            this.campaignShow = false
            this.timeShow[0].show = this.timeShow[1].show = false;
            this.timeShow[2].show = true;
            break;
          case 4:
            this.campaignShow = true;
            this.timeShow[0].show = true;
            this.timeShow[1].show = this.timeShow[2].show = false;
            break;
          case 5:
            this.timeShow.forEach((val, index0, arr) => arr[index0].show = true);
            this.campaignShow = true
            break;
        }
//        选中当前显示的第一个时间
        for (var i = 0; i < 3; i++) {
          if (this.timeShow[i].show) {
            this.handleTime(i)
            break;
          }
        }
      },
//      周期选择处理
      handleTime(index){
        this.resetData()
        this.timeType = index
        this.timeActiveClass.forEach((val, index0, arr) => {
          arr[index0].active = false
        })
        this.timeActiveClass[index].active = true
      },
//      重置选择时间、分区
      resetData(){
        this.selTime.date.start = this.selTime.date.end = this.selTime.week = this.selTime.month = ''
        this.regionId = ''
        this.regionIds = []
      },
//      重置省市选择
      resetOutletsInfo(){
        this.outletsInfo.outlets = []
        this.outletsInfo.tags = []
        this.outletsInfo.selectTags = []
        this.outletsInfo.outletsType = []
        this.outletsInfo.options = []
      },
//      重置活动
      resetCampaign(){
        this.campaignOptions = []
        this.campaigns = []
      },
//      根据时间获取周数
      getWeekNumber(src) {
        var date = new Date(src.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
      },
//      处理分区、省、市、县、门店数据
      handlePlace(type){
//          去重、去除空数据
        return this.outletsInfo.tags.map((obj) => obj[type]).filter((val, index, arr) => val !== '' && arr.indexOf(val) == index)
      },
//      格式化日期
      formatDate(date){
        if (date) {
          return date.getFullYear() + '-' + parseInt(date.getMonth() + 1) + '-' + date.getDate()
        }
      },
//      点击生成报表处理
      createReport(){
//          todo:管理员判断
        this.btnStatus = false
        let now = new Date()
        var rptOption
        switch (this.formType) {
          case 0:
            rptOption = $Rpt['rptOutletSale'];
            break;
          case 1:
            rptOption = $Rpt['rptUserSalePerformance'];
            break;
          case 2:
            rptOption = $Rpt['rptAudienceComposition'];
            break;
          case 3:
            rptOption = $Rpt['rptReturnRatio'];
            break;
          case 4:
            rptOption = $Rpt['rptCampaignEffect'];
            break;
          case 5:
            rptOption = $Rpt['rptCampaignListEffect'];
            break;
        }
        let param = {
          page: {
            records: []
          },
          params: {
            province_id: [],
            city_id: [],
            county_id: [],
            outlet_id: [],
            region_id: [],
            company_code: this.selectCompanyInfo.companyCode,
            rpt_type: this.timeType + 1,
            region_id: this.regionIds.filter((val) => val != 'onlyone'),
            campaigns: this.campaigns,
            start_date: this.formatDate(this.selTime.date.start),
            end_date: this.formatDate(this.selTime.date.end),
            rpt_month: this.selTime.month != '' ? this.selTime.month.getMonth() + 1 : '',
            rpt_week: this.selTime.week != '' ? this.getWeekNumber(this.selTime.week) : '',
          },
          fileName: this.formatDate(now).split('-').join('') + ".xls",
          now: this.formatDate(now),
          headers: rptOption.columns,
          processStatus: 1,
          reportId: rptOption.rptId,
          reportName: rptOption.rptTitle,
          exportAction: 0,
          exportExcel: true
        };
        param.params.province_id = this.handlePlace('provId')
        param.params.city_id = this.handlePlace('cityId')
        param.params.county_id = this.handlePlace('countyId')
        param.params.outlet_id = this.handlePlace('outletId')
        switch (this.timeType) {
          case 0:
            param.reportName = rptOption.rptTitle + '日报';
            param.params.rpt_year = this.selTime.date.start.getFullYear()
            break;
          case 1:
            param.reportName = rptOption.rptTitle + '周报';
            param.params.rpt_year = this.selTime.week.getFullYear()
            break;
          case 2:
            param.reportName = rptOption.rptTitle + '月报';
            param.params.rpt_year = this.selTime.month.getFullYear()
            break;
        }
        console.log(JSON.stringify(param, null, 4))
        reportApi.getReport(param);
      },
    },
    mounted(){
      this.getRegionList();
    }
  }
</script>
<style scoped lang="scss">
  * {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  }

  h3 {
    color: #333333;
    font-weight: normal;
  }

  .line {
    min-width: 897px;
    margin-left: 30px;
    box-sizing: border-box;
    padding: 8px;
    .outer {
      margin-right: 22px;
      vertical-align: middle;
      box-sizing: border-box;
      display: inline-block;
      border: 1.7px solid #797979;
      width: 247px;
      height: 91px;
      line-sizing: border-line;
      padding: 10px;
      cursor: pointer;
      h3 {
        font-size: 15px;
        margin-top: 0px;
        margin-bottom: 5px;
        color: #333333;
        font-weight: normal;
      }
    ;
      p {
        font-size: 13px;
        margin: 0px;
        color: #999999;
      }
    }
  }

  #middle > .line > .outer {
    height: 40px;
    width: 100px;
    h3 {
      margin-bottom: 0px;
      text-align: center;
    }
  }

  #bottom {
    .line {
      padding: 3px;
      /*color: #999999;*/
    }

  }

  .line > .outer.active {
    border: 1.7px solid #269fd6;
    h3 {
      color: #269fd6;
    }
  }

  #outlet {
    margin-left: -20px;
    width: 600px;
  }
</style>
