<template>
  <div>
    <el-row class="header">
      <el-col :span="4" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <span class="default"><label>小优会零售会员云平台</label></span>
      </el-col>
      <el-col :span="12">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" menu-trigger="hover"  @open="handleOpen" @close="handleClose" @select="handleSelect"
                 unique-opened router v-show="true">
          <template v-for="(item,index) in mymenus"  v-if="!item.hidden" >
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title"><i :class="item.iconcls"></i>{{item.name}}</template>
              <el-menu-item v-for="child in item.children" key="" :index="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" @click="gotoPage(item.children[0].path)"><i :class="item.iconcls"></i>{{item.children[0].name}}</el-menu-item>
          </template>
        </el-menu>

      </el-col>
      <el-col :span="3" v-if="userInfo.companyType==9" >
        <el-select size="small" v-model="companySelect" filterable placeholder="请选择客户" @change="handSelectCompany">
          <el-option v-for="item in companyOptions" :label="item.companyName" :value="item.companyCode" :key="item.companyCode">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="click">
          <!--<img :src="this.sysUserAvatar" />-->
          <span class="el-dropdown-link userinfo-inner">欢迎您，{{userInfo.name}}！</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item divided @click.native="showResetPassword">更改密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <!-- 重置密码 -->
    <el-dialog title="更改密码" v-model="resetPassDialog.show" :close-on-click-modal="false">
      <user-reset-password :account="resetPassDialog.account" :userId="resetPassDialog.userId" :resetPass="resetPassDialog.resetPass" v-on:submitDone="resetPassCallBack" ></user-reset-password>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import {$listener, LSN} from 'supports/service/events';
  import commonApi from 'src/api/common'
  import UserResetPassword from 'components/password/UserResetPassword.vue'

  export default {
    components:{
      UserResetPassword
    },
    data() {
      return {
        sysName:'VUEADMIN',
        collapsed:false,
        sysUserName: '',
        sysUserAvatar: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        companySelect: '',
        resetPassDialog: {
          show: false,
          account: '',
          userId: '',
          resetPass: 'new'
        }
      }
    },
    computed: {
//      mymenus(){
//        return this.$store.getters.getMenus;
//      },
//      mymenus() { return this.$router.options.routes.concat([]) },
      ...mapGetters({
        mymenus: 'getMenus',
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo',
        companyOptions: 'getCompanyMenuList'
      })

    },
    methods: {
      //退出登录
      logout: function () {
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          this.signOut().then(()=> {
            _this.$router.push({path: '/login'});
          })
        }).catch(() => {

        });


      },
      //折叠导航栏
      collapse:function(){
        this.collapsed=!this.collapsed;
      },
      onSubmit() {
      },
      handleOpen() {},
      handleClose() {},
      handleSelect: function (a, b) {},
      gotoPage(url){
        this.$router.push(url);
      },
      handSelectCompany(item){
        this.setSelectCompanyInfo({'companyCode':item});
//        $listener.$emit(LSN.COMPANY_CHANGE, item);
      },
      getCompanies(){
        commonApi.getCompanies().then((res) => {
          res.data.forEach(company =>{
            this.companyOptions.push({'value':company.companyCode,'label':company.companyName});
          });
          this.companySelect = this.selectCompanyInfo.companyCode;
        });
      },

      ...mapActions(['loadFullUserInfo', 'signOut', 'setSelectCompanyInfo', ]),
      showResetPassword: function () {
        this.resetPassDialog.userId = this.userInfo.id;
        this.resetPassDialog.account = this.userInfo.account;
        this.resetPassDialog.show = true;
      },
      resetPassCallBack: function (data) {
        if (data.status === 0 ) {
          this.resetPassDialog.show = false;
        } else {
          this.resetPassDialog.show = false;
          let _this = this;
          if (!data.errcode) { //密码重置成功后强制退出
            this.$notify({
              title: '设置新密码',
              message: '新密码设置成功',
              type: 'success'
            });
            this.signOut().then(()=> {
              _this.$router.push({path: '/login'});
            })
          }
        }
      }
    },
    mounted() {
      this.loadFullUserInfo(false).then(()=>{
        this.companySelect = this.selectCompanyInfo.companyCode;
      });
    },
    watch:{
      companySelect(n, o){
        if(o && o != n){
          location.reload();
        }
      }
    }
  }

</script>

<style rel="stylesheet/scss" scoped lang="scss">
    .header {
      position: fixed;
      width: 100%;
      height: 60px;
      line-height: 60px;
      z-index: 1000;
      background: #eef1f6;//#20a0ff
      color:#fff;
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color:#48576a;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }
      }
      .logo {
        //width:230px;
        height:60px;
        font-size: 22px;
        padding-left:20px;
        padding-right:20px;
        border-color: rgba(238,241,146,0.3);
        border-right-width: 1px;
        border-right-style: solid;

        .default {
          margin-top: 15px;
          display: inline-block;
          width: 176px;
          height: 27px;
          background: url("../../assets/img/auth/logo.png") no-repeat;
          font-size: 13px;
          color: #48576a;
          text-align: center;
          label{
            display: inline-block;
            margin-top: 5px;
          }
        }

      }
      .tools{
        padding: 0px 23px;
        width:14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }

</style>
