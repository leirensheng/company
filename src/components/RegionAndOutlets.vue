<template>
  <el-cascader placeholder="选择区域/门店" :props="propsDef"  :options="regionAndOutletsOptions" filterable change-on-select @change="handRegionOutletsChange"></el-cascader>
</template>

<script>
  import commonApi from '../../src/api/common';

  export default {
    props:['companyCode'],
    data() {
      return {
          propsDef: {
              value: 'id',
              label: 'name'
          },
        regionAndOutletsOptions:[]
      };
    },
    methods: {
      getRegionAndOutlets(){
        let queryParams = {
          companyCode:this.companyCode,
          existsNode: 1,
          depth:5 // 已经不能用
        };
        commonApi.getOrganizationStructure(queryParams).then((res) => {
          let outsPuts = [{code: '', name: '全部区域'}];
          this.regionAndOutletsOptions = outsPuts.concat(res.data);
        });
      },
      handRegionOutletsChange(selectData){
        this.$emit('handRegionOutletsChange', selectData);
      }
    },
    mounted() {
      this.getRegionAndOutlets();
    }
  }
</script>

<style scoped>
</style>
