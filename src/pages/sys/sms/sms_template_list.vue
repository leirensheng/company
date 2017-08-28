<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="openBlankDialog()">新建</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteSmsTmp(selected)">删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="smsList" highlight-current-row v-loading="listLoading" style="width: 100%;overflow: auto" current-row-key="number" @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="30"></el-table-column>
        <el-table-column label="编号" min-width="60" width="">
          <template scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用途" min-width="40" sortable>
          <template scope="scope">
            <span>{{judgeType(scope.row.tplSubtype)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="60" sortable>
          <template scope="scope">
            <span>{{scope.row.tplName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" min-width="200" sortable>
          <template scope="scope">
            <span>{{scope.row.tplContent}}</span>
          </template>
        </el-table-column>
        <el-table-column label="短信平台" min-width="80" sortable>
          <template scope="scope">
            <span>{{deeperJson(scope.row.platform)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" sortable>
          <template scope="scope">
            <span class="edit" @click="getDetail(scope.row)">编辑</span>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-dialog title="" :visible.sync="dialogVisible" size="small">
      <el-form label-width="80px">
        <el-form-item label="用途">
          <el-select placeholder="请选择用途" v-model="dialogData.tplSubtype">
            <el-option value="" label="请选择"></el-option>
            <el-option
              v-for="item in options"
              :key="item.tpCategory"
              :label="item.name"
              :value="parseInt(item.tpCategory)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="dialogData.tplName"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="dialogData.tplContent" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
        </el-form-item>
        <el-form-item label="短信平台">
          <el-table :data="dialogTable" border class="dialog-table" style="width: 90%;">
            <el-table-column label="平台" width="180">
              <template scope="scope">
                <img src="../../../assets/img/minus.png" alt="" height="25" width="25" style="vertical-align: middle" @click="removeLine(scope.$index, scope.row)">
                <!--<el-input v-model="scope.row.platformName" style="width: 80%"></el-input>-->
                <el-select placeholder="请选择用途" v-model="scope.row.platformCode" style="width: 75%">
                  <el-option value="" label="请选择"></el-option>
                  <el-option
                    v-for="item in smsPlatformList"
                    :key="item.id"
                    :label="item.platformName"
                    :value="item.platformCode">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="ID" width="180">
              <template scope="scope">
                <el-input v-model="scope.row.platformTmpId"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="优先级">
              <template scope="scope">
                <el-select v-model="scope.row.priority" placeholder="请选择">
                  <el-option value="" label="请选择"></el-option>
                  <el-option
                    v-for="item in priorityOptions"
                    :key="item.key"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <el-button style="float: right;width: 10%;" @click="addLine()" size="small">添加</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveSmsTemp(dialogData)">确 定</el-button>
  </span>
    </el-dialog>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="50"
      layout="total, prev, pager, next"
      :total="this.total">
    </el-pagination>
  </section>
</template>

<script>
  import campaignApi from '../../../api/campaign';
  import Pagination from 'components/Pagination.vue';

    export default {
        data() {
            return {
              filters: {
                tplId: '',
                tplSubType: ''
              },
              smsList: [],
              listLoading: false,
              dialogVisible: false,
              dialogData:{},
              dialogTable:[],
              options:[],
              selectedRow:'',
              priorityOptions:[
                {
                  key:0,
                  value:0
                },
                {
                  key:1,
                  value:1
                },
                {
                  key:2,
                  value:2
                },
                {
                  key:3,
                  value:3
                },
                {
                  key:4,
                  value:4
                }
              ],
              smsPlatformList:[],
              selected:'',
              currentPage:1,
              total:0
            }
        },
      methods:{
        removeLine(index, row) {
          this.dialogTable.splice(index,1);
        },
        addLine() {
            var that = this;
          if(this.smsPlatformList && this.smsPlatformList.length > 0){
            that.dialogTable.push({platformCode: that.smsPlatformList[0].platformCode, platformName: "", platformTmpId: "", enable: 1, priority: 4});
          } else {
            that.dialogTable.push({platformCode: "dahan1", platformName: "", platformTmpId: "", enable: 1, priority: 4});
          }
        },
        judgeType(source) {
            var activity = '';
            if(source){
              let sourceType = source.toString();
              switch(sourceType){
                case '1':
                  activity = '验证码';
                  break;
                case '10':
                  activity = '生日关怀';
                  break;
                case '20':
                  activity = '里程碑关怀';
                  break;
                case '30':
                  activity = '流失挽回';
                  break;
                case '40':
                  activity = '荣耀专场';
                  break;
                case '50':
                  activity = '新草必拔';
                  break;
                case '60':
                  activity = '平日特惠';
                  break;
                case '70':
                  activity = '每日撩我';
                  break;
                case '80':
                  activity = '绑手机送券';
                  break;
              }
            }
            return activity;
        },
        getDetail(obj) {
          this.dialogVisible = true;
          this.selectedRow = this.judgeType(obj.tplSubtype);
          this.getSmsList(1, obj.id);
        },
        getSmsList(args,strfliter) {
          let that = this;
          if(strfliter){
            campaignApi.getSmsList(args,strfliter).then(function (data) {
              that.dialogData = data.data.records[0];
              if(that.dialogData) {
                that.dialogTable = data.data.records[0].platform;
              }
            }).catch(function (reason) {
              // console.log(reason);
            })
          } else {
            campaignApi.getSmsList(args,'').then(function (data) {
              that.smsList = data.data.records;
              that.total = data.data.records.length;
            }).catch(function (reason) {
              // console.log(reason);
            })
          }
        },
        getCategories() {
          let that = this;
          campaignApi.getCampaignCategoriesList().then(function (data) {
            that.options = data.data;
          },function (err) {
            // console.log(err);
          })
        },
        deeperJson(args) {
          let str = '';
          let that = this;
          if (args.length !== 0) {
            args.forEach(function (item) {
              for(let i = 0;i<that.smsPlatformList.length;i++){
                  if(that.smsPlatformList[i].platformCode == item.platformCode)
                    str = str + that.smsPlatformList[i].platformName + '  ';
              }
            });
          }
          return str;
        },
        openBlankDialog() {
          this.dialogVisible = true;
          this.dialogData =
          {
            id: '',
            templateSubtype: null,
            templateName: '',
            templateContent: '',
            platform: []
          };
          this.dialogTable = this.dialogData.platform;
        },
        saveSmsTemp(obj) {
          var that = this;
          var postData = {};
          postData.mappingList = obj.platform;
          obj['platform'] && delete obj['platform'];
          postData.tpTemplates = {};
          postData.tpTemplates.id = obj.id;
          postData.tpTemplates.templateContent = obj.tplContent;
          postData.tpTemplates.templateName = obj.tplName;
          postData.tpTemplates.templateSubtype = obj.tplSubtype;
          campaignApi.saveSmsTemp(postData).then(function (result) {
            // console.log(result);
            that.getSmsList(0);
            that.dialogVisible = false;
          }).catch(function (reason) {
            // console.log(reason);
            const h = that.$createElement;
            that.$notify({
              title: '保存失败',
              message: h('i', { style: 'color: teal'},reason.message),
              type: 'warning'
            });
            that.dialogVisible = false;
          });
//          setTimeout(function () {
//            that.getSmsList(0);
//          },1000);
        },
        getSmsPlatform() {
          let that = this;
          campaignApi.getSmsPlatform().then(function (list) {
            that.smsPlatformList = list.data
          }).catch(function (reason) {
            // console.log(reason);
          })
        },
        handleSelectionChange(val) {
          let that = this;
          if (val.length > 0) {
            that.selected = val[0].id;
          }
        },
        deleteSmsTmp(id) {
          let that = this;
          campaignApi.deleteSmsTmp(id).then(function (result) {
            that.getSmsList(1);
          }).catch(function (reason) {
            const h = that.$createElement;
            that.$notify({
              title: '删除失败',
              message: h('i', { style: 'color: teal'},reason.message),
              type: 'warning'
            });
          });
//          setTimeout(function () {
//            that.getSmsList(1);
//          },1000);
        },
        handleSizeChange(size){
          this.pageSize = size;
          // this.getSmsList();
        },
        // 分页处理 - 改变 currentPage
        handleCurrentChange(currentPage){
          this.getSmsList(currentPage);
//          this.getPageData(currentPage);
        },
        getPageData: function(){
          // 分页查询 列表数据
          var param = {
            page: {
              current: this.currentPage || 1,
              size: 50
            },
            params: {
              tplId: this.filters.tplId || undefined,
              tplSubType: this.filters.tplSubType || undefined
            }
          };
          this.listLoading = true;
          campaignApi.getSmsTplList(param).then((res)=>{
            this.currentPage = res.data.current;
            this.pageSize = res.data.size;
            this.total = res.data.total;
            this.smsList = res.data.records;
            this.listLoading = false;
          }).catch((err)=>{
            this.listLoading = false;
          });
        }
      },
      components:{
        Pagination
      },
      mounted() {
        // this.getPageData();
        this.getSmsList(1);
        this.getCategories();
//        var that = this;
//        this.getSmsList(1);
//        this.getCategories();
        this.getSmsPlatform();
      }
    }
</script>

<style>
  .dialog-table{
    width: 90%;
    float: left;
  }
  .edit{
    color: #4db3ff;
    cursor: pointer;
  }
</style>

