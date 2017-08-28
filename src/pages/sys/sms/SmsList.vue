<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" class="demo-form-inline" >
        <el-form-item label="状态">
          <el-select v-model="filters.status" filterable placeholder="请选择">
            <el-option value="" label="请选择"></el-option>
            <el-option value="0" label="未发送"></el-option>
            <el-option value="1" label="发送成功"></el-option>
            <el-option value="2" label="已使用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input type="tel" v-model="filters.strFilter"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" @keyup.enter="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="smsList" border v-loading="listLoading" style="width: 100%">
        <el-table-column prop="wechatOpenId" label="Wechat ID" ></el-table-column>
        <el-table-column prop="receiverPhone" label="手机号" width="140">
          <template scope="scope">
            {{scope.row.receiverPhone | maskPhone('****')}}
          </template>
        </el-table-column>
        <el-table-column prop="smsContent" label="短信内容"  width="280"> </el-table-column>
        <el-table-column prop="verificationCode" label="验证码"  width="80"> </el-table-column>
        <el-table-column prop="smsSubJectCode" label="业务类型"  width="80"> </el-table-column>
        <el-table-column prop="sentDate" label="发送时间" width="170"  sortable>
          <template scope="scope">
            {{scope.row.sentDate | formatDate('yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="170" sortable>
          <template scope="scope">
            {{scope.row.createdTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="发送状态" width="120">
          <template scope="scope">
            {{ scope.row.status | lookup('PhoneStatusType')}}
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
  import sysApi from '../../../api/sys';

  export default {
    data () {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes:[10,20,50,100],
        listLoading: false,
        filters: {
          strFilter: '',
          status: ''
        },
        smsList:[],
        statusOption: []
      }
    },
    methods: {
      initData: function(){
        this.getPageActive();
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
        let queryParams = {
          params: {
            cellPhone: this.filters.strFilter || undefined,
            status: this.filters.status || undefined
          },
          page: {
            current: this.currentPage,
            size: this.pageSize,
            asc: false,
            orderByField: 'id'
          }
        };
        this.listLoading = true;
        sysApi.getSmsList(queryParams).then((res)=>{
          // 分页导航
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
          this.smsList = res.data.records;
          this.listLoading = false;
        }).catch((err)=>{
          this.listLoading = false;
        });
      },
      onSearch: function() {
        this.getPageActive();
      },
      sendSMS: function(id){
      }
    },
    components: {
      PaginationList
    },
    mounted() {
      this.statusOption = lookup.PhoneStatusType.getList();
      this.initData()
    }
  }
</script>

<style scoped>

</style>
