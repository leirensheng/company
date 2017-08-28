<template>
  <div class="target-edit">
    <div class="rule">
      <div>人群规则</div>
      <div style="">
        <el-tag
          class="item-tag"
          v-for="tag in inputs.rules"
          :key="tag.tagId"
          type="gray"
          :closable="true"
          @close="removeTag(tag)"
        >
          <span v-text="tag.valueNames"></span>
        </el-tag>
      </div>
    </div>
    <div class="edit-rules">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-menu :default-active="activeMenu">
            <el-menu-item index="9900" @click="getTagsList('9900')">基本属性</el-menu-item>
            <el-menu-item index="100" @click="getTagsList('100')">人口属性</el-menu-item>
            <el-menu-item index="300" @click="getTagsList('300')">购物偏好</el-menu-item>
            <el-menu-item index="900" @click="getTagsList('900')">消费行为</el-menu-item>
            <el-menu-item index="list" @click="getTagsList('list')">高级标签</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="6" class="sub-menu" v-show="isShowSubMenu">
          <el-menu :default-active="activeSubMenu">
            <el-menu-item v-for="item in subMenu" :key="item.id.toString()" :index="item.id.toString()" @click="getTagValues(item)"><span v-text="item.tagName"></span></el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="12" v-show="isShowContent" class="tag-value-content">
          <div v-if="this.activeMenu === 'list'">
            <span class="span-title">标准人群</span>
            <el-checkbox-group v-model="inputs.checkTagValue">
              <el-checkbox :title="item.valueDesc" :label="item.id" :key="item.valueName" v-for="item in tagValues" @change="changeRules">
                <span v-text="item.valueName"></span>
              </el-checkbox>
            </el-checkbox-group>
            <span class="span-title">自定义人群</span>
            <el-checkbox-group v-model="inputs.checkTagValue">
              <el-checkbox :title="item.valueDesc" :label="item.id" :key="item.valueName" v-for="item in tagValues2" @change="changeRules"><span v-text="item.valueName"></span></el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-else>
            <el-checkbox-group v-model="inputs.checkTagValue">
              <el-checkbox :label="selfToString(item.valueId)" :key="item.valueName" v-for="item in tagValues" @change="changeRules"><span v-text="item.valueName"></span></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="float: right; margin:15px 0;">
      <el-button @click.native="cancelBtn">取消</el-button>
      <el-button @click.native="saveRules" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
  import tagApi from 'src/api/tag';
  import { mapGetters } from 'vuex';
  import _ from 'underscore';
  export default {
    props: ['inputs'],  // rules: 规则  ruleGroup: 规则分组  checkTagValue: 选中标签值
    computed:{
      ...mapGetters({
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    data () {
      return {
        // 编辑规则
        activeMenu: '',
        activeSubMenu: '',
        isShowSubMenu: false,
        isShowContent: false,
        subMenu: [], // {id: 102, tagName: 'Gender',tagDesc: '性别',leafType: 1,valueType: 1, valeDateType: undefined},
        tagValues: [], // {id:'1', tagId: '102', valueId:'1', valueDesc: '男', valueName: 'male'}
        tagValues2: []
      };
    },
    methods: {
      handleDataChecked: function (data, type = 'tag') {
        this.inputs.checkTagValue = [];
        if (type === 'tag'){
          this.inputs.rules.forEach(rule => {
            if (rule.type === 'tag') {
              data.forEach(item => {
                if (rule.tagId == item.tagId && rule.valueIds.indexOf(''+item.valueId) > -1){
                  this.inputs.checkTagValue.push(''+item.valueId);
                }
              })
            }
          })
        } else if (type === 'list') {
          this.inputs.rules.forEach(rule => {
            if (rule.type === 'list') {
              data.forEach(item => {
                if (rule.valueIds.indexOf(item.id)> -1){
                  this.inputs.checkTagValue.push(item.id);
                }
              })
            }
          })
        }
      },
      getTagsList: function (parentId) {
        this.activeMenu = parentId;
        if (parentId === 'list') {
          let companyCode = this.selectCompanyInfo.companyCode;
          tagApi.getListByCompanyCode({companyCode: companyCode}).then(res=>{
            if (res.data && res.data[0] && res.data[0].children){
              res.data[0].children.shift();
              this.tagValues =  res.data[0].children;
            }
            if (res.data && res.data[1] && res.data[1].children){
              this.tagValues2 = res.data[1].children
            }
            this.handleDataChecked(this.tagValues, 'list');
            this.handleDataChecked(this.tagValues2, 'list');
            this.isShowSubMenu = false;
            this.isShowContent = true;

          }).catch(e=>{console.log(e)});
        } else {
          tagApi.getTagsByParentTagId({parentTagId: parentId}).then(res=>{
            this.subMenu = res.data;
            this.isShowContent = false;
            this.isShowSubMenu = true;
          }).catch(e=>console.log(e));
        }
      },
      getTagValues: function (item) {
        let tagId = item.id;
        tagApi.getTagValuesByTagId({tagId: tagId}).then(res=>{
          this.tagValues = res.data;
          this.isShowContent = true;
          this.activeSubMenu = tagId.toString();
          this.handleDataChecked(this.tagValues);
        }).catch(e=> {console.log(e)});
      },
      getTagValueNameByTagId: function (tagId,ids) {
        let valueStr = [];
        if (this.activeMenu === 'list'){
          _.each(this.tagValues.concat(this.tagValues2), function (item) {
            if (ids.indexOf(item.id.toString()) > -1) {
              valueStr.push(item['valueName']);
            }
          });
          return valueStr.join(',')
        } else {
          _.each(this.tagValues.concat(this.tagValues2), function (item) {
            if (ids.indexOf('' + item.valueId) > -1) {
              valueStr.push(item['valueName']);
            }
          });
          return valueStr.join(',')
        }
      },
      changeRules: function (event) {
        let menuId = this.activeMenu;
        let subMenuId = this.activeSubMenu;
        let tagId = event.target.value;
        let tagSelected = event.target.checked;
        let tagObj = {tagId: tagId, tagName: '',valueIds: [], valueNames: '',type: 'tag'};
        if (menuId === 'list'){
          if (tagSelected){ // 高级标签选中
            tagObj.valueNames = this.getTagValueNameByTagId(tagId, [tagId]);
            tagObj.tagName = tagObj.valueNames;
            tagObj.type = 'list';
            tagObj.valueIds.push(tagId);
            this.inputs.rules.push(tagObj);
          } else { // 高级标签取消选中
            let tag = _.findWhere(this.inputs.rules, {'tagId': tagId});
            this.inputs.rules.splice(this.inputs.rules.indexOf(tag), 1);
          }
        }else{
          if (tagSelected) { // 一般标签选中
            let findObj =  _.findWhere(this.subMenu, {id: parseInt(subMenuId)});
            let tag = _.findWhere(this.inputs.rules, {'tagId': subMenuId});
            if (tag) { // 已存在
              let tagIndex = this.inputs.rules.indexOf(tag);
              tag.valueIds.push(tagId);
              tag.valueNames = `${findObj['tagDesc']}: ${this.getTagValueNameByTagId(subMenuId, tag.valueIds)}`;
              this.inputs.rules[tagIndex] = tag;
            } else { // 不存在
              tagObj.tagId = subMenuId;
              tagObj.valueNames = `${findObj['tagDesc']}: ${this.getTagValueNameByTagId(subMenuId, [tagId])}`;
              tagObj.tagName = findObj['tagDesc'] || '';
              tagObj.valueIds.push(tagId);
              // {tagId: subMenuId, tagName:'', value: [tagId], desc: this.getTagValueNameByTagId(subMenuId, [tagId]), type: 'tag'}
              this.inputs.rules.push(tagObj);
            }
          } else { // 一般标签取消选中
            let tag = _.findWhere(this.inputs.rules, {'tagId': subMenuId});
            let tagIndex = this.inputs.rules.indexOf(tag);
            tag.valueIds = _.difference(tag.valueIds, [tagId]);
            if (tag.valueIds.length > 0) {
              tag.valueNames = `${tag.tagName}: ${this.getTagValueNameByTagId(subMenuId, tag.valueIds)}`;
              this.inputs.rules[tagIndex] = tag;
            } else {
              this.inputs.rules.splice(tagIndex, 1);
            }
          }
        }
      },
      removeTag: function (tag) {
        let _checkTag = this.inputs.checkTagValue;
        this.inputs.checkTagValue = _.difference(_checkTag, tag.valueIds);
        this.inputs.rules.splice(this.inputs.rules.indexOf(tag), 1);
      },
      handleRulesToSave: function (rules) {
        let resp = [];
        rules.forEach(item=>{
          let obj = {ruleType: 'OTHER', ruleGroup: this.inputs.ruleGroup, tagId: item.tagId, tagName: item.tagName, operator: 'EQ', valueIds:'', valueNames: item.valueNames};
          if (item.type && item.type === 'list'){
            obj.tagId = 999999;
          } else {
            obj.tagId = item.tagId;
          }
          if (item.valueIds.length > 1){
            obj.operator = 'IN';
            obj.valueIds = item.valueIds.join(',');
          } else {
            obj.valueIds = item.valueIds.join(',')
          }
          resp.push(obj);
        });
        return resp;
      },
      saveRules: function () {
        let rulesCopy = JSON.parse(JSON.stringify(this.inputs.rules));
        let resp = this.handleRulesToSave(rulesCopy);
        if (resp.length > 0) {
          this.$emit('editdone', resp);
        } else {
          this.$message.warning('请最少选择一个标签保存！');
          return;
        }
      },
      cancelBtn: function () {
        this.inputs.rules.forEach(item=>{
          if (!item.id){
            this.inputs.checkTagValue = _.difference(this.inputs.checkTagValue, item.valueIds);
            this.inputs.rules.splice(item, 1);
          }
        });
        this.inputs.show=false;
      },
      selfToString(value) {
        return '' + value;
      }
    },
    mounted() {
    }
  };
</script>

<style lang="scss" scoped>
  .target-edit {
    width: 100%;
    height: auto;
    .rule {
      margin-bottom: 20px;
      padding: 10px 0;
      .item-tag {margin-top: 10px;}
      .item-tag:first-child {margin-left: 10px;}
      .item-tag + .item-tag {margin-left: 10px;}
    }
    .edit-rules:after {
      content: ''; display: block; clear: both;
    }
    .sub-menu {
      .el-menu {
        min-height: 280px;
        max-height: 280px;
        overflow-y: auto;
      }
      .el-menu-item {
        height: 30px;
        line-height: 30px;
      }
    }
    .tag-value-content {
      background-color: #eef1f6;
      min-height: 280px;
      padding: 15px;
      .span-title {display: inline-block; margin: 5px 0;}
      .el-checkbox:first-child{
        margin-left: 15px;
      }
    }
  }
</style>
