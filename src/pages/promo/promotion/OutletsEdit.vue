<template>
  <div class="outlets-content">
    <p>选择门店区域</p>
    <el-row type="flex">
      <el-col :span="14" class="outlets-tree">
        <el-tree :data="regionTree" :props="defaultProps" :highlight-current="true" node-key="id" :render-content="renderContent" :class="{'bg_color':!isEdit}"></el-tree>
      </el-col>
      <el-col :span="10" class="outlets-select-content">
        <el-tag v-for="tag in inputs.tags" :key="tag.id" :closable="isEdit" type="gray" @close="handleTagClose(tag)"> {{tag.label}}</el-tag>
      </el-col>
    </el-row>
    <p>选择门店类型</p>
    <el-row type="flex">
      <el-col :span="24">
        <el-select  v-model="inputs.outletsType" multiple placeholder="请选择" :disabled="!isEdit" style="width: 50%;">
          <el-option-group
            v-for="group in inputs.options"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.codeValueDesc"
              :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>
      </el-col>
    </el-row>
    <display-outlets :outlets="outlets" :inputs="inputs" :append="append"></display-outlets>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import regionApi from 'src/api/region';
  import commonApi from 'src/api/common'
  import DisplayOutlets from './DisplayOutlets.vue';
  export default {
    components:{
      DisplayOutlets
    },
    props:['inputs', 'isEdit', 'regionId'], // tags {name:tagName, id:key}
    data (){
      return {
        defaultProps: {
          children: 'children',
          label: ''
        },
        outlets:{show:false, data:[{name:""}], title:"显示门店"},
        regionTree: [],
        optionValue: []
      };
    },
    computed:{
      ...mapGetters({
        selectCompanyInfo:'getSelectCompanyInfo',
      })
    },
    methods:{
      append(data) {
        let isAdd = false;
        let _self = this.inputs.selectTags;
        if(_self.length >0){
          _self.forEach(function(item) {
            if(data.key.indexOf(item) >= 0 ){ //|| item.indexOf(data.key) >= 0
              isAdd = true;
            }
          });
        }
        if (isAdd){
          this.$notify({
            title: '警告',
            message: `已选择的门店,已包含${data.label}门店`,
            type: 'warning'
          });
        }else {
          //let tempTag = Object.assign({},{id:data.id || data.code,label:data.label || '',level:data.level || '',code:data.code || ''});
          let obj = {
            regionId: "",
            provId: "",
            cityId: "",
            countyId: "",
            outletId: "",
            outletsLevel: "",
            label: "",
            remark: ""
          };
          switch (data.level) {
            case "REGION":
              obj.effectLevel = 1;
              obj.regionId = data.id;
              obj.label = data.label;
              obj.remark = data.key;
              break;
            case "PROV":
              obj.effectLevel = 2;
              obj.provId = data.code;
              obj.label = data.label + "所有门店";
              obj.remark = data.key;
              break;
            case "CITY":
              obj.effectLevel = 3;
              obj.cityId = data.code;
              obj.label = data.label + "所有门店";
              obj.remark = data.key;
              break;
            case "COUNTY":
              obj.effectLevel = 4;
              obj.countyId = data.code;
              obj.label = data.label + "所有门店";
              obj.remark = data.key;
              break;
            case "OUTLETS":
              obj.effectLevel = 5;
              obj.cityCode = data.code;
              obj.label = data.label;
              obj.remark = data.key;
              obj.outletId = data.outletId;
              break;
            default:
              break;
          }
          if (this.inputs.tags) {
            this.inputs.tags.push(obj);
          } else {
            this.inputs.tags = [];
            this.inputs.tags.push(obj);
          }
          _self.push(data.key);
        }
      },
      getOutlets(data){
        let params = {
          regionId: this.inputs.regionId,
          companyCode: this.selectCompanyInfo.companyCode,
          cityCode: 0,
          countyCode:data.code || '',
        };
        commonApi.getListByFilterCode({params: params}).then((res)=>{
          this.outlets.title = data.label+'区/县包含门店如下';
          this.outlets.show = true;
          this.outlets.data = res.data;
          this.outlets.remark = data.key;
        }).catch((err)=>{
          this.$notify({
            title: '失败',
            message: '查看门店失败' + err.message,
            type: 'error'
          });
        });
      },
      renderContent(h, { node, data, store }) {
        let OutletsBtn = '';
        let labelName = '';
        let selectBtn = <el-button size="mini" on-click={() => this.append(data)}>选择</el-button>;
        if (node.data.level === 'REGION'){
          labelName = node.data.label;
        }else if (node.data.level === 'PROV'){
          labelName = node.data.label + '省';
        }else if (node.data.level === 'CITY'){
          labelName = node.data.label + '市';
        }else if(node.data.level === 'COUNTY'){
          labelName = node.data.label + '区/县';
          OutletsBtn = <el-button size="mini" on-click={ () => this.getOutlets(data) }>查看</el-button>;
        }
        if (!this.isEdit) {
          OutletsBtn = '';
          selectBtn = ''
        }
        return (<span>
          <span>
          <span>{labelName}</span>
          </span>
          <span style="float: right; margin-right: 20px">
          {OutletsBtn}
          {selectBtn}
        </span>
        </span>);
      },
      handleTagClose(tag) {
        this.inputs.tags.splice(this.inputs.tags.indexOf(tag), 1);
        this.inputs.selectTags.splice(this.inputs.selectTags.indexOf(tag.remark), 1);
      },
      getRegionTreeData: function (regionId) {
        let param = {params: {companyCode: this.selectCompanyInfo.companyCode, regionId: regionId }};
        regionApi.getRegionProvCity(param).then((res)=>{
          this.regionTree = res.data;
        })
      },
      getRegionId: function (campId) {
        let that = this;
        let param = {params: {campaignId: campId}};
        regionApi.getRegionIdByCampId(param).then(res => {
          that.getRegionTreeData(res.data);
        })
      }
    },
    mounted: function(){
      let campId = this.$route.query['id'];
      if (campId) {
        this.getRegionId(campId);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .outlets-content {
    margin-left: 20px;
    .bg_color {
      color: #bbb;
      background-color: #eef1f6;
    }
    .outlets-tree {
      margin: 0 20px 0 0;
    }
    .outlets-select-content {
      border: 1px solid #d1dbe5;
      padding: 10px 5px;
      overflow-y: auto;
    }
    .outlets-select-content span:first-child {
      margin-left: 5px;
    }
    .outlets-select-content span + span {
      margin: 5px 0 0 5px;
    }
  }

</style>
