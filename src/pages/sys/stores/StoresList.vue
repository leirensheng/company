<template>
  <section>
    <!--item图表-->
    <el-row class="row">
      <!--工具条-->
      <el-col :span="24" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item label="地域：">
            <el-select
              ref="geoRule"
              style="width: 180px;"
              v-model="selectedGeosList"
              multiple
              filterable
              remote
              placeholder="地域范围"
              :loading="loading"
              :remote-method="handleSearchFilter"
              @change="changeGeoRule">
              <el-option v-for="item in cityList" :label="item.name" :value="item.code" :key="item.code">
                <span style="float: left">{{item.description}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分区：">
            <el-select v-model="filters.regionIds" multiple style="width: 160px;" placeholder="请选择大区" name="region" >
              <el-option
                v-for="item in regionList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.keyword" placeholder="门店代码/名称/地址查找"></el-input>
          </el-form-item>
          <el-form-item label="门店状态">
            <el-select v-model="filters.status" placeholder="请选择" multiple>
              <el-option :value="10" label="计划开店"></el-option>
              <el-option :value="20" label="装修中"></el-option>
              <el-option :value="40" label="正常营业"></el-option>
              <el-option :value="60" label="计划关店"></el-option>
              <el-option :value="90" label="已关店"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveRules">查询</el-button>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="handleNew()">新增门店</el-button>
        </el-form-item>
        </el-form>
      </el-col>
      <template>
        <!--列表-->
        <el-table
          ref="multipleTable"
          :data="itemList"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="代码"
            min-width="80">
            <template scope="scope">{{ scope.row.outletCode }}</template>
          </el-table-column>
          <el-table-column
            label="所属分区"
            min-width="100">
            <template scope="scope">{{ scope.row.regionName }}</template>
          </el-table-column>
          <el-table-column
            label="省/市/区"
            min-width="130"
            :formatter="getProvinceCityCount">
          </el-table-column>
          <el-table-column
            prop="outletTypeDesc"
            label="类型"
            min-width="110">
          </el-table-column>
          <el-table-column
            prop="outletGradeDesc"
            label="等级"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="outletName"
            label="名称"
            min-width="80">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            min-width="100">
            <template scope="scope">{{ formatter(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column
            label="地址"
            prop="addressLine"
            min-width="300">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="60">
            <template scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--批量修改门店信息-->
        <div style="margin-top: 20px">
          <span class="editType">分区修改：</span>
          <el-select v-model="changeList.region" placeholder="请选择">
            <el-option v-for="item in regionList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"
                       @click.native="updateItemRegion(3,item.id)"></el-option>
          </el-select>

          <span class="editType">类型修改：</span>
          <el-select v-model="changeList.outletType" placeholder="请选择">
            <el-option v-for="item in changeOutletTypeList"
                       :key="item.codeValue"
                       :label="item.codeValueDesc"
                       :value="item.codeValue"
                       @click.native="updateItemRegion(2,item.codeValue)"></el-option>
          </el-select>

          <span class="editType">等级修改：</span>
          <el-select v-model="changeList.outletGrade" placeholder="请选择">
            <el-option v-for="item in changeOutletGradeList"
                       :key="item.codeValue"
                       :label="item.codeValueDesc"
                       :value="item.codeValue"
                       @click.native="updateItemRegion(1,item.codeValue)"></el-option>
          </el-select>
        </div>
        <!--分页-->
        <Pagination :currentPage=this.currentPage :total=this.total :pageSizes=this.pageSizes  v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange" ></Pagination>
        <!-- 新建页面 -->
        <Store-new ref="editGuide" :inputs="this.creatOutlet" v-on:handleUserDialog="newSubmit" v-loading="editLoading"></Store-new>
        <!-- 编辑界面 -->
        <Store-edit ref="editGuide" :inputs="this.editFormInput" v-on:handleUserDialog="editSubmit" v-loading="editLoading"></Store-edit>
      </template>
    </el-row>
  </section>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Pagination from 'components/Pagination.vue';
  import tagApi from '../../../api/tag';
  import StoreEdit from './StoresEdit.vue'
  import StoreNew from './StoresNew.vue'
  import StoresApi from '../../../api/stores';
  import commonApi from '../../../api/common';
  import proCitDic from 'src/assets/json/province_city_county.json';
  import _ from 'underscore';

  export default {
    components:{
      Pagination,
      StoreEdit,
      StoreNew
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo: 'getSelectCompanyInfo',
      }),
    },
    data() {
      return {
        //选择地域
        cityList: [] ,
        selectedGeosList: [],
        loading: false,
        //列表数据
        itemList:[],
        statusList: [
          {
            value: 10,
            name: '计划开店'
          },
          {
            value: 20,
            name: '装修中'
          },
          {
            value: 40,
            name: '正常营业'
          },
          {
            value: 60,
            name: '计划关店'
          },
          {
            value: 90,
            name: '已关店'
          },
        ],
        idList:[],
        proCitDics: proCitDic,
        filters: {
          keyword: '',
          cityIds: [],
          countyIds: [],
          provIds: [],
          regionIds: [],
          status: []
        },
        regionList: [{id: '', name: ''}],

        //分页
        total: 0,
        pages: 1,
        currentPage:1,
        pageSize: 10,
        pageSizes: [5,10,20,50,100],

        //分区修改的三大类
        changeOutletTypeList: [{id: '', name: ''}],
        changeOutletGradeList: [{id: '', name: ''}],
        changeList: {
          region: '',
          outletType: '',
          outletGrade: ''
        },
        //编辑传递的data
        editFormInput:{
          data: {},
          companyCode: '',
          regionList: [],
          changeOutletTypeList: [],
          changeOutletGradeList: [],
          show: false
        },
        // 新建传递的数据
        creatOutlet:{
          regionList: [],
          changeOutletTypeList: [],
          changeOutletGradeList: [],
          companyCode: '',
          show: false
        },
        editLoading: false,
      }
    },
    methods: {
      //把选中的数据传入
      handleSelectionChange(val) {
        if(val){
          val.map((item)=>{
            this.idList.push(item.id)
          });
        }
      },
      //获取门店列表
      getItemList(currentPage){
        let queryParams = {
            noPager: true,
            page: {
              current: currentPage || 1,
              size: this.pageSize || 10,
              asc: false,
              orderByField: 'id'
            },
            params: {
              cityIds: this.filters.cityIds || [],
              userId: this.userInfo.id,
              companyCode: this.selectCompanyInfo.companyCode,
              countyIds: this.filters.countyIds || [],
              keyword: this.filters.keyword || "",
              provIds: this.filters.provIds || [],
              regionIds: this.filters.regionIds || [],
              status: this.filters.status || []
            }
          }
        StoresApi.getListStores(queryParams).then(rst=>{
          this.itemList = rst.data.records;
          this.total = rst.data.total;
        })
      },
      // 过滤状态
      formatter(status){
        let statusName = '';
        switch (status) {
            case 10:
              statusName = '计划开店';
              break;
            case 20:
              statusName = '装修中';
              break;
            case 40:
              statusName = '正常营业';
              break;
            case 60:
              statusName = '计划关店';
              break;
            case 90:
              statusName = '已关店';
              break;
          }
          return statusName;
      },
      //列表显示-重组省市区
      getProvinceCityCount (row) {
          var pr = this.proCitDics[row.provId] || ''
          var ci = this.proCitDics[row.cityId] || ''
          var co = this.proCitDics[row.countyId] || '';
          if(pr && ci && co) {
            return pr + '/' + ci + '/' + co;
          }else if(pr && ci && !co) {
            return pr + '/' + ci ;
          }else if(pr && !ci && !co) {
            return pr ;
          }else{
              return '暂无信息'
          }

      },
      // 分页处理 - 改变 size
      handleSizeChange(size){
        this.pageSize = size;
        this.getItemList();
      },
      // 分页处理 - 改变 currentPage
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.getItemList(currentPage);
      },
      //获取大区
      getRegionList () {
        let param = {companyCode: this.selectCompanyInfo.companyCode, depth: 1};
        commonApi.getOrganizationStructure(param).then((res) => {
          if (res && res.data) {
            this.regionList = res.data;
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      //获取类别-获取等级
      getListByTypeAndCode(type){
        commonApi.getOutletsTypeAndGradeList({
          companyCode: this.selectCompanyInfo.companyCode,
          codeType: type
        }).then((res) => {
          if (res && res.data) {
              this.changeOutletTypeList = res.data[0].options;
              this.changeOutletGradeList = res.data[1].options;
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      //分区修改
      updateItemRegion(type, id){
        if (this.idList.length >= 1){
          let name = '';
          switch (type) {
            case 1:
              name = '等级';
              break;
            case 2:
              name = '类型';
              break;
            case 3:
              name = '分区';
              break;
            default:
              break;
          }
          this.$confirm(`你确定要批量修改选中门店的${name}嘛？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            StoresApi.updateAttrBatchStores({
              idList: this.idList,
              type: type,
              value: id
            }).then(rst=>{
              this.getItemList();
              Object.assign(this.changeList,{region: null,outletType: '',outletGrade: ''});
              this.idList = [];
            }).catch((e) =>{
              this.$message.error('批量修改门店失败！');
            })
          }).catch(() => {});
        } else {
          this.$message.error('请先选中要修改的门店数据！');
        }
      },
      //显示新建门店弹窗
      handleNew () {
        this.creatOutlet.regionList = this.regionList;
        this.creatOutlet.changeOutletTypeList = this.changeOutletTypeList;
        this.creatOutlet.changeOutletGradeList = this.changeOutletGradeList;
        this.creatOutlet.companyCode = this.selectCompanyInfo.companyCode;
        this.creatOutlet.show = true;
      },
      //显示编辑门店弹窗
      handleEdit (row) {
        this.editFormInput.data = row;
        this.editFormInput.regionList = this.regionList;
        this.editFormInput.changeOutletTypeList = this.changeOutletTypeList;
        this.editFormInput.changeOutletGradeList = this.changeOutletGradeList;
        this.creatOutlet.companyCode = this.selectCompanyInfo.companyCode;
        this.editFormInput.show = true;
      },
      //新建门店
      newSubmit (formData) {
        if (formData.status === 1) {
          this.editLoading = true;
          StoresApi.insertStores(formData.data).then((res) => {
            this.editLoading = false;
            this.$notify({
              title: '成功',
              message: '门店新建成功',
              type: 'success'
            });
            this.creatOutlet.show = false;
            this.getItemList();
          }).catch((e)=>{
            this.editLoading = false;
            this.$notify({
              title: '失败',
              message: '门店新建失败',
              type: 'error'
            });
          })
        }else {
          this.creatOutlet.show = false;
        }
      },
      //编辑
      editSubmit (formData) {
        if (formData.status === 1) {
          this.editLoading = true;
          StoresApi.updateStores(formData.data).then((res) => {
            this.editLoading = false;
            this.$notify({
              title: '成功',
              message: '门店修改成功',
              type: 'success'
            });
            this.editFormInput.show = false;
            this.getItemList();
          }).catch((e)=>{
            this.editLoading = false;
            this.$notify({
              title: '失败',
              message: `门店修改失败 ${err.message || ''}`,
              type: 'error'
            });
          })
        }else {
          this.editFormInput.show = false;
        }
      },
      //选择地域
      changeGeoRule: function (res) {
        this.$refs.geoRule.query ='';
        this.selectedGeosList.map((v)=>{
          var i = v;
          this.cityList.map((item)=>{
            if(item.code === i){
              if(item.level === 1){
                this.filters.provIds.push(i)
              }else if(item.level === 2){
                this.filters.cityIds.push(i)
              }else if(item.level === 3){
                this.filters.countyIds.push(i)
              }
            }
          })
        })
        this.filters.provIds = this.getUnqiArray(this.filters.provIds);
        this.filters.cityIds = this.getUnqiArray(this.filters.cityIds);
        this.filters.countyIds = this.getUnqiArray(this.filters.countyIds);
      },
      handleSearchFilter: function (query) {
        let strs=query.replace(/(^\s+)|(\s+$)/g, "");
        let patt1 = new RegExp(/^[a-zA-Z]{2,}$/);
        let patt2 = new RegExp(/^[\u4e00-\u9fa5]+$/);
        if (strs !== '' && (patt1.test(strs) || patt2.test(strs))) {
          this.loading = true;
          let param = {
            keyword: query
          };
          tagApi.getTagGeoProvincesList(param).then(res=>{
            this.loading = false;
            this.cityList = res.data; // this.geosRule.concat(res.data);
          }).catch(e=>{
          })
        }
      },
      getUnqiArray(arr) {
        var newArr = _.uniq(arr)
        var res = _.intersection(newArr,this.selectedGeosList)
        return res
      },
      saveRules: function () {
        this.currentPage = 1;
        this.getItemList();
      },
    },
    mounted() {
      this.getItemList();
      this.getRegionList();
      this.getListByTypeAndCode();
    }
  }
</script>
