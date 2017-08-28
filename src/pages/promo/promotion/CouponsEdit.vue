<template>
  <el-dialog :title="inputs.title" v-model="inputs.show"  @open="onOpen">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="优惠券名称:" prop="name">
        <el-input v-model="ruleForm.couponData.name"></el-input>
      </el-form-item>
      <el-form-item label="按钮文字:" prop="couponData.btnLabel">
        <el-input v-model="ruleForm.couponData.btnLabel"></el-input>
      </el-form-item>
      <el-form-item label="优惠券背景:">
        <color-picker v-model="ruleForm.couponData.color" :defaultColor="ruleForm.couponData.defaultColor"></color-picker>
      </el-form-item>

      <el-form-item label="满减码:" v-if="ruleForm.couponType == 1">
        <el-select v-model="ruleForm.couponData.cumulative" class="coupon-line">
          <el-option label="每满" value="1">每满</el-option>
          <el-option label="满" value="0">满</el-option>
        </el-select>
        <el-input v-model="ruleForm.couponData.amount" class="coupon-line"></el-input>
        <el-select v-model="ruleForm.couponData.amtType" class="coupon-line">
          <el-option label="元" value="1">元</el-option>
          <el-option label="件" value="2">件</el-option>
        </el-select>
        &nbsp;减&nbsp;<el-input v-model="ruleForm.couponData.discount" class="coupon-line"></el-input> 元
        <el-button type="text" @click="addCouponRule" v-if="ruleForm.couponData.cumulative == 0 && ruleForm.couponData.multRules.length < 5">继续添加</el-button>
        <div v-if="ruleForm.couponData.multRules" v-for="(list, index) in ruleForm.couponData.multRules">
          <el-select v-model="ruleForm.couponData.cumulative" class="coupon-line" disabled>
            <el-option label="每满" value="1">每满</el-option>
            <el-option label="满" value="0">满</el-option>
          </el-select>
          <el-input v-model="ruleForm.couponData.multRules[index].amount" class="coupon-line"></el-input>
          <el-select v-model="ruleForm.couponData.amtType" class="coupon-line" disabled>
            <el-option label="元" value="1">元</el-option>
            <el-option label="件" value="2">件</el-option>
          </el-select>
          &nbsp;减&nbsp;<el-input v-model="ruleForm.couponData.multRules[index].discount" class="coupon-line"></el-input> 元
          <el-button type="text" @click="removeCouponRule(index)">删除</el-button>
        </div>
      </el-form-item>

      <el-form-item label="满折码:" v-if="ruleForm.couponType == 2">
        <el-select v-model="ruleForm.couponData.cumulative" class="coupon-line">
          <el-option label="每满" value="1">每满</el-option>
          <el-option label="满" value="0">满</el-option>
        </el-select>
        <el-input v-model="ruleForm.couponData.amount" class="coupon-line" ></el-input>
        <el-select v-model="ruleForm.couponData.amtType" class="coupon-line">
          <el-option label="元" value="1">元</el-option>
          <el-option label="件" value="2">件</el-option>
        </el-select>
        &nbsp;打&nbsp;<el-input v-model="ruleForm.couponData.discount" class="coupon-line" @blur="checkDecimals"></el-input> 折
        <el-button type="text" @click="addCouponRule" v-if="ruleForm.couponData.cumulative == 0 && ruleForm.couponData.multRules.length < 5">继续添加</el-button>
        <div v-if="ruleForm.couponData.multRules" v-for="(list, index) in ruleForm.couponData.multRules">
          <el-select v-model="ruleForm.couponData.cumulative" class="coupon-line" disabled>
            <el-option label="每满" value="1">每满</el-option>
            <el-option label="满" value="0">满</el-option>
          </el-select>
          <el-input v-if="ruleForm.couponData.multRules[index]" v-model="ruleForm.couponData.multRules[index].amount" class="coupon-line" ></el-input>
          <el-select v-model="ruleForm.couponData.amtType" class="coupon-line" disabled>
            <el-option label="元" value="1">元</el-option>
            <el-option label="件" value="2">件</el-option>
          </el-select>
          &nbsp;打&nbsp;<el-input v-if="ruleForm.couponData.multRules[index]" v-model="ruleForm.couponData.multRules[index].discount" class="coupon-line"></el-input> 折
          <el-button type="text" @click="removeCouponRule(index)">删除</el-button>
        </div>
      </el-form-item>

      <el-form-item label="折扣码:"  v-if="ruleForm.couponType == 3">
        <el-input v-model="ruleForm.couponData.discount" class="coupon-line" @blur="checkDecimals"></el-input> &nbsp;折
      </el-form-item>

      <el-form-item label="抵用券:" v-if="ruleForm.couponType == 4">
        满<el-input v-model="ruleForm.couponData.amount" class="coupon-line"></el-input>
        <el-select v-model="ruleForm.couponData.amtType" class="coupon-line">
          <el-option label="元" value="1">元</el-option>
          <el-option label="件" value="2">件</el-option>
        </el-select>
        &nbsp;减&nbsp;<el-input v-model="ruleForm.couponData.discount" class="coupon-line"></el-input> 元
      </el-form-item>

      <el-form-item label="一口价:" v-if="ruleForm.couponType == 5">
        <el-input v-model="ruleForm.couponData.amount" class="coupon-line"></el-input>
        &nbsp;件&nbsp;<el-input v-model="ruleForm.couponData.discount" class="coupon-line"></el-input> 元
      </el-form-item>

      <el-form-item label="满赠(元):" v-if="ruleForm.couponType == 6">
        <el-select v-model="ruleForm.couponData.cumulative" class="coupon-line">
          <el-option label="每满" value="1">每满</el-option>
          <el-option label="满" value="0">满</el-option>
        </el-select>
        <el-input v-model="ruleForm.couponData.amount" class="coupon-line"></el-input>
        <el-select v-model="ruleForm.couponData.amtType" class="coupon-line">
          <el-option label="元" value="1">元</el-option>
          <el-option label="件" value="2">件</el-option>
        </el-select>
        &nbsp;赠&nbsp;<el-input v-model="ruleForm.couponData.discount" class="coupon-line"></el-input> 元
      </el-form-item>

      <el-form-item label="满赠(件):" v-if="ruleForm.couponType == 7">
        <el-select v-model="ruleForm.couponData.cumulative" class="coupon-line">
          <el-option label="每满" value="1">每满</el-option>
          <el-option label="满" value="0">满</el-option>
        </el-select>
        <el-input v-model="ruleForm.couponData.amount" class="coupon-line"></el-input>
        <el-select v-model="ruleForm.couponData.amtType" class="coupon-line">
          <el-option label="元" value="1">元</el-option>
          <el-option label="件" value="2">件</el-option>
        </el-select>
        &nbsp;赠&nbsp;<el-input v-model="ruleForm.couponData.discount" class="coupon-line"></el-input> 件
      </el-form-item>


      <el-form-item label="优惠券描述:">
        <el-input v-model="ruleForm.couponData.couponDesc"></el-input>
      </el-form-item>

      <el-form-item label="有效期:" prop="couponPeriodType">
        <el-select v-model="ruleForm.couponPeriodType" style="margin-bottom: 10px;">
          <el-option label="跟随活动" :value="1">跟随活动</el-option>
          <el-option label="自领劵起多少天内有效" :value="2">自领劵起多少天内有效</el-option>
          <el-option label="绝对时间" :value="3">绝对时间</el-option>
        </el-select>
        <el-col :span="24" v-if="ruleForm.couponPeriodType == 3 ">
          <el-col :span="12">
            <el-date-picker type="date" placeholder="选择开始日期" v-model.trim="ruleForm.couponBeginDate" format="yyyy-MM-dd" :editable="false" style="max-width: 140px"></el-date-picker>
          </el-col>
          <el-col :span="12">
            <el-date-picker type="date" placeholder="选择结束日期" v-model.trim="ruleForm.couponEndDate" format="yyyy-MM-dd" :editable="false" style="max-width: 140px"></el-date-picker>
          </el-col>
        </el-col>
        <el-col :span="24" v-else-if="ruleForm.couponPeriodType == 2 ">
          自领劵起&nbsp;<el-input v-model.trim="ruleForm.couponDays" class="coupon-line" type="number" min="1"></el-input>&nbsp;天内有效
        </el-col>
      </el-form-item>

      <el-form-item label="发行数量:" prop="couponQty">
        <el-input type="number" v-model.number="ruleForm.couponQty" style="max-width: 80px;"></el-input> &nbsp;张
      </el-form-item>
      <el-form-item label="优惠券规则:" prop="desc">
        <el-input type="textarea" v-model="ruleForm.couponData.desc" :rows="4"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button @click.native="inputs.show = false">取消</el-button>
        <el-button @click.native="submitForm('ruleForm')" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import ColorPicker from 'components/ColorPicker.vue'
  export default {
    components: {ColorPicker}, props: ['inputs'],
    data() {
      return {
        ruleForm: {
          couponQty: '', //发行数量
          couponPeriodType: '1', // 1-跟随活动；2-发券日起 n 天；3-固定期间
          couponBeginDate: '',  //有效开始时间
          couponEndDate: '', //有效结束时间
          couponDays: '', // 2-发券日起 n 天；
          couponType: '',
          couponData: {
            desc: '', // 描述
            name: '',   // 优惠券名称
            color: '',  // 优惠券颜色
            subType: '', // 1: 满减码  2:满折码  3:折扣码  4:抵用券  5:一口价,
            cumulative: '1', // 1:可累计（每满减多少） 0: 不可累积
            amtType: '1', //  1 金额  2: 件数
            amount: '', // 消费金额或件数  300元, 3件
            discount: '', // 0.8  8折   30 减30块钱  根据  subType 决定是打折还是减元
            btnLabel: '立即领券',
            multRules:[
//              { amount: '20', // 消费金额或件数  300元, 3件
//                discount: '1', // 0.8  8折   30 减30块钱  根据  subType 决定是打折还是减元
//              }
            ],
            couponDesc:''
          }
        },
        rules: {
          couponPeriodType:[{ type: 'number', required: true, message: '请选择有效期', trigger: 'change' }],
          couponQty:[{type: 'number', required: true, message: '请输入发行数量', trigger: 'blur' ,min:1}],

        }
      };
    },
    methods: {
      onOpen: function(){
        Object.assign(this.ruleForm, this.inputs.data);
        if (this.ruleForm.couponDays === undefined || this.ruleForm.couponDays === ''){
          this.ruleForm.couponDays = 1;
        }
      },
      submitForm(formName){
        let that = this;
        let emitable = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (that.ruleForm.couponData.color === ''){
              that.ruleForm.couponData.color = that.ruleForm.couponData.defaultColor;
            }
            that.inputs.show = false;
            if(that.ruleForm.couponType == '1'){
              if(that.ruleForm.couponData.multRules[0] !== undefined && (that.ruleForm.couponData.multRules[0].amount < that.ruleForm.couponData.amount || that.ruleForm.couponData.multRules[0].discount < that.ruleForm.couponData.discount)){
                emitable = false;
              }
              for(let i = 1; i< that.ruleForm.couponData.multRules.length ;i++){
                if(that.ruleForm.couponData.multRules[i].amount < that.ruleForm.couponData.multRules[i-1].amount || that.ruleForm.couponData.multRules[i].discount < that.ruleForm.couponData.multRules[i-1].discount){
                  emitable = false;
                }
              }
            }
            if(that.ruleForm.couponType == '2'){
              if(that.ruleForm.couponData.multRules[0] !== undefined && (that.ruleForm.couponData.multRules[0].amount < that.ruleForm.couponData.amount || that.ruleForm.couponData.multRules[0].discount > that.ruleForm.couponData.discount)){
                emitable = false;
              }
              for(let i = 1; i< that.ruleForm.couponData.multRules.length ;i++){
                if(that.ruleForm.couponData.multRules[i].amount < this.ruleForm.couponData.multRules[i-1].amount || that.ruleForm.couponData.multRules[i].discount > that.ruleForm.couponData.multRules[i-1].discount){
                  emitable = false;
                }
              }
            }
            if (that.ruleForm.couponPeriodType === 3 && that.ruleForm.couponBeginDate && that.ruleForm.couponEndDate) {
              if (that.ruleForm.couponBeginDate >= that.ruleForm.couponEndDate) {
                that.$notify.error({
                  title: '错误',
                  message: '绝对时间优惠券截止日期必须大于起始日期'
                });
                return false;
              }
            }
            if(emitable === true){
              that.$emit('editdone', that.ruleForm);
            } else {
              that.$notify.error({
                title: '错误',
                message: '金额/折扣过小'
              });
              return false;
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      addCouponRule(){
        this.ruleForm.couponData.multRules.push(
          {
            amount: '', // 消费金额或件数  300元, 3件
            discount: '', // 0.8  8折   30 减30块钱  根据  subType 决定是打折还是减元
          }
        )
      },
      removeCouponRule(index){
        this.ruleForm.couponData.multRules.splice(index,1);
      },
      checkDecimals(){
        let reg = /^0\.([0-9]){1,2}$/;
        let discount = this.ruleForm.couponData.discount;
        if (!reg.test(discount)) {
          this.$message.error(`折扣区域范围 0.00 - 0.99`);
          this.ruleForm.couponData.discount = '';
        }
      }
    }
  }
</script>

<style scoped>
  .coupon-line {
    display: inline-block; width: 80px;
  }
  .el-radio-button__inner {
    background-color: red;
  }
</style>
