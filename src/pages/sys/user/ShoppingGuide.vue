<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="regionId" placeholder="请选择大区" name="region" @change="changeRegion">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--<el-select v-model="outletId" placeholder="请选择所属门店" name="outlet">
            <el-option
              v-for="item in outletsList"
              :key="item.id"
              :label="item.outletName"
              :value="item.id">
            </el-option>
          </el-select>-->
          <el-autocomplete
            class="inline-input"
            v-model="outletId"
            :fetch-suggestions="querySearch"
            placeholder="请选择门店"
            @select="handleSelect"
            :props="{ label: 'outletName', value:'outletName' }"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsersHttp">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增导购</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <template>
      <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column prop="account" label="用户账号" min-width="160">
        </el-table-column>
        <el-table-column prop="userName" label="用户姓名" min-width="140">
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" min-width="120" >
        </el-table-column>
        <el-table-column prop="phone" label="手机" width="140">
        </el-table-column>
        <el-table-column prop="birthDay" label="用户类型" width="120" >
          <template scope="scope">{{scope.row.userType |lookup('UserGenreType') }}</template>
        </el-table-column>
        <el-table-column prop="sex" label="所属大区" width="120" >
          <template scope="scope">{{scope.row.regionName}}</template>
        </el-table-column>
        <el-table-column prop="email" label="所属门店" min-width="120" >
          <template scope="scope">{{scope.row.outletName}}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120" >
          <template scope="scope">{{statusFilter(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="220">
          <template scope="scope">
            <el-button size="small" type="text" v-if="scope.row.userType != 1 && scope.row.userType != 3 && scope.row.enable ==1" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="text" v-if="scope.row.userType != 1 && scope.row.userType != 3 && scope.row.enable ==1" @click="showResetPassword(scope.row)">重置密码</el-button>
            <el-button size="small" type="text" v-if="scope.row.status == 10 && scope.row.enable ==1" @click="handleDismiss(scope.row.outletId,scope.row.id)">离职</el-button>
            <el-button size="small" type="text" v-if="scope.row.status == 10 && scope.row.enable ==1" @click="handleVacation(scope.row.outletId,scope.row.id)">休假</el-button>
            <el-button size="small" type="text" v-if="scope.row.status == 50 && scope.row.enable ==1" @click="handleVacationOff(scope.row.id)">取消休假</el-button>
            <el-button size="small" type="text" v-if="scope.row.enable ==1 && scope.row.status == 10" @click="userForbid(scope.row.id)">禁用</el-button>
            <el-button size="small" type="text" v-if="scope.row.status == 10 && scope.row.enable ==1" @click="handleSwitchStoreDialog(scope.row.regionId,scope.row.companyCode,scope.row.id,scope.row.outletId)">调店</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <pagination :currentPage=this.currentPage :total=this.total :pageSize=this.pageSize :pageSizes=this.pageSizes  v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange" ></pagination>

    <!-- 新增界面 -->
    <shopping-guide-create :inputs="this.addFormInput" ref="createGuide"  v-on:handleCreateGuide="handleCreateGuide"></shopping-guide-create>

    <!-- 重置密码 -->
    <el-dialog title="重置密码" v-model="resetPassDialog.show" :close-on-click-modal="false">
      <user-reset-password :account="resetPassDialog.account" :userId="resetPassDialog.userId" v-on:submitDone="resetPassCallBack" ></user-reset-password>
    </el-dialog>

    <!-- 编辑界面 -->
    <shopping-guide-edit ref="editGuide" :inputs="this.editFormInput" v-on:handleUserDialog="editSubmit" v-loading="editLoading"></shopping-guide-edit>

    <template>
      <el-dialog
        title="离职导购的所有会员，将做如下处理"
        :visible.sync="dismiss.dismissVisible"
        size="tiny"
        :before-close="handleClose">
        <el-row class="switchStore">
          <el-col :span="8"><span>请选择交接方式</span></el-col>
          <el-col :span="16">
            <el-radio-group v-model="dismiss.dismissRadio" @change="getDisMissType">
              <el-radio :label="1">会员交接</el-radio>
              <el-radio :label="2">会员代管</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="switchStore">
          <el-col :span="8"><span>请选择交接人</span></el-col>
          <el-col :span="16" v-show="dismiss.dismissRadio == ''">
            <el-select placeholder="请选择" v-model="sss">
            </el-select>
          </el-col>
          <el-col :span="16" v-show="dismiss.dismissRadio == 1">
            <el-select v-model="dismiss.dismissValue" placeholder="请选择" multiple>
              <el-option :label="item.userName" :value="item.id" v-for="(item,key) in outletUserList" :key="key"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16" v-show="dismiss.dismissRadio == 2">
            <el-select v-model="dismiss.dismissValue[0]" placeholder="请选择">
              <el-option :label="item.userName" :value="item.id" v-for="(item,key) in outletUserList" :key="key"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleQuit">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template>
      <el-dialog
        title="休假状态，需设置会员代管人"
        :visible.sync="vacation.vacationVisible"
        size="tiny"
        :before-close="handleClose">
        <el-select v-model="vacation.vacationValue[0]" placeholder="请选择">
          <el-option :label="item.userName" :value="item.id" v-for="(item,key) in outletUserList" :key="key"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleDayOff">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template>
      <el-dialog
        title="取消休假"
        :visible.sync="vacationOff.vacationOffVisible"
        size="tiny"
        :before-close="handleClose">
        <span>确定取消休假状态</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleCancelDayOff">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template>
      <el-dialog
        title="调店"
        :visible.sync="switchStore.switchStoreVisible"
        size="tiny"
        :before-close="handleClose">
        <el-row class="switchStore">
          <el-col :span="8"><span>请选择交接方式</span></el-col>
          <el-col :span="16">
            <el-radio-group v-model="switchStore.switchStoreRadio">
            <el-radio :label="1" >会员交接</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row class="switchStore">
          <el-col :span="8"><span>请选择交接人</span></el-col>
          <el-col :span="16">
            <el-select v-model="switchStore.switchStoreValue" placeholder="请选择" multiple>
              <el-option :label="item.userName" :value="item.id" v-for="(item,key) in outletUserList" :key="key"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="switchStore">
          <el-col :span="8"><span>请选择调往门店</span></el-col>
          <el-col :span="16">
            <el-select v-model="switchStore.destOutletId" placeholder="请选择">
              <el-option :label="item.outletName" :value="item.id" v-for="(item,key) in storeList" :key="key"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSwitchStore">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </section>
</template>
<script>
  import $vx from 'supports/util/vx';
  import { mapGetters, mapActions } from 'vuex'
  import $lookup from 'supports/lookup';
  import Pagination from 'components/Pagination.vue';
  import ShoppingGuideCreate from './ShoppingGuideCreate.vue';
  import UserResetPassword from 'components/password/UserResetPassword.vue'
  import ShoppingGuideEdit from './ShoppingGuideEdit.vue'
  import userApi from '../../../api/user';
  import regionApi from '../../../api/region';
  import commonApi from '../../../api/common';
  import _ from 'underscore';


  export default {
    components:{
      Pagination,
      ShoppingGuideCreate,
      UserResetPassword,
      ShoppingGuideEdit
    },
    data() {
      return {
        sss:'',
        filters: {
          companyCode: '',
          phone: '',
          name: ''
        },
        regionId: '',
        regionList: [{id: '', name: ''}],
        outletId:'',
        outletsList:[{id: '', outletName: ''}],
        users: [],
        total: 0,
        pages: 1,
        currentPage:1,
        pageSize: 20,
        pageSizes: [5,10,20,50,100],
        listLoading: false,
        sels: [],//列表选中列
        roleList: [],   // 存放角色列表
        roleOrigin: [], // 存放所有角色
        editLoading: false,
        editFormInput: {
          title: "编辑导购",
          data: {},
          show: false
        },
        addFormInput: {
          title: "新建导购",
          data: {},
          show: false
        },
        resetPassDialog: {
          show: false,
          account: '',
          userId: ''
        },
        dismiss:{
          dismissVisible:false,
          dismissRadio:'',
          dismissValue:[],
          userId:''
        },
        vacation:{
          vacationVisible:false,
          vacationRadio:2,
          vacationValue:[],
          userId:''
        },
        vacationOff:{
          vacationOffVisible:false,
          vacationOffRadio:0,
          vacationOffValue:[],
          userId:''
        },
        switchStore:{
          switchStoreVisible:false,
          switchStoreRadio:1,
          switchStoreValue:'',
          destOutletId:'',
          userId:''
        },
        outletUserList:[],
        storeList:[]
      }
    },
    computed: {
      ...mapGetters({
        companyType:'getSelectCompanyType',
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    methods: {
      getRegionList: function () {
        let param = {companyCode: this.selectCompanyInfo.companyCode, depth: 1};
        commonApi.getOrganizationStructure(param).then((res) => {
          if (res && res.data) {
            this.regionList = res.data;
            this.regionList.unshift({id: '', name: '所有大区'})
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      changeRegion: function (v) {
        if (v) {
          this.getOutletsList(v);
          this.outletId = '';
        }
      },
      getOutletsList: function (regionId) {
        let param = {regionId:regionId, companyCode:this.selectCompanyInfo.companyCode};
        regionApi.getListByRegionId(param).then((res) => {
          if (res.data) {
            this.outletsList = res.data;
            this.outletsList.unshift({id: '', outletName: '所有门店'})
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsersHttp();
      },
      // 分页查询
      getPageData(currentPage){
        let obj = _.findWhere(this.outletsList, {outletName: this.outletId});
        let queryParams = {
          params: {
            account:this.filters.name || undefined,
            phone: this.filters.phone || undefined,
            regionId: this.regionId || undefined,
            outletId: (obj && obj.id) ? obj.id : null,
            companyCode:this.selectCompanyInfo.companyCode
          },
          page: {
            current: currentPage || 1,
            size: this.pageSize || 10,
            asc: false,
            orderByField: 'id'
          }
        };
        this.listLoading = true;
        userApi.listGuideUser(queryParams).then((res) => {
          this.pages = res.data.pages;
          this.currentPage = res.data.current;
          this.pageSize = res.data.size;
          this.total = res.data.total;
          this.users = res.data.records;
          this.listLoading = false;
        }).catch((err) =>{
          this.listLoading=false;
        });
      },
      // 分页处理 - 改变 size
      handleSizeChange(size){
        this.pageSize = size;
        this.getPageData();
      },
      // 分页处理 - 改变 currentPage
      handleCurrentChange(currentPage){
        this.getPageData(currentPage);
      },
      //获取用户列表
      getUsersHttp() {
        this.getPageData()
      },
      handleUserRoles: function(checkList){
        let checkRoleList = [];
        for (let i = 0; i < checkList.length; i++) {
          let item = checkList[i];
          for (let j = 0; j < this.roleOrigin.length; j++) {
            let obj = this.roleOrigin[j];
            if ( item == obj['roleName']){
              checkRoleList.push(obj);
            }
          }
        }
        return checkRoleList;
      },
      // 禁用
      handleLocked: function (index, row) {
        this.$confirm('确认禁用该用户吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = { userId: row.id };
          userApi.lockUser({params:para}).then((res) => {
            this.listLoading = false;
            this.$notify({
              title: '成功',
              message: '用户禁用成功',
              type: 'success'
            });
            this.getUsersHttp();
          }, (err) => {
            this.listLoading = false;
            this.$notify({
              title: '失败',
              message: `禁用失败${err.message || ''}`,
              type: 'error'
            });
          });
        }).catch(() => {

        });
      },
      // 启用
      handleUnlock: function (index, row) {
        this.$confirm('确认启用该用户吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let para = { userId: row.id };
          userApi.unlockUser({params:para}).then((res) => {
            this.listLoading = false;
            this.$notify({
              title: '成功',
              message: '用户启用成功',
              type: 'success'
            });
            this.getUsersHttp();
          }, (err) => {
            this.listLoading = false;
            this.$notify({
              title: '失败',
              message: `启用失败`,
              type: 'error'
            });
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (row) {
        this.editFormInput.data = row;
        this.editFormInput.show = true;
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormInput.show = true;
      },
      editSubmit: function (formData) {
        if (formData.status === 1) {
          this.editLoading = true;
          userApi.updateGuideUser(formData.data).then((res) => {
            this.editLoading = false;
            this.$notify({
              title: '成功',
              message: '导购修改成功',
              type: 'success'
            });
            this.editFormInput.show = false;
            this.getUsersHttp();
          }).catch((e)=>{
            this.editLoading = false;
            this.$notify({
              title: '失败',
              message: `导购修改失败 ${err.message || ''}`,
              type: 'error'
            });
          })
        }else {
          this.editFormInput.show = false;
        }
      },
      //创建导购
      handleCreateGuide: function (formData){
        userApi.addGuideUser(formData).then((res) => {
          this.addLoading = false;
          this.$notify({
            title: '新增导购成功',
            message: '新增导购成功',
            type: 'success'
          });
          this.addFormInput.show = false;
          this.getUsersHttp();
        });
      },
      showResetPassword: function (user) {
        this.resetPassDialog.userId = user.id;
        this.resetPassDialog.account = user.account;
        this.resetPassDialog.show = true;
      },
      resetPassCallBack: function (data) {
        this.resetPassDialog.show = false;
        if (data.status === 1) {
          this.$notify({
            title: '重置密码',
            message: '重置密码成功',
            type: 'success'
          });
        }
      },
      statusFilter(statusCode) {
          let statusStr = '';
          switch (statusCode) {
            case 10:
                statusStr = '正常';
                break;
            case 60:
              statusStr = '离职';
              break;
            case 50:
              statusStr = '休假';
              break;
            case 90:
              statusStr = '冻结';
              break;
            case 0:
              statusStr = '禁用';
              break;
          }
          return statusStr;
      },
//      离职处理
      handleDismiss(outletId,userId){
          this.dismiss.dismissVisible = true;
          this.getListByOutletId(outletId,userId);
          this.dismiss.userId = userId;
      },
      handleVacation(outletId,userId){
          this.vacation.vacationVisible = true;
          this.getListByOutletId(outletId,userId);
          this.vacation.userId = userId;
      },
      handleSwitchStoreDialog(regionId,companyCode,userId,outletId){
        this.switchStore.switchStoreVisible = true;
        this.getListByRegionId(regionId,companyCode,outletId);
        this.getListByOutletId(outletId,userId);
        this.switchStore.userId = userId;
      },
      handleVacationOff(userId){
        this.vacationOff.vacationOffVisible = true;
        this.vacationOff.userId = userId;
      },
      handleClose(){
          this.dismiss = {
          dismissVisible:false,
            dismissRadio:'',
            dismissValue:[],
            userId:''
        };
          this.vacation = {
          vacationVisible:false,
            vacationRadio:2,
            vacationValue:[],
            userId:''
        };
          this.vacationOff = {
          vacationOffVisible:false,
            vacationOffRadio:0,
            vacationOffValue:[],
            userId:''
        };
          this.switchStore = {
          switchStoreVisible:false,
            switchStoreRadio:1,
            switchStoreValue:[],
            destOutletId:'',
            userId:''
        };
      },
      handleQuit(){
        var postData = {
          settleMethod: this.dismiss.dismissRadio,
          settleUserIds: this.dismiss.dismissValue,
          userId: this.dismiss.userId
        };
        userApi.userQuit(postData).then(rst=>{
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
            this.getUsersHttp();
        }).catch(err=>{
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        });
        this.dismiss.dismissVisible = false;
      },
      getDisMissType(){
          if(this.dismiss.dismissValue) {
            this.dismiss.dismissValue = []
          }
      },
      handleDayOff(){
        var postData = {
          settleMethod: this.vacation.vacationRadio,
          settleUserIds: this.vacation.vacationValue,
          userId: this.vacation.userId
        };
        userApi.userVacation(postData).then(rst=>{
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.getUsersHttp();
        }).catch(err=>{
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        });
        this.vacation.vacationVisible = false;
      },
      handleCancelDayOff(){
        var postData = {
          settleMethod: this.vacationOff.vacationOffRadio,
          settleUserIds: this.vacationOff.vacationOffValue,
          userId: this.vacationOff.userId
        };
        userApi.userVacationOff(postData).then(rst=>{
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.getUsersHttp();
        }).catch(err=>{
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        });
        this.vacationOff.vacationOffVisible = false;
      },
      getListByOutletId(outletId,userId){
        userApi.getListByOutletId(outletId,userId).then(rst=>{
          this.outletUserList = rst.data;
        });
      },
      getListByRegionId(regionId,companyCode,outletId){
        userApi.getListByRegionIdNoPager(regionId,companyCode,outletId).then(rst=>{
          this.storeList = rst.data;
        })
      },
      handleSwitchStore(){
        var postData = {
          settleMethod: this.switchStore.switchStoreRadio,
          destOutletId:this.switchStore.destOutletId,
          settleUserIds:this.switchStore.switchStoreValue,
          userId: this.switchStore.userId
        };
        userApi.switchStore(postData).then(rst=>{
          this.getUsersHttp();
          this.switchStore = {
              switchStoreVisible:false,
              switchStoreRadio: 1,
              switchStoreValue:'',
              destOutletId:'',
              userId:''
          };
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
        }).catch(err=>{
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        });
        this.switchStore.switchStoreVisible = false;
      },
      userForbid(userId){
        userApi.userForbid(userId).then(rst=>{
          this.$confirm('确认禁用？')
            .then(_ => {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success'
              });
              this.getUsersHttp();
            })
        }).catch(err=>{
          this.$notify.error({
            title: '错误',
            message: `禁用失败${err.message || ''}`,
            type: 'error'
          });
        })
      },
      createFilter(queryString) {
        return (restaurants) => {
          return (restaurants.outletName.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      querySearch(queryString, cb) {
        var restaurants = this.outletsList;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        console.log(results);
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      handleSelect(item) {
        console.log(item);
      }
    },
    mounted() {
      this.getUsersHttp();
      this.getRegionList();
        // this.getAllRole();
    }
  }

</script>

<style scoped>
  .switchStore{
    padding:5px;
  }
</style>
