<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="doGetRoles">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="roles" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column type="index" width="60" />
        <el-table-column prop="roleCode" label="角色代码" min-width="140" sortable />
        <el-table-column prop="roleName" label="角色名称" min-width="180" sortable />
        <el-table-column label="角色类型" width="125" sortable>
          <template scope="scope">
            {{scope.row.roleType | lookup('RoleType')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <role-edit :inputs="editArgs" v-on:editdone="handleEditDone"></role-edit>
  </section>
</template>
<script>
  import RoleEdit from './RoleEdit.vue';
  import userApi from '../../../api/sys';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        roles: [],
        total: 0,
        page: 1,
        listLoading: false,

        editArgs:{
          data: {},
          show: false
        }
      }
    },
    methods: {
      handleAdd(){

      },
      handleEdit(idx, rowData){
        this.editArgs.show = true;
        this.editArgs.data = rowData;
      },
      handleEditDone(rowData){
        var row = this.roles.find((r)=>{return r.id == rowData.id});
        Object.assign(row, rowData);
      },
      handleDel(){

      },
      handleCurrentChange(val) {
        this.page = val;
        this.doGetRoles();
      },
      //获取角色列表
      doGetRoles() {
        this.listLoading = true;
        let param = {
          page: {current:1, size:10},
          params: {}
        };
        userApi.roleReadList(param).then((res) => {
          this.total = res.data.total;
          this.roles = res.data.records;
          this.listLoading = false;
        }).catch(e => {
          this.listLoading = false;
        });
      },
    },
    components:{
      RoleEdit
    },
    mounted() {
      this.doGetRoles();
    }
  }

</script>

<style scoped>

</style>
