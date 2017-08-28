<template>
  <el-row class="footer">
    <el-col :span="24">
      <div>
        <a>关于我们</a><a>联系我们</a><a>友情链接</a><a>隐私政策</a>
      </div>
      <div>
        <a>Copyright @ 2017 优思得 yoorstore.com 版权所有</a>
      </div>
    </el-col>
  </el-row>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
        return {
        };
    },
    computed: {
    },
    methods: {
    },
    created () {
    }
  }

</script>

<style rel="stylesheet/scss" scoped lang="scss">
  .footer {
    margin-top: 65px;
    padding: 15px;
    /*height: 60px;*/
    /*line-height: 60px;*/
    background: #eef1f6;//#20a0ff
    color:#fff;
    border-top: 5px solid #42b983;
    div{
      div{
        text-align: center;
        height: 15px;
        a{
          margin-left: 10px;
          color: #48576a;
        }
      }
    }

    /*aside {*/
      /*flex:0 0 230px;*/
      /*width: 230px;*/
      /*// position: absolute;*/
      /*// top: 0px;*/
      /*// bottom: 0px;*/
      /*.el-menu{*/
        /*height: 100%;*/
      /*}*/
    /*}*/
  }
</style>
