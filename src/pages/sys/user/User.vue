<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsersHttp">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column prop="account" label="用户账号" >
        </el-table-column>
        <el-table-column label="用户类型" >
          <template scope="scope">{{scope.row.userType | lookup('UserGenreType')}}</template>
        </el-table-column>
        <el-table-column prop="regionId" label="分区" >
          <template scope="scope">
            {{scope.row.regionName | empty}}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户姓名">
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" >
        </el-table-column>
        <el-table-column prop="phone" label="手机" >
        </el-table-column>
        <el-table-column prop="enable" label="是否启用">
          <template scope="scope">{{scope.row.enable | enableFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="120">
          <template scope="scope">
            <el-button size="small" type="text" style="color: red;" v-if="(scope.row.userType != 1 && scope.row.userType != 3) && scope.row.enable == 1 " @click="handleLocked(scope.$index, scope.row)">禁用</el-button>
            <el-button size="small" type="text" style="color: green;" v-if="(scope.row.userType != 1 && scope.row.userType != 3) && scope.row.enable == 0 " @click="handleUnlock(scope.$index, scope.row)">启用</el-button>
            <el-button size="small" type="text" v-if="scope.row.userType != 1 && scope.row.userType != 3 && scope.row.enable ==1 " @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="text" v-if="scope.row.userType != 1 && scope.row.userType != 3 && scope.row.enable ==1 " @click="showResetPassword(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <pagination :currentPage=this.currentPage :total=this.total :pageSize=this.pageSize :pageSizes=this.pageSizes  v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange" ></pagination>

    <!-- 新增界面 -->
    <user-create ref="createUser" :inputs="this.addFormInput"  v-on:handleCreateUser="handleCreateUser" v-loading="addLoading"></user-create>

    <!-- 编辑界面 -->
    <user-edit ref="editUser" :inputs="this.editFormInput" v-on:handleUserDialog="editSubmit" v-loading="editLoading"></user-edit>

    <!-- 重置密码 -->
    <el-dialog title="重置密码" v-model="resetPassDialog.show" :close-on-click-modal="false">
      <user-reset-password :account="resetPassDialog.account" :userId="resetPassDialog.userId" v-on:submitDone="resetPassCallBack" ></user-reset-password>
    </el-dialog>

  </section>
</template>
<script>
  import $vx from 'supports/util/vx';
  import { mapGetters, mapActions } from 'vuex'
  import $lookup from 'supports/lookup';
  import Pagination from 'components/Pagination.vue';
  import UserCreate from './UserCreate.vue';
  import UserResetPassword from 'components/password/UserResetPassword.vue';
  import UserEdit from './UserEdit.vue';
  import userApi from '../../../api/user';

  export default {
    components:{
      Pagination,
      UserCreate,
      UserResetPassword,
      UserEdit
    },
    data() {
      return {
        filters: {
          companyCode: '',
          name:''
        },
        users: [],
        total: 0,
        pages: 1,
        currentPage: 1,
        pageSize: 20,
        pageSizes: [5,10,20,50,100],
        listLoading: false,
        editLoading: false,
        editFormInput: {
          title: "编辑用户",
          data: {},
          show: false
        },
        addLoading: false,
        addFormInput: {
          title: "新建用户",
          type: 'user',
          data: {},
          show: false
        },
        resetPassDialog: {
          show: false,
          account: '',
          userId: ''
        }
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
        handleCurrentChange(val) {
            this.page = val;
            this.getUsersHttp();
        },
        // 分页查询
        getPageData(currentPage){
          let queryParams = {
            params: {
              account:this.filters.name || undefined,
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
          userApi.getCrmUserList(queryParams).then((res) => {
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
        //编辑
        editSubmit: function (formData) {
          if (formData.status === 1) {
            this.addLoading = true;
            userApi.updateCrmUser(formData.data).then((res) => {
              this.$notify({
                title: '成功',
                message: '用户修改成功',
                type: 'success'
              });
              this.addLoading = false;
              this.editFormInput.show = false;
              this.getUsersHttp();
            }).catch((e)=>{
              this.addLoading = false;
              this.$notify({
                title: '失败',
                message: '用户修改失败' + e.message || '',
                type: 'error'
              });
            })
          }else {
            this.editFormInput.show = false;
          }
        },
        handleCreateUser: function (formData){
          this.addLoading = true;
          userApi.addCrmUser(formData).then((res) => {
            this.addLoading = false;
            this.$notify({
              title: '用户成功',
              message: '用户新增成功',
              type: 'success'
            });
            this.addFormInput.show = false;
            this.$refs["createUser"].$refs["addForm"].resetFields();
            this.getUsersHttp();
          }).catch((e)=>{
            this.addLoading = false;
            this.$notify({
              title: '失败',
              message: `用户新增失败 ${e.message || ''}`,
              type: 'error'
            });
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
        }
    },
    mounted() {
      this.getUsersHttp();
    }
  }

</script>

<style scoped>

</style>
