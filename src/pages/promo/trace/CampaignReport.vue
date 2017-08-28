<template>
  <section class="chart-container">
    <el-row>
      <el-col :span="24">
        <div id="chartColumn" style="width:100%; height:400px;"></div>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <div style="border: 1px solid #9c9c9c; margin-top: 20px;">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="trackingDate" label="日期" style="width: 20%"></el-table-column>
            <el-table-column prop="totalReaches" label="触达" style="width: 20%"></el-table-column>
            <el-table-column prop="totalOutlets" label="到店" style="width: 20%"></el-table-column>
            <el-table-column prop="totalOrders" label="消费次数" style="width: 20%"></el-table-column>
            <el-table-column prop="totalOrderAmount" label="消费金额" style="width: 10%"></el-table-column>
            <el-table-column prop="totalRate" label="转化率" style="width: 10%"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

  </section>
</template>

<script>
  import echarts from 'echarts';
  import campaignApi from '../../../api/campaign';

  export default {
    data() {
      return {
        chartColumn: null,
//        tableData:[{name:'1', desc:'asd', totalCounts:"a", A:'', B:'',C:''}],
        dateList:[],
        promoteNumList:[],
        arriveList:[],
        consumeNum:[],
        monetary:[],
        usedTimes:0
      }
    },
    props:['campId','tableData'],
    methods:{
      getTracking(id) {
        let that = this;
          if(that.usedTimes === 0){
            that.usedTimes++;
            let params = {campaignId:id};
            campaignApi.getTrackingById(params).then((rst)=>{
              try {
                if(rst.data.length !== 0){
                  rst.data.forEach((index)=>{
                    that.dateList.push(index.trackingDate);
                    that.promoteNumList.push(index.totalReaches);
                    that.arriveList.push(index.totalOutlets);
                    that.consumeNum.push(index.totalOrders);
                    that.monetary.push(index.totalOrderAmount);
                  });
                }
              } catch (err){
                console.log(err);
              }

              that.chartLine.setOption({
                title: {
                  text: '执行情况'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['促达', '到店', '消费次数','消费金额']
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
                  data: that.dateList
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: '促达',
                    type: 'line',
                    stack: '总量',
                    data: that.promoteNumList
                  },
                  {
                    name: '到店',
                    type: 'line',
                    stack: '总量',
                    data: that.arriveList

                  },
                  {
                    name: '消费次数',
                    type: 'line',
                    stack: '总量',
                    data: that.consumeNum
                  },
                  {
                    name: '消费金额',
                    type: 'line',
                    stack: '总量',
                    data: that.monetary
                  }
                ]
              });
            }).catch((err)=>{
              console.log(err);
            })
          } else {
              return false;
          }
      },
    },
    mounted() {

    },
    beforeUpdate() {

    },
    watch: {
      campId:function () {
        this.getTracking(this.campId);
        //基于准备好的dom，初始化echarts实例
        this.chartLine = echarts.init(document.getElementById('chartColumn'));
      }
    }
  }

</script>

<style scoped>
  .chart-container {
    width: 100%;
    float: left;
  }
  /*.chart div {
      height: 400px;
      float: left;
  }*/

  .el-col {
    padding: 30px 20px;
  }
</style>
