<template>
  <div class="container">
    <header-bar></header-bar>
    <el-row :span="24" class="main">
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <!--<strong class="title">{{$route.name}}</strong>-->
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" key="">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition>
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-row>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
  import HeaderBar from './HeaderBar';
  import FooterBar from './FooterBar';

  export default {
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
        }
      }
    },
    components:{
      HeaderBar, FooterBar
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      //折叠导航栏
      collapse:function(){
        this.collapsed=!this.collapsed;
      }
    }
  }

</script>

<style rel="stylesheet/scss" scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .main {
      display: flex;
      // background: #324057;
      // position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      .content-container {
        // background: #f1f2f7;
        flex:1;
        // position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 230px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
          //margin-bottom: 15px;
          .title {
            width: 200px;
            float: left;
            color: #475669;
          }
          .breadcrumb-inner {
            margin-bottom: 10px;
            float: left;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
