<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" class="demo-form-inline" >
        <el-form-item label="活动目的">
          <el-select v-model="filters.categoriesValue" filterable  placeholder="请选择" @change="onSearch">
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in filters.categoriesOptions"
              :key="item.tpCategory"
              :label="item.name"
              :value="item.tpCategory">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.statusValue" filterable multiple placeholder="请选择" @change="onSearch" style="width: 300px;">
            <el-option
              v-for="item in filters.statusOptions"
              :key="item.status"
              :label="item.statusName"
              :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" @keyup.enter="onSearch">查询</el-button>
        </el-form-item>

        <el-form-item label="显示已结束活动">
          <el-checkbox v-model="filters.isEndActivity" @change="onSearch" :disabled="disableCheckBox"></el-checkbox>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="activeList" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column prop="id" label="活动Id" min-width="180">
          <template scope="scope">
            <div @click="campaignTrace(scope.row.id)" style="color: #20a0ff;cursor: pointer;">
              <span>{{scope.row.id}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="活动目的" min-width="120" sortable>
          <template scope="scope">{{getCategoriesByCode(scope.row.tpCategory)}}</template>
        </el-table-column> -->
        <el-table-column prop="campaignName" label="活动名称" min-width="240">
        </el-table-column>
        <el-table-column label="活动分区" min-width="100">
          <template scope="scope">{{scope.row.regionName}}</template>
        </el-table-column>
        <el-table-column label="计划开始时间" min-width="160">
          <template scope="scope">
            {{scope.row.startDate|formatDate}} 至<br/>
            {{scope.row.endDate|formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="剩余/总券数" min-width="130">
          <template scope="scope">
            {{scope.row.tpCampaignCoupons.couponBalanceQty | emptyNotZero}}/<br/>{{scope.row.tpCampaignCoupons.couponQty | emptyNotZero}}
          </template>
        </el-table-column>
        <el-table-column prop="reagon" label="执行区域/门店" width="150" sortable>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template scope="scope">{{scope.row.status|BAStatusFormatter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template scope="scope">
            <el-button type="text" v-if="scope.row.status == 10" @click="editCampaign(scope.row)">编辑</el-button>
            <el-button type="text" v-if="scope.row.status == 10" @click="confirmCampaign(scope.index, scope.row)">确认</el-button>
            <el-button type="text" v-if="scope.row.status == 10" @click="ZUOFEICampaign(scope.index, scope.row)">作废</el-button>
            <el-button type="text" v-if="scope.row.status == 40" @click="editCampaign(scope.row)">编辑</el-button>
            <el-button type="text" v-if="scope.row.status == 40" @click="ZUOFEICampaign(scope.index, scope.row)">作废</el-button>
            <el-button type="text" v-if="scope.row.status == 50" @click="ztCampaign(scope.index, scope.row)">暂停</el-button>
            <el-button type="text" v-if="scope.row.status == 50" @click="closeCampaign(scope.index, scope.row)">结束</el-button>
            <el-button type="text" v-if="scope.row.status == 55" @click="editCampaign(scope.row)">编辑</el-button>
            <el-button type="text" v-if="scope.row.status == 55" @click="zxCampaign(scope.index, scope.row)">继续执行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <Pagination :currentPage=this.currentPage :total=this.total :pageSize=this.pageSize :pageSizes=this.pageSizes  v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange" ></Pagination>
  </section>
</template>

<script>
  import Pagination from '../../components/Pagination.vue'
  import lookup from '../../supports/lookup';
  import { mapGetters, mapActions } from 'vuex';
  import campaignApi from 'src/api/campaign';
  import paApi from '../../api/pa';
  import _ from 'underscore';

  const CAMPAIGN_FINISH = 40;

  export default {
    data () {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 20,
        pageSizes:[10,20,50,100],
        listLoading: false,
        initStatus: [],
        closeStatus: [0, 28, 60, 99],  // 0 作废  28无效  60结束  99关闭
        disableCheckBox: false,
        filters: {
          isEndActivity: false,
          categoriesValue: '',
          categoriesOptions: [],
          typeValue: '',
          typeOptions: [],
          statusValue: [],
          statusOptions: [],
        },
        activeList:[{tpCampaignCoupons: {couponBalanceQty: 0, couponQty: 0}}],
        partitionList: []
      }
    },
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    methods: {
      initData: function(){
        this.getAllSelectOption();
      },
      forEachItem(arrayList, key, value){
        let objDict = {};
        for( let i=0; i < arrayList.length; i++){
          let obj = arrayList[i];
          objDict[obj[key]] = obj[value]
        }
        return objDict;
      },
      // 筛选菜单数据
       getAllSelectOption: function(){
         this.getCategoriesList();
         this.getCampaignsTypes();
         this.getStatusList();
      },
      getStatusList: function () {
        campaignApi.getCampaignStatusList({}).then(res =>{
          if (res.data && res.data.length > 0){
            this.filters.statusOptions = res.data;
            this.initStatus = res.data.filter((item)=>{
              return this.closeStatus.indexOf(item.status) <= -1;
            }).map((obj) => {
              return obj.status;
            });
            this.getPageActive();
          };
        }).catch(err =>{
        })
      },
      getCategoriesList: function () {
        campaignApi.getCampaignCategoriesList({}).then(res =>{
          if (res.data && res.data.length > 0){
            this.filters.categoriesOptions = res.data;
          };
        }).catch(err =>{
        })
      },
      getCampaignsTypes: function () {
        campaignApi.getCampaignsTypesList({}).then(res =>{
          if (res.data && res.data.length > 0){
            this.filters.typeOptions = res.data;
          };
        }).catch(err =>{
        })
      },
      getCategoriesByCode: function(code){
        let str = '';
        if (this.categoriesOptions) {
          let obj = this.categoriesOptions.filter(item => {
            return item.tpCategory == code;
          });
          if (obj) {
            str = obj['name'];
          }
        }
        return str;
      },
      // 页面查询 - 页大小
      handleSizeChange: function (pageSize){
        this.pageSize = pageSize;
        this.getPageActive();
      },
      // 分页查询 - 按页查询
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
        this.getPageActive();
      },
      // 分页获取活动数据
      getPageActive:function(){
        let statusFilter = this.initStatus;
        if (this.filters.statusValue.length > 0) {
          statusFilter = this.filters.statusValue;
          this.filters.isEndActivity = false;
          this.disableCheckBox = true;
        } else {
          this.disableCheckBox = false;
          if (this.filters.isEndActivity){
            statusFilter = statusFilter.concat(this.closeStatus);
          }
          // isEndActivity 没选择 默认使用 this initStatus 的状态（也就是不包含 关闭状态）
        }

        let queryParams = {
          params: {
            tpType: this.filters.typeValue || undefined,
            statusList: statusFilter,
            category: this.filters.categoriesValue || undefined,
            ownerCompany: this.selectCompanyInfo.companyCode,
            userRegionId: this.userInfo.regionId,
            userType: this.userInfo.userType
          },
          page: {
            current: this.currentPage,
            size: this.pageSize,
            asc: false,
            orderByField: 'id'
          }
        };
        this.listLoading = true;
        campaignApi.getCampaignList(queryParams).then((res)=>{
          // 分页导航
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
          this.activeList = res.data.records;
          this.listLoading = false;
        }).catch((err)=>{
          this.listLoading = false;
        });
      },
      onSearch: function() {
        this.getPageActive();
      },
      closeCampaign: function(index, row){
        this.$confirm('此操作将活动进入关闭, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let closeStatus =lookup.BAStatusType.JIESU.Code;
          this.changeStatus(row.id, closeStatus);
        }).catch(() => {

        });
      },
      ZUOFEICampaign: function (index, row) {
        this.$confirm('此操作将作废活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dzx = lookup.BAStatusType.ZUOFEI.Code;
          this.changeStatus(row.id, dzx);
        }).catch(() => {
        });
      },
      confirmCampaign: function (index, row) {
        this.$confirm('此操作将活动进入待执行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dzx = lookup.BAStatusType.DAIZHIXIN.Code;
          this.changeStatus(row.id, dzx);
        }).catch(() => {});
      },
      zxCampaign: function (index, row) {
        this.$confirm('此操作将活动进入继续执行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dzx = lookup.BAStatusType.ZHIXINZHONG.Code;
          this.changeStatus(row.id, dzx);
        }).catch(() => {});
      },
      ztCampaign: function (index, row) {
        this.$confirm('此操作将活动进入暂停状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dzx = lookup.BAStatusType.ZANTING.Code;
          this.changeStatus(row.id, dzx);
        }).catch(() => {});
      },
      editCampaign: function(row){
        this.$router.push({path:'/promo/campaign', query:{id:row.id}});
      },
      campaignTrace: function(id){
        this.$router.push({path:'/promo/trace/' + id});
      },
      changeStatus: function(id,status){
          let param = { status: status , id:id};
          this.listLoading = true;
        campaignApi.updateCampaignStatus(param).then((res) =>{
            this.listLoading = false;
            this.$notify({
              title: '成功',
              message: '活动状态更新成功',
              type: 'success'
            });
            this.getPageActive();
          }).catch((err)=>{
            this.listLoading = false;
            this.$message.error(err.message);
          })
      }
    },
    components: {
      Pagination
    },
    mounted() {
      this.initData();
    }
  }
</script>

<style scoped>

</style>
