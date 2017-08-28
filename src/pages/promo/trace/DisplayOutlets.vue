<template>
  <el-dialog :title="outlets.title" v-model="outlets.show" :close-on-click-modal="false" >
    <el-tag type="gray" v-for="tag in outlets.data" :key="tag.id">{{tag.name}}</el-tag>
  </el-dialog>
</template>

<script>
  export default {
    props:['outlets'], //{show: true/false,  data:[OutletsTag], title:'',}
    data() {
      return {
      };
    },
    methods: {
    }
  }
</script>

<style scoped>
  .el-dialog .el-tag:first-child{margin-left: 10px;}
  .el-dialog .el-tag + .el-tag {margin: 10px 0  10px 10px;}
</style>
