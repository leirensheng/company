<template>
  <div class="select-outlets-content">
    <el-row type="flex">
      <el-col :span="10" class="select-outlets-tree">
        <el-tree :data="regionTree" :props="defaultProps" node-key="id" :expand-on-click-node="false" :render-content="renderContent" ></el-tree>
      </el-col>
      <el-col :span="14" class="select-outlets-select-content">
        <el-tag v-for="tag in inputs.tags" :key="tag.id" :closable="true" type="gray" @close="handleTagClose(tag)" > {{tag.label}}所有门店</el-tag>
      </el-col>
    </el-row>

    <display-outlets :outlets="this.outlets"></display-outlets>

  </div>

</template>

<script>
  import DisplayOutlets from './DisplayOutlets.vue';
  import { mapGetters } from 'vuex';
  import regionApi from 'src/api/region';
  import commonApi from '../../../api/common'

  export default {
    props:['inputs'], // tags {name:tagName, id:key}
    data (){
      return {
        defaultProps: {
          children: 'children',
          label: ''
        },
        selectTags:[],
        outlets:{show:false, data:[{name:""}], title:"显示门店"},
        regionTree: [],
      };
    },
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    methods:{
      append(data) {
        // CHECK 是否已经添加所包含的门店
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
        }else{
          //let tempTag = Object.assign({},{id:data.id || data.code,label:data.label || '',level:data.level || '',code:data.code || ''});
          let obj = {regionId:"", provId:"", cityId:"",countyId:"", outletId:"",  outletsLevel:"", label:"", remark:""};
          switch (data.level){
            case "REGION":
              obj.effectLevel =1;
              obj.regionId=data.id;
              obj.label = data.label;
              obj.remark = data.key;
              break;
            case "PROV":
              obj.effectLevel = 2;
              obj.provId=data.code;
              obj.label = data.label;
              obj.remark = data.key;
              break;
            case "CITY":
              obj.effectLevel = 3;
              obj.cityId=data.code;
              obj.label = data.label;
              obj.remark = data.key;
              break;
            case "COUNTY":
              obj.effectLevel = 4;
              obj.countyId=data.code;
              obj.label = data.label;
              obj.remark = data.key;
              break;
            case "OUTLETS":
              obj.effectLevel = 5;
              obj.cityCode=data.code;
              obj.label = data.label;
              obj.remark = data.key;
              break;
            default:
                break;
          }
          this.inputs.tags.push(obj);
          _self.push(data.key);
        }
      },
      getOutlets(data){
          let params = {
              companyCode: this.selectCompanyInfo.companyCode,
              cityCode: 0,
              countyCode:data.code || '',
          };
          commonApi.getListByFilterCode({params: params}).then((res)=>{
            this.outlets.title = data.label+'区/县包含门店如下';
            this.outlets.show = true;
            this.outlets.data = res.data;
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
        return (<span>
                  <span>
                    <span>{labelName}</span>
                  </span>
                  <span style="float: right; margin-right: 20px">
                    {OutletsBtn}
                    <el-button size="mini" on-click={() => this.append(data)}>选择</el-button>
                  </span>
                </span>);
      },
      handleTagClose(tag) {
        this.inputs.tags.splice(this.inputs.tags.indexOf(tag), 1);
        this.inputs.selectTags.splice(this.inputs.selectTags.indexOf(tag.key), 1);
      },

      getRegionTreeData: function () {
        let param = {params: {companyCode: this.selectCompanyInfo.companyCode}}
        regionApi.getRegionProvCity(param).then((res)=>{
          this.regionTree = res.data;
        })
      },

    },
    components:{
      DisplayOutlets
    },
    mounted: function(){
        this.getRegionTreeData();
    },



  }

</script>

<style scoped>
  .select-outlets-content {
    padding: 15px 15px;
  }
  .select-outlets-tree {
    margin: 0 20px 0 0;
  }
  .select-outlets-select-content {
    border: 1px solid #d1dbe5;
    padding: 10px 5px;
    overflow-y: auto;
  }
  .select-outlets-select-content span:first-child {
    margin-left: 5px;
  }
  .select-outlets-select-content span + span {
    margin: 5px 0 0 5px;
  }
</style>
