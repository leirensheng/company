<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-select
        ref="geoRule"
        style="width: 100%;"
        v-model="selectedGeosList"
        multiple
        filterable
        remote
        placeholder="选择人群地域范围(支持省份名称或拼音快速查询)"
        :loading="loading"
        :remote-method="handleSearchFilter"
        @change="changeGeoRule"
        @remove-tag="selectGeoRuleRemove">
        <el-option v-for="item in cityList" :label="item.name" :value="item.code" :key="item.code">
          <span style="float: left">{{item.description}}</span>
        </el-option>
      </el-select>
    </el-col>
    <div style="float: right; margin:15px 0;">
      <el-button @click.native="cancelBtn">取消</el-button>
      <el-button @click.native="saveRules" type="primary">添加</el-button>
    </div>
  </el-row>

</template>

<script>
  import tagApi from 'src/api/tag';
  import _ from 'underscore';
  export default {
    props: ['filterGeos', 'arges'],
    data () {
      return {
        loading: false,
        cityList: [] ,
        geosDict: [{id:201, tagName: '省'}, {id:202, tagName: '市'}, {id:203, tagName: '区县'}],
        selectedGeosList: [],
        tmp:[]
      };
    },
    methods: {
      selectGeoRuleRemove: function (tag) {
        let cl = _.findWhere(this.tmp, {code: tag.value});
        this.tmp.splice(this.tmp.indexOf(cl), 1);
      },
      changeGeoRule: function (res) {
        if (res.length === 1){
          let cl = _.findWhere(this.cityList, {code: res[0]});
          this.tmp.push(cl);
        } else if(res.length > 0) {
          let tmpCode = [];
          _.each(this.tmp, function (item) {
            if(item) {
              tmpCode.push(item.code);
            }
          });
          let newCode = _.difference(res, tmpCode);
          if (newCode){
            let ncl = _.findWhere(this.cityList, {code: newCode[0]});
            this.tmp.push(ncl);
          }
        }
        this.$refs.geoRule.query ='';
      },
      handleSearchFilter: function (query) {
        let strs=query.replace(/(^\s+)|(\s+$)/g, "");
        let patt1 = new RegExp(/^[a-zA-Z]{2,}$/);
        let patt2 = new RegExp(/^[\u4e00-\u9fa5]+$/);

        let _cityList = [];
        let _provList = [];
        _.each(this.filterGeos, function (item) {
          if (item.tagId === '201'){
            _provList.push(item.valueIds);
          } else if (item.tagId === '202'){
            _cityList.push(item.valueIds);
          }
        });
        if (strs !== '' && (patt1.test(strs) || patt2.test(strs))) {
          this.loading = true;
          let param = {
            cityList: _cityList,
            provList: _provList,
            keyword: query
          };
          tagApi.getTagGeoProvincesList(param).then(res=>{
            this.loading = false;
            this.cityList = res.data; // this.geosRule.concat(res.data);
          }).catch(e=>{
          })
        }
      },
      saveRules: function () {
        if (this.tmp.length < 1){
          this.$message.error('请输入地域名称或拼音简称来选择地域');
        } else {
          let geoRules = [];
          let arr = _.union(this.tmp); // 去重
          arr.forEach(item => {
            if (item) {
              let obj = {ruleType: 'GEO', tagId: '201', operator: 'EQ', valueIds: item.code, tagName: item.name, valueNames: item.description, ruleGroup: 9999};
              if (item.level === 1) {
                obj.tagId = 201;
              } else if (item.level === 2) {
                obj.tagId = 202;
              } else if (item.level === 3) {
                obj.tagId = 203;
              }
              geoRules.push(obj);
            }
          });

          this.arges.show=false;
          // this.tmp = [];
          // this.selectedGeosList = [];
          this.$emit('editGeos', geoRules);
        }
      },
      cancelBtn: function () {
        this.arges.show=false;
      },
    },
    mounted() {
    }
  };
</script>

<style lang="scss">
</style>
