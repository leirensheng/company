<template>
  <section>
    <template>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" class="demo-form-inline" >
          <el-form-item label="任务类型">
            <el-select v-model="filter.taskType" placeholder="请选择" @change="onSearch(filter)">
              <el-option :value="item.taskType" v-for="(item,key) in taskList" :key="key" :label="item.taskTypeName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行人">
            <el-select v-model="filter.excuteObj" style="width: 200px;" placeholder="请选择" @change="onSearch(filter)">
              <el-option :value="2" label="导购"></el-option>
              <el-option :value="1" label="系统"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态">
            <el-select v-model="filter.taskStatus" style="width: 300px;" placeholder="请选择" multiple @change="onSearch(filter)">
              <el-option :value="10" label="草稿"></el-option>
              <el-option :value="40" label="待执行"></el-option>
              <el-option :value="50" label="执行中"></el-option>
              <el-option :value="55" label="暂停"></el-option>
              <el-option :value="60" label="结束"></el-option>
              <el-option :value="99" label="关闭"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createTask()">创建任务</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </template>

    <template style="margin: 5px">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="任务ID/任务标题" min-width="220">
          <template scope="scope">
            <el-button type="text" @click="taskDetail(scope.row.id)">{{scope.row.id}}</el-button><br/>
            <span>{{scope.row.taskTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" min-width="120">
          <template scope="scope">
            <span>{{taskTypeFilter(scope.row.taskType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" min-width="160">
          <template scope="scope">
            <span>{{scope.row.campaignName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务分区" min-width="85">
          <template scope="scope">
            <span>{{scope.row.regionName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行人" min-width="80">
          <template scope="scope">
            <span>{{ownerTypeFilter(scope.row.ownerType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" min-width="150">
          <template scope="scope">
            <span>{{scope.row.plannedStartTime|formatDate('yyyy-MM-dd hh:mm')}} 至<br/>
             {{scope.row.plannedEndTime|formatDate('yyyy-MM-dd hh:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            <span>{{statusFilter(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务完成度" min-width="105">
            <template scope="scope">
              <span>{{scope.row.finishedTaskCount}}/{{scope.row.total}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="操作" min-width="100">
          <template scope="scope">
            <el-button type="text" v-if="scope.row.status == 10" @click="editTask(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="deleteTask(scope.row.id)" v-if="scope.row.status == 10">删除</el-button>
            <el-button type="text" v-if="scope.row.status == 40" @click="cancelTask(scope.row.id)">作废</el-button>
            <el-button type="text" @click="confirmTask(scope.row.id)" v-if="scope.row.status != 40 && scope.row.status != 50 && scope.row.status != 60 && scope.row.status != 0">确认</el-button>
            <el-button type="text" @click="finishTask(scope.row.id)" v-if="scope.row.status != 60 && scope.row.status != 40 && scope.row.status != 10 && scope.row.status != 0">结束</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template>
      <el-dialog
        title="修改信息"
        :visible.sync="editDialogVisible"
        size="small"
        :before-close="handleClose">
        <el-row>
          <task-form :editForm="formData" ref="a" v-on:updateTask="onSearch(filter)" :formSubmitVisible="false"></task-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click.native="updateTask()">确 定</el-button>
  </span>
      </el-dialog>
    </template>

    <Pagination :currentPage=this.currentPage :total=this.total :pageSizes=this.pageSizes  v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange" ></Pagination>
  </section>
</template>

<script>
    import Pagination from '../../../components/Pagination.vue';
    import paApi from '../../../api/pa';
    import {formatDate} from '../../../supports/filter/filters';
    import { mapGetters, mapActions } from 'vuex'
    import campApi from '../../../api/campaign';
    import sysApi from '../../../api/sys';
    import TaskForm from './taskForm.vue';

    export default {
        data() {
            return {
                tableData:[],
                value:1,
                total: 0,
                currentPage: 1,
                pageSize: 20,
                pageSizes:[10,20,50,100],
                taskList:[],
                filter:{
                  taskType:'',
                  excuteObj:'',
                  taskStatus:'',
                  companyCode:''
                },
                disableCheckBox:'',
                statusList:[],
                editDialogVisible:false,
                formData:{}
            }
        },
      methods:{
        onSearch(filter,pager) {
          let userId = this.userInfo.id;
          paApi.getTaskPlanList(userId,filter,pager).then(rst=>{
            this.tableData = rst.data.records;
            this.total = rst.data.total;
          })
        },
        handleSizeChange (pageSize){
          this.pageSize = pageSize;
          this.onSearch(this.filter,{pageSize:pageSize});
        },
        handleCurrentChange (currentPage){
          this.currentPage = currentPage;
          this.onSearch(this.filter,{currentPage:currentPage});
        },
        getTaskType() {
            var that = this;
          paApi.getTaskType().then(rst=>{
              that.taskList = rst.data;
          })
        },
        taskTypeFilter(code) {
            for(let i = 0;i<this.taskList.length;i++){
                if(this.taskList[i].taskType == code){
                    return this.taskList[i].taskTypeName;
                }
            }
        },
        statusFilter (statusCode) {
            for(let i = 0;i<this.statusList.length;i++){
                if(this.statusList[i].status === statusCode){
                    return this.statusList[i].statusName;
                }
            }
        },
        getStatusList() {
          sysApi.getStatusList().then(rst=>{
              this.statusList = rst.data;
          })
        },
        createTask(){
            this.$router.push({path:'/pa/task-plan/create'})
        },
        deleteTask(id){
          paApi.deleteTaskPlan(id).then(rst=>{
            this.$notify({
              title: '成功',
              message: '删除成功',
              duration: 1000,
              type: 'success'
            });
            this.onSearch(this.filter);
          }).catch(err=>{
            this.$notify.error({
              title: '失败',
              message: '删除失败',
              duration: 1000
            });
          })
        },
        confirmTask(id){
          paApi.confirmTask(id).then(rst=>{
            this.$notify({
              title: '成功',
              message: '确认成功',
              duration: 1000,
              type: 'success'
            });
            this.onSearch(this.filter);
          }).catch(err=>{
            this.$notify.error({
              title: '失败',
              message: err.message,
              duration: 1000
            });
          })
        },
        finishTask(id) {
            paApi.finishTask(id).then(rst=>{
              this.$notify({
                title: '成功',
                message: '结束成功',
                duration: 1000,
                type: 'success'
              });
              this.onSearch(this.filter);
            }).catch(err=>{
              this.$notify.error({
                title: '失败',
                message: err.message,
                duration: 1000
              });
            })
        },
        editTask(id){
//            this.editDialogVisible = true;
//            this.getTaskDetail(id);
          this.$router.push({path:'/pa/task-plan/create?id=' + id});
        },
        taskDetail(id){
          this.$router.push({path:'/pa/task-plan/detail?id=' + id});
        },
        getTaskDetail(id){
          let that = this;
          paApi.getTaskDetail(id).then(rst=>{
              that.formData = rst.data;
          })
        },
        handleClose(){
            this.editDialogVisible = false;
        },
        updateTask(){
            this.editDialogVisible = false
            this.$refs['a'].updateForm();
        },
        ownerTypeFilter(ownerType) {
            if(ownerType === 1){
                return '系统';
            } else if(ownerType === 2){
                return '导购';
            }
        },
        cancelTask(id){
          paApi.cancelTask(id).then(rst=>{
            this.$notify({
              title: '成功',
              message: '作废成功',
              duration: 1000,
              type: 'success'
            });
            this.onSearch(this.filter);
          }).catch(err=>{
            this.$notify.error({
            title: '失败',
            message: '作废失败',
            duration: 1000
          });
          })
        }
      },
      components:{
        Pagination,
        TaskForm
      },
      mounted(){
        this.filter.companyCode = this.selectCompanyInfo.companyCode;
        this.onSearch(this.filter);
        this.getTaskType();
        this.getStatusList();
      },
      computed: {
        ...mapGetters({
          selectCompanyInfo: 'getSelectCompanyInfo',
          userInfo: 'getUserInfo'
        }),
      },
    }
</script>

<style scoped>
  .menu{
    margin:5px;
  }
  .el-button,.el-button--text{
    margin-left: 0;
  }
</style>
