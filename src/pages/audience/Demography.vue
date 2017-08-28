<template>
  <section>
    <!--<el-row>-->
      <!--<el-col :span="24" class="toolbar">-->
        <!--<el-form :inline="true" :model="filters">-->
          <!--<el-form-item label="">-->
            <!--<region-and-outlets :companyCode="userInfo.companyCode"></region-and-outlets>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" icon="search" v-on:click="getDemography">查询</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</el-col>-->
    <!--</el-row>-->

    <el-table :data="demographyList" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" label="编号" width="80">
      </el-table-column>
      <el-table-column prop="listName" label="名称" min-width="140" sortable>
      </el-table-column>
      <el-table-column prop="listDesc" label="描述" min-width="260" sortable>
      </el-table-column>
      <el-table-column prop="totalCount" label="规模" width="100" sortable>
      </el-table-column>
      <el-table-column prop="wkCount" label="本周新增" width="130" sortable>
      </el-table-column>
      <el-table-column prop="" label="本周减少" width="130" sortable>
      </el-table-column>
      <el-table-column prop="totalOrdAmt" label="本周销售额" width="130" sortable>
      </el-table-column>
      <el-table-column prop="" label="平均客单价" :formatter="avgAmount" width="130" sortable>
      </el-table-column>
      <el-table-column label="" width="160">
        <template scope="scope">
          <el-button type="info" v-if="scope.row.totalOrdAmt" style="float: right" @click="handleInfo(scope.row)" >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {$listener, LSN} from 'supports/service/events';

  import RegionAndOutlets from '../../components/RegionAndOutlets.vue'
  import AudienceApi from '../../api/audience';

  export default {
    data(){
      return {
        filters: {
          region: '',
          store: ''
        },
        region: '',
        store: '',
        regions:[],
        listLoading: false,
        demographyList:[]
      }
    },
    methods:{
      avgAmount(row,column){
        return row.totalOrdAmt == null  ? '' : (row.totalOrdAmt/row.totalCount).toFixed(2) ;
      },
      getDemography(){
        let queryParams = {
          params: {
            companyCode:this.selectCompanyInfo.companyCode
          }
        };
        this.listLoading = true;
        AudienceApi.getListsListStats(queryParams).then((res) => {
          this.demographyList = res;
          this.listLoading = false;
        });
      },
      handleInfo(row){
        this.$router.push({path: '/audience/manager?listId='+row.vipCat});
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
      this.getDemography();
//      $listener.$on(LSN.COMPANY_CHANGE, ()=>{
//        this.getDemography();
//      });
    }
  }

</script>

<style scoped>
</style>
