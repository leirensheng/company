<template>
  <el-dialog title="门店编辑" v-model="inputs.show" :close-on-click-modal="false" @open="onOpen">
    <el-form :model="dialogForm" label-width="100px" :rules="dialogFormRules" ref="editFormDialog">
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店名称：" prop="outletName">
            <el-input v-model.trim="dialogForm.outletName" placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店编码：" prop="outletCode">
            <el-input v-model.trim="dialogForm.outletCode" @blur="checkOutletCode" placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在分区：" prop="regionId">
            <el-select v-model="dialogForm.regionId" placeholder="请选择">
              <el-option v-for="item in regionList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二级分区：" prop="areaName">
            <el-input v-model.trim="dialogForm.areaName" placeholder="请填写">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店类型：" prop="outletType">
            <el-select v-model="dialogForm.outletType" placeholder="请选择">
              <el-option v-for="item in changeOutletTypeList"
                         :key="item.codeValue"
                         :label="item.codeValueDesc"
                         :value="item.codeValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店等级：" prop="outletGrade">
            <el-select v-model="dialogForm.outletGrade" placeholder="请选择">
              <el-option v-for="item in changeOutletGradeList"
                         :key="item.codeValue"
                         :label="item.codeValueDesc"
                         :value="item.codeValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店电话：" prop="telephone">
            <el-input v-model.trim="dialogForm.telephone" placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店面积：" prop="square">
            <el-input v-model.trim="dialogForm.square" placeholder="请填写">
              <template slot="append">㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开店日期：" required>
            <el-date-picker
              v-model="dialogForm.openDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店状态：" prop="status">
            <el-select v-model="dialogForm.status" placeholder="请选择">
              <el-option v-for="item in statusList"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="show-title">门店地址：</div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在省：" prop="provId">
            <el-select v-model="dialogForm.provId" @change="getCity" filterable clearable placeholder="请选择所在省">
              <el-option
              v-for="item in provincesList"
              :key="item.provCode"
              :label="item.provName"
              :value="item.provCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在市：" prop="cityId">
            <el-select v-model="dialogForm.cityId" @change="getCounty" filterable clearable placeholder="请选择所在市">
              <el-option
              v-for="item in cityList"
              :key="item.cityCode"
              :label="item.cityName"
              :value="item.cityCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在区/县：">
            <el-select v-model="dialogForm.countyId" filterable clearable placeholder="请选择所在区/县">
              <el-option
              v-for="item in countyList"
              :key="item.cityCode"
              :label="item.cityName"
              :value="item.cityCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细地址：" prop="addressLine">
        <el-input type="textarea" v-model="dialogForm.addressLine"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>


<script>
  import StoresApi from '../../../api/stores';
  export default {
    props: ['inputs'],
    data () {
      return {
        isHasOutletCode: false,
        dialogForm: {
          addressLine : '',
          areaName : '',
          id: '',
          companyCode: '',
          provId: '',
          cityId: '',
          countyId: '',
          outletCode: '',
          outletGrade: '',
          outletName: '',
          outletType: '',
          regionId: '',
          openDate: '',
          square: '',
          status: '',
          telephone: '',
        },
        dialogFormRules: {
          outletName: [
            {type: 'string', required: true, message: '请填写门店名称', trigger: 'blur'}
          ],
          outletCode: [
            {type: 'string', required: true, message: '请填写门店编码', trigger: 'blur'}
          ],
          regionId: [
            {type: 'number', required: true, message: '请选择所属大区', trigger: 'change'}
          ],
          areaName: [
            {type: 'string', required: true, message: '请填写二级分区', trigger: 'blur'}
          ],
          outletType: [
            {type: 'string', required: true, message: '请选择门店类型', trigger: 'change'}
          ],
          outletGrade: [
            {type: 'string', required: true, message: '请选择门店等级', trigger: 'change'}
          ],
          telephone: [
            {type: 'string', required: true, message: '请输入手机号码', trigger: 'blur'},
            // {pattern: /^((d{3,4})|d{3,4}-)?d{7,8}$/, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          square: [
            {type: 'string', required: true, message: '请填写门店面积', trigger: 'blur'}
          ],
          status: [
            {type: 'number', required: true, message: '请选择门店状态', trigger: 'change'}
          ],
          provId: [
            {type: 'string', required: true, message: '请选择门店所在省', trigger: 'change'}
          ],
          cityId: [
            {type: 'string', required: true, message: '请选择门店所在市', trigger: 'change'}
          ],
          addressLine: [
            {type: 'string', required: true, message: '请填写门店地址', trigger: 'blur'}
          ]
        },
        regionList: [],
        changeOutletTypeList: [],
        changeOutletGradeList: [],
        provincesList: [],
        cityList: [],
        countyList: [],
        statusList: [
          {
            value: 10,
            name: '计划开店'
          },
          {
            value: 20,
            name: '装修中'
          },
          {
            value: 40,
            name: '正常营业'
          },
          {
            value: 60,
            name: '计划关店'
          },
          {
            value: 90,
            name: '已关店'
          },
        ]
      }
    },
    computed: {

    },
    methods: {
      onOpen() {
        Object.assign(this.dialogForm, this.inputs.data);
        this.getProvinces();
        if(this.dialogForm.provId) {
          this.getCity();
        }
        if(this.dialogForm.cityId) {
          this.getCounty();
        }
        this.dialogForm.companyCode = this.inputs.companyCode;
        this.regionList = this.inputs.regionList;
        this.changeOutletTypeList = this.inputs.changeOutletTypeList
        this.changeOutletGradeList = this.inputs.changeOutletGradeList
      },
      getProvinces() {
        StoresApi.getProvinces().then((res) => {
          this.provincesList = res.data;
        }).catch((e)=>{
          console.log(e);
        })
      },
      getCity() {
        let that = this;
        StoresApi.getCity(that.dialogForm.provId).then((res) => {
          this.cityList = res.data;
        }).catch((e)=>{
          console.log(e);
        })
      },
      getCounty() {
        let that = this;
        StoresApi.getCounty(that.dialogForm.cityId).then((res) => {
          this.countyList = res.data;
        }).catch((e)=>{
          console.log(e);
        })
      },
      checkOutletCode() {
        let that = this;
        StoresApi.checkOutletCode(that.dialogForm.companyCode, that.dialogForm.outletCode).then((res) => {
          that.isHasOutletCode = res.data;
          if(res.data) {
            this.$notify({
              title: '失败',
              message: '门店编码重复',
              type: 'error'
            });
          }
        }).catch((e)=>{
          console.log(e);
        })
      },
      deleteMinutes(time){
        if(typeof time === 'object'){
          let changeTime = time.setMinutes(0,0);
          return changeTime;
        } else {
          return time;
        }
      },
      submit() {
        if(this.isHasOutletCode) {
          return false;
        }
        this.dialogForm.openDate = this.deleteMinutes(this.dialogForm.openDate);
        this.$refs['editFormDialog'].validate((valid) => {
          if (valid) {
            this.$emit('handleUserDialog',{status: 1, data:this.dialogForm, message: '修改成功'});
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-date-editor.el-input {
    width: 100%;
  }
  .show-title{
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    border-top: 1px solid #bfcbd9;
    margin-bottom: 20px;
  }
</style>
