<template>
  <el-dialog :visible.sync="outlets.show" :title="outlets.title" :close-on-click-modal="false" >
    <el-checkbox-group v-model="checkData">
      <el-checkbox v-for="tag in outlets.data" :label="tag.name" :key="tag.id">{{tag.name}}</el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="outlets.show = false">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props:['outlets','inputs','append'], //{show: true/false,  data:[OutletsTag], title:'',}
    data() {
      return {
        checkData: [],
        sendData: []
      };
    },
    methods: {
      submit: function() {
        let _this = this;
        _this.outlets.data.forEach(function(item) {
          _this.checkData.forEach(function(tagName) {
            if (item.name === tagName) {
              let data = {};
              data.level = "OUTLETS";
              data.outletId = item.id;
              data.label = item.name;
              data.key = _this.outlets.remark+"_"+item.name;
              _this.append(data);
            }
          });
        });
        this.outlets.show = false;
      }
    }
  }
</script>

<style scoped>
  .el-dialog .el-tag:first-child{margin-left: 10px;}
  .el-dialog .el-tag + .el-tag {margin: 10px 0  10px 10px;}
</style>
