<template>
  <section>
    <!--<el-row>-->
      <!--<el-col :span="24" class="toolbar">-->
        <!--<el-form :inline="true" :model="filters">-->
          <!--<el-form-item label="">-->
            <!--<region-and-outlets :companyCode="userInfo.companyCode"></region-and-outlets>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" icon="search">查询</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <el-row class="stats-container">
      <el-col :span="3">会员总数</el-col>
      <el-col :span="3">本周新增</el-col>
      <el-col :span="3">本周流失</el-col>
    </el-row>
    <el-row>
      <el-col :span="3"><label>{{listStats.totalCount|number}}</label></el-col>
      <el-col :span="3"><label>{{listStats.wkCount|number}}</label></el-col>
      <el-col :span="3"><label>{{listStats.disappearedCounts|number}}</label></el-col>
    </el-row>
    <el-row class="chart-container">
      <el-col :span="8">
        <div id="chartPieGender" style="width:100%; height:300px;"></div>
      </el-col>
      <el-col :span="8">
        <div id="chartColumnAge" style="width:100%; height:300px;"></div>
      </el-col>
      <el-col :span="8">
        <div id="chartColumnReside" style="width:100%; height:300px;"></div>
      </el-col>
      <el-col :span="24">
        <div id="chartLineGrow" style="width:100%; height:300px;"></div>
      </el-col>
    </el-row>
  </section>

</template>

<script>
  import { mapGetters } from 'vuex'
  import echarts from 'echarts'
  import RegionAndOutlets from 'components/RegionAndOutlets.vue'
  import {$listener, LSN} from 'supports/service/events';

  import AudienceApi from '../../api/audience';

  export default {
    data() {
      return {
        filters: {
          region:'',
          store:''
        },
        listStats:{},
        chartPieGender: null,
        chartColumnAge: null,
        chartColumnReside: null,
        chartLineGrow: null
      }
    },
    methods:{
      getListStats(){
        let companyCode = this.selectCompanyInfo.companyCode,
        listId = this.$route.query.listId;
        AudienceApi.getListsStats(companyCode, listId).then((res) => {
          this.listStats = res != null && res.length > 0 ? res[0] : {totalCount:0, wkCount:0,disappearedCounts:0};
        });
      },
      getListArrayAttr(ls,k){
        let _ = [];
        ls.forEach(l =>{_.push(l[k]);});
        return _;
      },
      getListsScenograph(){
        let companyCode = this.selectCompanyInfo.companyCode,
          listId = this.$route.query.listId;
        AudienceApi.getListsScenograph(companyCode, listId).then((res) => {
          this.chartPieGender = echarts.init(document.getElementById('chartPieGender'));
          this.chartColumnAge = echarts.init(document.getElementById('chartColumnAge'));
          this.chartColumnReside = echarts.init(document.getElementById('chartColumnReside'));
          this.chartLineGrow = echarts.init(document.getElementById('chartLineGrow'));

          this.chartPieGender.setOption({
            title: {
              text: '会员性别',
              subtext: '',
              x: 'left'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              data: this.getListArrayAttr(res.gender,'name')
            },
            series: [
              {
                name: '会员性别',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: res.gender,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          });

          this.chartColumnAge.setOption({
            title: { text: '会员年龄' },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : 共{c}人"
            },
            xAxis: {
              data: this.getListArrayAttr(res.age,'name')
            },
            yAxis: {},
            series: [{
              name: '年龄段',
              type: 'bar',
              data: this.getListArrayAttr(res.age,'totalCount')
            }]
          });

          this.chartColumnReside.setOption({
            title: { text: '会员居住分布' },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}人"
            },
            xAxis: {
              data: this.getListArrayAttr(res.reside,'name')
            },
            yAxis: {},
            series: [{
              name: '人数',
              type: 'bar',
              data: this.getListArrayAttr(res.reside,'totalCount')
            }]
          });

          this.chartLineGrow.setOption({
            title: {
              text: '会员增长趋势'
            },
            tooltip: {
              trigger: 'axis',
              formatter: "{a} <br/>{b} : 共{c}人"
            },
            legend: {
              data: []
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.getListArrayAttr(res.grow,'name')
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '',
                type: 'line',
                stack: '人数',
                data: this.getListArrayAttr(res.grow,'totalCount')
              }
            ]
          });
        });
      }
    },
    components:{
      RegionAndOutlets
    },
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    mounted(){
      this.getListStats();
      this.getListsScenograph();
//      $listener.$on(LSN.COMPANY_CHANGE, ()=>{
//        this.getListStats();
//      });


    }
  }

</script>

<style scoped>
  .chart-container {
    width: 100%;
    float: left;
    margin-top: 50px;
  }
  .stats-container{
    margin-top: 40px;
  }
  label{
    font-size: 22px;
    font-weight:bold;
  }


</style>
