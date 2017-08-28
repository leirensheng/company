<template>
	<section>
    <el-row :gutter="20">
      <el-col :span="6" :offset="4">
        我的消息：<div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="6" :offset="4">
        会员概况：
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16" :offset="4">
        正在执行的活动：
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
	</section>
</template>

<script>
	export default {
	}

</script>

<style scoped>
  .grid-content{
    height: 240px;
    background-color: #eef1f6;
    margin-top: 20px;
  }

</style>
