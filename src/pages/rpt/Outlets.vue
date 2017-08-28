<template>
  <div class="outlets-content">
    <!--<button @click="handlebtn">test</button>-->
    <p>选择门店区域</p>
    <el-row type="flex">
      <!--控件数-->
      <el-col :span="14" class="outlets-tree" v-loading="loading">
        <el-tree :data="regionTree" :props="defaultProps" :highlight-current="true" node-key="id" :render-content="renderContent" ></el-tree>
      </el-col>
      <!--右边的已经选择的标签-->
      <el-col :span="10" class="outlets-select-content">
        <el-tag v-for="tag in inputs.tags" :key="tag.id"  :closable="true" type="gray" @close="handleTagClose(tag)"> {{tag.label}}</el-tag>
      </el-col>
    </el-row>
    <!--查看具体门店-->
    <display-outlets :outlets="outlets" :inputs="inputs" :append="append"></display-outlets>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import regionApi from 'api/region';
  import commonApi from 'api/common'
  import DisplayOutlets from './DisplayOutlets.vue';
  export default {
    components:{
      DisplayOutlets
    },
    props:['inputs',  'regionIds'], // tags {name:tagName, id:key}
    data (){
      return {
        defaultProps: {
          children: 'children',
          label: ''
        },
        outlets:{show:false, data:[{name:""}], title:"显示门店",remark:''},
        regionTree: [],
        optionValue: [],
        loading:false
      };
    },
    computed:{
      ...mapGetters({
        selectCompanyInfo:'getSelectCompanyInfo',
      })
    },
    methods:{
      append(data) {
//        console.log("传入appen里面的数据为")
//        console.dir(data)
//        console.log("selectTags")
//        console.dir(this.inputs.selectTags)
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
              obj.label = data.label+"所有门店";
              obj.remark = data.key;
              break;
            case "CITY":
              obj.effectLevel = 3;
              obj.cityId = data.code;
              obj.label = data.label+"所有门店";
              obj.remark = data.key;
              break;
            case "COUNTY":
              obj.effectLevel = 4;
              obj.countyId = data.code;
              obj.label = data.label+"所有门店";
              obj.remark = data.key;
              break;
            case "OUTLETS":
              obj.effectLevel = 5;
              obj.label = data.label;
              obj.remark = data.key;
              obj.outletId=data.outletId
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
//          console.log("添加完成后数据为（Inputs）：")
//          console.log(JSON.stringify(this.inputs,null,4))
        }
      },
//       获取门店
      getOutlets(data){
        this.loading=true
//          console.log("获取门店需要传入的数据")
//          console.log(JSON.stringify(data,null,4))

        let params = {
          regionId: this.regionIds[0],
          companyCode: this.selectCompanyInfo.companyCode,
          cityCode: 0,
          countyCode:data.code || '',
        };
        commonApi.getListByFilterCode({params: params}).then((res)=>{
          this.loading=false
          this.outlets.title = data.label+'区/县包含门店如下,请选择';
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
//          console.log("renderContent数据")
//        console.log(node.data)
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
//      删除地区
      handleTagClose(tag) {
        this.inputs.tags.splice(this.inputs.tags.indexOf(tag), 1);
        this.inputs.selectTags.splice(this.inputs.selectTags.indexOf(tag.remark), 1);
      },
//      获得门店树
//      todo:分区多选时获得门店树合并
      getRegionTreeData: function (regionId) {
        this.loading=true
        let param = {params: {companyCode: this.selectCompanyInfo.companyCode, regionId: regionId }};
        regionApi.getRegionProvCity(param).then((res)=>{
            this.loading=false
            this.regionTree.push(...res.data);
//          this.regionTree= this.deep(res.data,this.regionTree)
//          console.log(JSON.stringify(this.regionTree,null,4))
        }).catch(()=>{
          this.loading=false
          this.regionTree = []
        })
      },
      deep(obj,target={}){    //赋默认值
      for(var i in obj){
      if(typeof obj[i] == "object"){
        target[i]=target[i]||{}   //里面如果还是数组或对象有初始值就初始值
        if(JSON.stringify(target[i])=="{}"||JSON.stringify(target[i])=="[]"){  //判断对象是否为空要用！
          target[i]=obj[i] instanceof Array? []:{}  //没有初始值的话就按类型设置空,否则数组会变为对象类型
        }
        this.deep(obj[i],target[i])
      }
      else target[i]=obj[i]
    }
    return target
  },
      handlebtn(){
          var arr=[obj]
          var obj= {
              id: {},
              code: "280000",
              label: "广东",
              level: "PROV",
              children: [
                {
                  id: {},
                  code: "281000",
                  label: "广州",
                  level: "CITY",
                  children: [
                    {
                      id: {},
                      code: "281013",
                      label: "中山",
                      level: "COUNTY",
                      children: {},
                      key: "PROV_广东_CITY_广州_COUNTY_天河"
                    },
                    {
                      id: {},
                      code: "281014",
                      label: "白云",
                      level: "COUNTY",
                      children: {},
                      key: "PROV_广东_CITY_广州_COUNTY_白云"
                    },
                    {
                      id: {},
                      code: "281015",
                      label: "黄埔",
                      level: "COUNTY",
                      children: {},
                      key: "PROV_广东_CITY_广州_COUNTY_黄埔"
                    }
                  ],
                  key: "PROV_广东_CITY_广州"
                }
              ],
              key: "PROV_广东",
            }
      }
    },
    watch:{
      regionIds(val){
          this.regionTree=[]
          if(val.indexOf('onlyone')!=-1){
            this.getRegionTreeData(this.regionIds[0])
          }
          else {
            this.regionIds.forEach((regionId)=>this.getRegionTreeData(regionId))
          }
      }
    },
  }
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
