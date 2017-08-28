<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!--<el-form-item>-->
          <!--<el-input v-model="filters.name" placeholder="用户账号"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" v-on:click="">查询</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="addCompany">新增客户</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table :data="users" highlight-current-row style="width: 100%;">
      <el-table-column prop="companyName" label="公司名称" >
      </el-table-column>
      <el-table-column prop="companyShortName" label="公司简称">
      </el-table-column>
      <el-table-column prop="companyCode" label="公司编号">
      </el-table-column>
      <el-table-column prop="wxMpId" label="微信公众号ID">
      </el-table-column>
      <el-table-column prop="appSecret" label="appSecret" min-width="150">
      </el-table-column>
      <el-table-column prop="appKey" label="appID" min-width="150">
      </el-table-column>
      <el-table-column label="公众号类型">
        <template scope="scope">
          {{wxType(scope.row.wxMpPrivate)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template scope="scope">
          <el-button size="small" type="text" style="color: #3877ff;" @click="editCompanyInfo(scope.row)" v-if="scope.row.companyType != 9">修改</el-button>
          <el-button size="small" type="text" style="color: #3877ff;" @click="editCustomerInfo(scope.row.companyCode)" v-if="scope.row.appSecret != null && scope.row.appKey != null && scope.row.appSecret != '' && scope.row.appKey != ''">公众号菜单</el-button>
          <el-button size="small" type="text" style="color: #3877ff;" @click="gotoEditWxFrontPage(scope.row.companyCode)">公众号首页</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--修改用户信息弹出框-->
    <template>
      <el-dialog title="修改公众号菜单" v-model="editDialogVisible" @close="handleClose()">
        <el-row class="tac">
          <el-col :span="8">
            <el-tree :data="treeData" @node-click="handleNodeClick" node-key="id" :render-content="renderContent"></el-tree>
            <div style="text-align: center;margin-top: 5px;" @click="addNewTab(1)">
            <i class="el-icon-plus" v-if="treeData.length < 4">添加一级菜单</i>
            </div>
          </el-col>
          <el-col :span="14" style="margin-left: 3%">
            <template v-if="selectedLevel == 1">
              <el-radio class="radio" v-model="isButton" :label="false">链接</el-radio>
              <el-radio class="radio" v-model="isButton" :label="true">按钮</el-radio>
            </template>
            <br><br><span>菜单名称：</span><el-input placeholder="请输入内容" v-model="editObj.label"></el-input>
            <span v-if="contentVisible">URL：</span><el-input placeholder="请输入内容" v-model="editObj.url" v-if="contentVisible"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editWxMenu(editObj)">保 存</el-button>
  </span>
      </el-dialog>
    </template>
    <!--新建客户-->
    <customer-create :inputs="customerCreateVisible" v-on:handleCreateUser="handleCreateUser"></customer-create>
    <!--编辑客户-->
    <customer-edit :inputs="customerEditVisible" :form="companyData" v-on:handleUpdateUser="handleUpdateUser"></customer-edit>


  </section>
</template>

<style lang="scss">

</style>

<script>

  import sys from '../../../api/sys';
  import customerCreate from './customerCreate.vue';
  import customerEdit from './customerEdit.vue';

  let id = 1000;

  export default {
    data() {
      return {
        menu:{
          button:[{
            name:"My优选",
            sub_button:[
              {
                type:"view",
                name:"每日撩我",
                url: "http://dev.wx.yoorstore.com/punch-card"
              },
              {
                type:"view",
                name:"荣耀专场",
                url: "http://dev.wx.yoorstore.com/activity/40"
              },
              {
                type:"view",
                name:"新草必拔",
                url: "http://dev.wx.yoorstore.com/activity/50"
              },
              {
                type:"view",
                name:"平日特惠",
                url: "http://dev.wx.yoorstore.com/activity/60"
              },
              {
                type:"view",
                name:"精明攻略",
                url: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI1MjY4NjAyOA==&scene=124#wechat_redirect"
              }
            ]
          },
            {
              name:"My卡包",
              type: "view",
              url:"http://dev.wx.yoorstore.com/coupon"
            },
            {
              name:"My小优",
              sub_button:[
                {
                  type:"view",
                  name: "活动门店",
                  url: "http://dev.wx.yoorstore.com/activity-outlets"
                },
                {
                  type:"view",
                  name:"愿望清单",
                  url: "http://dev.wx.yoorstore.com/wish"
                },
                {
                  type:"view",
                  name:"会员信息",
                  url: "http://dev.wx.yoorstore.com/aud-info"
                },
                {
                  type:"click",
                  name:"在线客服",
                  key: "V1001_CS"
                }
              ]
            }
          ]
        },
        users:[{
          customerName:'公司A',
          customerId:'123456',
          customerNick:'A',
          test:'test'
        }],
        editDialogVisible:false,
        contentVisible:true,
        selectedLevel:1,
        currentFirstClass:'',
        editObj:{
          name:'',
          url:''
        },
        filters:{
            name:''
        },
        customerCreateVisible:{
            show:false,
            reload:false
        },
        customerEditVisible:{
            show:false,
            reload:false
        },
        companyData:{},
        isButton:'',
        treeData:[],
        companyCode:''
      }
    },
    methods:{
      editCustomerInfo(companyCode) {
        this.companyCode = companyCode;
        this.getWxMenu(companyCode);
        this.editDialogVisible = true;
      },
      handleOpen(obj,level) {
        this.selectedLevel = level;
        this.editObj = obj;
        if(level === 1){
          this.currentFirstClass = obj;
        }
        if(obj.url || obj.url !== undefined){
          this.contentVisible = true;
        } else {
          this.contentVisible = false;
        }

      },
      handleClose() {
        this.editObj = {};
      },
      addNewTab(level,campanyCode) {
          var that = this;
          var companyCode = this.companyCode;
          let postData;
          if(level === 1){
              postData = {
              companyCode:companyCode,
              menuType:1,
              menuName:'新菜单',
              menuValue:'',
              parentId:0,
              sortNo:0
            };
          }
          if(level === 2){
            postData = {
              companyCode:companyCode,
              menuType:2,
              menuName:'新菜单',
              menuValue:'',
              parentId:that.editObj.id,
              sortNo:0
            };
          }
        sys.submitWxMenu(postData).then(rst=>{
          this.getWxMenu(companyCode);
        })
      },
      getInitData() {
        let that = this;
        sys.companyReadList().then(rst=>{
          that.users = rst.data.records;
        });
      },
      addCompany() {
        this.customerCreateVisible.show = true;
      },
      wxType(type) {
        let content = '';
        switch(type){
          case 0:
            content = '公用小优会';
            break;
          case 1:
            content = '使用客户自有公众号';
            break;
        }
        return content;
      },
      editCompanyInfo(row) {
        this.customerEditVisible.show = true;
        this.companyData = row;
      },
      handleCreateUser: function (formData){
        this.getInitData();
      },
      handleUpdateUser: function (formData){
        this.getInitData();
      },
      getWxMenu (params) {
        this.treeData = [];
        var that = this;
        sys.getWxMenu(params).then(rst=>{
          rst.data.button.forEach(function (index) {
            if(index.parentId === '0') {
              var obj = {
                label: index.name,
                id:index.id,
                type:index.type,
                url:index.url || index.menuValue,
                companyCode:index.companyCode,
                children: []
              };
              if (index.sub_button.length !== 0) {
                for (let i = 0; i < index.sub_button.length; i++) {
                  obj.children[i] = {
                      label:index.sub_button[i].name,
                      id:index.sub_button[i].id,
                      url:index.sub_button[i].url || index.sub_button[i].menuValue,
                      type:index.sub_button[i].type,
                      parentId:index.sub_button[i].parentId
                  };
                }
              }
            }
            that.treeData.push(obj);
          });
        })
      },
      handleNodeClick(data,node,component) {
        this.editObj = data;
      },
      editWxMenu (params) {
//        this.editDialogVisible = false;
        if(params.children && params.children.length > 0 && params.type == 'view'){
          this.$notify.error({
            title: '错误',
            message: '该菜单下有其他子菜单，提交失败'
          });
          return false;
        }
        if(params.children == undefined && params.type == 'click'){
          this.$notify.error({
            title: '错误',
            message: '该菜单不能有子菜单，提交失败'
          });
          return false;
        }
        sys.editWxMenu(params).then(rst=>{
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success'
          });
        })
      },
      deleteTab (id) {
        this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sys.deleteTab(id).then(rst => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getWxMenu(this.companyCode);
          });
        }).catch(() => {
        });
      },
      gotoEditWxFrontPage(id) {
          this.$router.push({path: '/sys/customer/editWxFrontPage/'+ id })
      },
      remove(store, data) {
        store.remove(data);
      },
      renderContent(h, { node, data, store }) {
        if(node.level == 1){
            return (
              <span>
              <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button size="mini" on-click={ () => this.addNewTab(2) }> + </el-button>
            <el-button size="mini" on-click={ () => this.deleteTab(node.data.id) }> - </el-button>
            </span>
            </span>);
          } else {
            return (
              <span>
              <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
            <el-button size="mini" on-click={ () => this.deleteTab(node.data.id) }> - </el-button>
            </span>
            </span>);
          }

      },
      deleteMenu(obj,level) {
    if(level == 1){
      let index = this.menu.button.indexOf(obj);
      this.menu.button.splice(index,1);
    } else if(level == 2){
        this.menu.button.forEach(function (index) {
          var subButton = index.sub_button;
          if(subButton && subButton.indexOf(obj) >= 0){
            subButton.splice(subButton.indexOf(obj),1);
          }
        })
    }
  }
    },
    mounted() {
      this.getInitData();
    },
    components: {
        customerCreate,
        customerEdit
    },
    watch: {
      editObj(obj){
          if (obj.type === 'view' && this.selectedLevel === 1) {
              this.isButton = false;
          } else if(obj.type !== 'view' && this.selectedLevel === 1){
              this.isButton = true;
          }
      },
      isButton(newValue,oldValue){
          if(newValue === !oldValue){
            this.contentVisible = false;
              if(newValue === true && oldValue === false){
//                this.editObj.url = '';
                this.editObj.type = 'click';
              }
            if(newValue === false && oldValue === true){
              this.contentVisible = true;
//              this.editObj.url = '';
              this.editObj.type = 'view';
              }
          }
  }
    }
  }
</script>
