<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" class="demo-form-inline" >
        <el-form-item label="状态" >
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
      </el-form>
    </el-col>
    <!--列表-->
    <template>
      <el-table :data="shortLinkList" border v-loading="listLoading" style="width: 100%">
        <el-table-column prop="id" label="活动Id" width="200">
          <template scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column prop="campaignName" label="活动名称"></el-table-column>
        <el-table-column prop="shortLink" label="短链" width="300"></el-table-column>
        <el-table-column label="状态" width="100">
          <template scope="scope">{{scope.row.status.toString()|BAStatusFormatter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button type="text" v-if="!scope.row.shortLink && scope.row.tpClass !== '5'" @click="generateShortLink(scope.row)">生成短链</el-button>
            <el-button type="text" v-if="scope.row.shortLink && scope.row.tpClass !== '5'" @click="generateShortLink(scope.row)">重新生成</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>
    <pagination-list :currentPage=this.currentPage :total=this.total :pageSize=this.pageSize :pageSizes=this.pageSizes  v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange" ></pagination-list>
  </section>
</template>

<script>
  import PaginationList from '../../../components/Pagination.vue'
  import lookup from 'supports/lookup';
  import campaignApi from 'src/api/campaign';
  import settings from 'supports/settings'
  import _ from 'underscore';
  import { mapGetters, mapActions } from 'vuex';
  import vx from '../../../supports/util/vx.js';

  export default {
    data () {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes:[10,20,50,100],
        showStatusList: [40, 50, 55],  // 只显示待执行和执行中的活动数据
        listLoading: false,
        filters: {
          strFilter: '',
          statusValue: [],
          statusOptions: [{name:'', code:''}],
        },
        shortLinkList:[],
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
      // 筛选菜单数据
      getAllSelectOption: function(){
        this.listLoading = true;
        campaignApi.getCampaignStatusList({}).then(res =>{
          this.listLoading = false;
          if (res.data && res.data.length > 0){
            this.filters.statusOptions = res.data.filter((item) => {
              return this.showStatusList.indexOf(item.status) > -1;
            });
            this.getPageActive();
          };
        }).catch(err =>{
          this.listLoading = false;
        })
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
        let statusArray = this.showStatusList;  // 只显示待执行和执行中的活动数据
        if (this.filters.statusValue.length > 0) {
          statusArray = this.filters.statusValue;
        }
        let queryParams = {
          params: {
            statusList: statusArray,
            ownerCompany: this.selectCompanyInfo.companyCode,
            userRegionId: this.userInfo.regionId,
            userType: this.userInfo.userType
          },
          page: {
            current: this.currentPage,
            size: this.pageSize
          }
        };
        this.listLoading = true;
        campaignApi.getCampaignList(queryParams).then((res)=>{
          // 分页导航
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
          this.shortLinkList = res.data.records;

          this.listLoading = false;
        }).catch((err)=>{
          this.listLoading = false;
        });
      },
      onSearch: function() {
        if (this.filters.statusValue.length >0) {
          this.getPageActive();
        }
      },
      generateShortTip: function (campaign) {
        this.$confirm('此操作将更新活动短链, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.generateShortLink(campaign);
        }).catch(() => {

        });
      },
      generateShortLink: function(campaign){
        let long_url = ''; //`${settings.SHORT_DOMAIN}` ;
        long_url = vx.generateLink(long_url, campaign);
        if (!long_url) {
          this.$message.error('当前活动不支持生成短链');
          return false;
        }
        this.$fetch.get(`/crm/api/wechat/shorten-url`, {params: {long_url: long_url, code: campaign.ownerCompany}}).then((res)=>{
          if (!res.errcode) {
            let short_url = res.data;
            campaign.shortLink = res.data;
            // update crm 后台 short link
            campaignApi.updateShortLink({campaignId:campaign.id.toString(), shortUrl: res.data}).then(res =>{
              if (!res.errcode) {
                this.$notify({
                  title: '成功',
                  message: '更新短链成功',
                  type: 'success'
                });
              }
            }).catch(e => {
              this.$notify({
                title: '失败',
                message: e.message || '更新短链失败',
                type: 'warning'
              });
            })
          }
        }).catch((err)=>{
          this.listLoading = false;
        });
      }
    },
    components: {
      PaginationList
    },
    mounted() {
      this.initData();
    }
  }
</script>

<style scoped>

</style>
