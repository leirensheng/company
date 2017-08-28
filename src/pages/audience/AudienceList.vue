<template>
  <section>
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
          <el-select style="width: 150px;" clearable v-model="filters.regionId" placeholder="请选择大区" name="region" @change="changeRegion">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item style="width: 150px;">
            <el-select v-model="filters.outletId" filterable clearable :disabled="!filters.regionId" placeholder="请选择门店">
              <el-option
                v-for="item in outletsList"
                :key="item.id"
                :label="item.outletName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人群标签:">
            <el-select v-model="filters.lists" placeholder="选择人群">
              <el-option v-for="item in listsOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-input v-model="filters.fullName" style="width: 100px;" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input v-model="filters.cellPhone" style="width: 200px;" @blur="checkPhone()" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item >
            <el-checkbox v-model="filters.includeDisabled">包含失效会员</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" v-on:click="getAudienceList">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item label="关注状态:">
            <el-select v-model="filters.followStatus" placeholder="">
              <el-option v-for="item in followOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定状态:">
            <el-select v-model="filters.boundStatus" placeholder="">
              <el-option v-for="item in boundOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定日期:">
            <el-date-picker
              v-model="filters.bindDate"
              type="daterange"
              align="right"
              placeholder="选择日期范围"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <template>
      <div class="pagination-top" v-if="pageSize<totalCount">
        <el-pagination small layout="total, prev, pager, next"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pageSize" :total="totalCount"></el-pagination>
      </div>
      <el-table :data="audienceList" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="fullName" label="姓名" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="wechatOpenId" label="OpenID" min-width="120" sortable>
        </el-table-column>
        <el-table-column prop="cellPhone" label="手机" width="130" sortable>
        </el-table-column>
        <el-table-column  label="性别" width="100" sortable>
          <template scope="scope">{{scope.row.gender | sex}}</template>
        </el-table-column>
        <el-table-column label="会员等级" width="170">
          <template scope="scope">
            <el-rate disabled size="small" v-model="scope.row.grade"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="online" label="关注" width="100" :formatter="formatOnline" sortable>
        </el-table-column>
        <el-table-column prop="enable" label="状态" width="100" :formatter="formatStatus" sortable>
        </el-table-column>
        <el-table-column label="绑定日期" width="150" sortable>
          <template scope="scope">{{scope.row.bindDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button type="info" @click="handleInfo(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <audience-info :inputs="infoArgs" ></audience-info>
      <div class="pagination-bottom" v-if="pageSize<totalCount">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </template>


  </section>
</template>

<script>
  import $vx from 'supports/util/vx';
  import { mapGetters } from 'vuex';
  import AudienceInfo from './AudienceInfo.vue';
  import RegionAndOutlets from 'components/RegionAndOutlets.vue'
  import regionApi from '../../api/region';
  import AudienceApi from '../../api/audience';
  import commonApi from '../../api/common';

  export default {
    data(){
      return {
        isNotPhone: false,
        filters: {
          fullName:'',
          cellPhone:'',
          lists:'',
          regionId:'',
          outletId:'',
          outletName:'',
          includeDisabled: false,
          followStatus: '',
          boundStatus: '',
          bindDate: ''
        },
        regionList: [{id: '', name: ''}],
        outletsList: [],
        listLoading: false,
        currentPage:1,
        pageSize:20,
        totalPages:0,
        totalCount:0,
        audienceList:[],
        listsOptions:[],
        followOptions: [
          {'value':'','label':'全部'},
          {'value':'1','label':'已关注'},
          {'value':'0','label':'未关注'}
        ],
        boundOptions: [
          {'value':'','label':'全部'},
          {'value':'1','label':'已绑定'},
          {'value':'0','label':'未绑定'}
        ],
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        infoArgs:{
          data: {},
          show: false
        }
      }
    },
    methods: {
      formatDate(date) {
        return $vx.date.format(date, 'yyyy-MM-dd');
      },
      checkPhone() {
        let that = this;
        if (this.filters.cellPhone.length === 11 || this.filters.cellPhone == '') {
          that.isNotPhone = false;
        } else {
          this.$message({
            type: 'error',
            message: '请输入正确的手机号',
            duration: 2000
          })
          that.isNotPhone = true;
        }
      },
      getAudienceList() {
        if(this.isNotPhone) {
          return false;
        }
        if(this.filters.regionId && !this.filters.outletId) {
          this.$message({
            type: 'error',
            message: '请选择门店',
            duration: 2000
          })
          return false;
        }
        let bindDateBegin =  this.filters.bindDate[0] ? this.formatDate(this.filters.bindDate[0]) + ' 00:00:00' : '';
        let bindDateEnd =  this.filters.bindDate[1] ? this.formatDate(this.filters.bindDate[1]) + ' 23:59:59' : '';
        let queryParams = {
          params: {
            fullName:this.filters.fullName,
            cellPhone:this.filters.cellPhone,
            listId:this.filters.lists,
            companyCode:this.selectCompanyInfo.companyCode,
            outletId:this.filters.outletId,
            includeDisabled: this.filters.includeDisabled ? 1 : 0,
            followStatus: this.filters.followStatus,
            boundStatus: this.filters.boundStatus,
            bindDateBegin: bindDateBegin,
            bindDateEnd: bindDateEnd
          },
          page: {
            current: this.currentPage,
            size: this.pageSize
          }
        };
        this.listLoading = true;
        AudienceApi.getAudienceList(queryParams).then((res) => {
          this.totalCount = res.data.total;
          this.totalPages = res.data.pages;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.audienceList = res.data.records;
          this.listLoading = false;
        });
      },
      getLists(){
        let companyCode =this.selectCompanyInfo.companyCode;
        AudienceApi.getListsList(companyCode).then((res) => {
          let _ = [{'value':'','label':'全部人群'}];
          res.forEach((list) =>{
            _.push({'value':list.id,'label':list.listName});
          });
          this.listsOptions = _;
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getAudienceList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getAudienceList();
      },
      handleInfo(idx, rowData){
        this.infoArgs.show = true;
        rowData['companyCode'] = this.selectCompanyInfo.companyCode;
        this.infoArgs.data = rowData;
      },
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
      changeRegion: function (v) {
        if (v) {
          this.getOutletsList(v);
          this.filters.outletId = '';
        }
      },
      getOutletsList: function (regionId) {
        let param = {regionId:regionId, companyCode:this.selectCompanyInfo.companyCode};
        regionApi.getListByRegionId(param).then((res) => {
          if (res.data) {
            this.outletsList = res.data;
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      formatStatus: function (row, column) {
        return row.enable == 1 ? '有效' : '失效';
      },
      formatOnline: function (row, column) {
        return row.online == 1 ? '已关注' : '未关注';
      }
    },
    components:{
      AudienceInfo,
      RegionAndOutlets
    },
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    mounted(){
      this.getLists();
      this.getRegionList();
    }

  }

</script>

<style scoped>
  .pagination-bottom{
    float: right;
    margin-top: 10px;
  }
  .pagination-top{
    float: right;
    margin-top: -15px;
    margin-bottom: 10px;
  }
</style>
