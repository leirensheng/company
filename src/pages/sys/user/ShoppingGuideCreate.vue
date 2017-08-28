<template>
  <!--新增界面-->
  <el-dialog :title="inputs.title" v-model="inputs.show" :close-on-click-modal="false" @open="onOpen" @close="reset">
    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="userName">
            <el-input v-model.trim="addForm.userName" placeholder="导购姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称：" prop="nickName">
            <el-input v-model="addForm.nickName" placeholder="导购昵称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型：" prop="userType">
            <el-select v-model="addForm.userType" placeholder="请选择类型" name="userType" @change="changeUserType">
              <el-option
                v-for="item in userGenreType"
                :key="item.Code"
                :label="item.DisplayName"
                :value="item.Code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工号：" prop="staffNo">
            <el-input v-model="addForm.staffNo" placeholder="所属公司工号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="大区：" prop="regionId">
            <el-select v-model="addForm.regionId" placeholder="请选择大区" name="region" @change="changeRegion">
              <el-option
                v-for="item in regionList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店：" prop="outletId">
            <el-select v-model="addForm.outletId" filterable clearable placeholder="请选择所属门店">
              <el-option
                v-for="item in outletsList"
                :key="item.id"
                :label="item.outletName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="手机：" prop="phone">
            <el-input v-model="addForm.phone" placeholder="手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="addForm.email" placeholder="导购邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="生日：" prop="birthDay">
            <el-date-picker type="date" placeholder="导购生日" v-model.trim="addForm.birthDay"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别：">
            <el-radio-group v-model="addForm.sex">
              <el-radio class="radio" :label="1" value="1">男</el-radio>
              <el-radio class="radio" :label="2" value="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="角色：" prop="checkList">
        <el-checkbox-group v-model="addForm.checkList">
          <el-checkbox v-for="role in roleList" key="" :label="role" name="add">{{role}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="地址：" prop="address">
        <el-input type="textarea" v-model="addForm.address"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="inputs.show = false">取消</el-button>
      <el-button type="primary" @click.native="submitAddForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import $lookup from 'supports/lookup';
  import $vx from 'supports/util/vx';
  import sysApi from '../../../api/sys';
  import regionApi from '../../../api/region';
  import commonApi from '../../../api/common';

  export default {
    props: ['inputs'],
    data () {
      return {
        addFormRules: {
          nickName: [
            {required: false, message: '请输入导购昵称', trigger: 'blur'},
            {
              pattern: /^([\u4e00-\u9fa5]{1,7})|([A-Za-z0-9 ]{1,14})$/,
              message: '用户昵称只能1-7个汉字或1-14英文字母',
              trigger: 'blur'
            }
          ],
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {
              pattern: /^([\u4e00-\u9fa5]{1,7})|([A-Za-z0-9 ]{1,14})$/,
              message: '用户昵称只能1-7个汉字或1-14英文字母',
              trigger: 'blur'
            }
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          email: [
            {required: false, message: '请输入邮箱地址', trigger: 'blur'},
            {pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱地址', trigger: 'blur'}
          ],
          userType: [
            {type: 'number', required: true, message: '请选择导购类型', trigger: 'change'}
          ],
          staffNo: [
            {required: true, message: '请输入工号', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          checkList: [
            {type: 'array', required: true, message: '请至少选择一种角色', trigger: 'change'}
          ],
          regionId: [
            {type: 'number', required: true, message: '请选择导购所属大区', trigger: 'change'}
          ],
          outletId: [
            {type: 'string', required: true, message: '请选择导购专属门店', trigger: 'change'}
          ],

        },
        //新增界面数据
        addForm: {
          companyCode: '',
          nickName: '',
          userName: '',
          status: 10,
          sex: 2,
          phone: '',
          email: '',
          birthDay: '',
          address: '',
          userType: '',
          staffNo: '',
          regionId: '',
          outletId: '',
          checkList: [],
        },
        userGenreType: [{Code: '', DisplayName: ''}],
        roleOrigin: [],
        roleList: [],
        showRegion: false,
        regionList: [{id: '', name: ''}],
        showOutlets: false,
        outletsList: [{id: '', outletName: ''}]

      }
    },
    computed: {
      ...mapGetters({
        companyType: 'getSelectCompanyType',
        selectCompanyInfo: 'getSelectCompanyInfo'
      })
    },
    methods: {
      onOpen: function () {
        this.getAllRole();
        this.userGenreType = [$lookup.UserGenreType.DG, $lookup.UserGenreType.DZ];
        this.addForm.companyCode = this.selectCompanyInfo.companyCode;
      },
//      表单重置
      reset(){
          this.$refs["addForm"].resetFields()
      },
      //获取所有角色
      getAllRole: function () {
        let param = {params: {roleType: this.companyType}};
        sysApi.getListRoleByType(param).then((res) => {
          if (res.data.length > 0) {
            this.roleOrigin = res.data;
            this.roleList = res.data.map(item => item['roleName']);
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      handleUserRoles: function (checkList) {
        let checkRoleList = [];
        for (let i = 0; i < checkList.length; i++) {
          let item = checkList[i];
          for (let j = 0; j < this.roleOrigin.length; j++) {
            let obj = this.roleOrigin[j];
            if (item == obj['roleName']) {
              checkRoleList.push(obj);
            }
          }
        }
        return checkRoleList;
      },
      getRegionList: function () {
        let param = {companyCode: this.selectCompanyInfo.companyCode, depth: 1};
        commonApi.getOrganizationStructure(param).then((res) => {
          if (res && res.data) {
            this.regionList = res.data;
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      getOutletsList: function (regionId) {
        let param = {regionId: regionId, companyCode: this.selectCompanyInfo.companyCode};
        regionApi.getListByRegionId(param).then((res) => {
          if (res.data) {
            this.outletsList = res.data;
          }
        }).catch((e) => {
          this.$message.error(e.message);
        })
      },
      changeUserType: function (v) {
        if (v) {
          this.getRegionList();
        }
      },
      changeRegion: function (v) {
        if (v) {
          this.getOutletsList(v);
          this.addForm.outletId = '';
        }
      },
      submitAddForm: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true;
            let para = Object.assign({}, this.addForm);
            para.birthDay = (!para.birthDay || para.birthDay == '') ? '' : $vx.date.format(new Date(para.birthDay), 'yyyy-MM-dd');
            para.roles = this.handleUserRoles(para.checkList);
            this.$emit('handleCreateGuide', para);
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-date-editor.el-input {
    width: 100%;
  }
</style>
