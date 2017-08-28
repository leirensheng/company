<template>
  <el-row class="outlets-view">
    <el-col :span="24">
      <el-tag v-for="tag in inputs.tags" :key="tag.id" type="gray" v-if="inputs.tags.length > 0"> {{tag.label}}所有门店</el-tag>
      <span v-if="inputs.tags.length==0">暂无数据</span>
    </el-col>
  </el-row>
</template>

<script>
  export default {
     props: ['inputs'],
    data () {
      return {
      }
    }
  };
</script>

<style scoped>
  .outlets-view span.el-tag:first-child {
    margin-left: 5px;
  }
  .outlets-view span.el-tag + span.el-tag {
    margin: 5px 0 5px 5px;
  }
</style>
