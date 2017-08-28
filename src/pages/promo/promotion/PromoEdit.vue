<template>
  <el-dialog :title="inputs.title" v-model="inputs.show" :close-on-click-modal="false" customClass="dialog-width75" @open="onOpen">
    <div class="promo-edit">
      <!-- 主题图片 -->
      <el-row :gutter="20" class="promo-edit-md">
        <p style="margin-left: 10px;">主题图片</p>
        <el-col :span="12" :offset="2">
          <el-upload
            ref="uploadPicture"
            name="file"
            :file-list="mainFileList"
            action="/crm/api/tp/campaigns/upload-campaign-main"
            :before-upload="beforeMainPictureUpload"
            :on-error="uploadPictureError"
            :on-success="uploadMainPictureSuccess"
            :on-remove="handleMainRemovePicture"
            :show-file-list="false"
            accept="image/jpeg, image/jpg, image/png">
            <el-button slot="trigger" size="small" type="primary">上传主题图片</el-button>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png图片，图片不超过50kb</div>
          </el-upload>
        </el-col>
        <el-col :span="10">
          <div class="review review-img">
            <img :src="campaignContent.bannerUrl" />
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="promo-edit-md">
        <p style="margin-left: 10px;">缩略图</p>
        <el-col :span="12" :offset="2">
          <el-upload
            ref="uploadPicture"
            name="file"
            :file-list="thumbnailList"
            action="/crm/api/tp/campaigns/upload-campaign-main"
            :before-upload="beforeThumbnailPictureUpload"
            :on-error="uploadPictureError"
            :on-success="uploadThumbnailPictureSuccess"
            :on-remove="handleThumbnailRemovePicture"
            :show-file-list="false"
            accept="image/jpeg, image/jpg, image/png">
            <el-button slot="trigger" size="small" type="primary">上传缩略图片</el-button>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png图片，图片不超过50kb</div>
          </el-upload>
        </el-col>
        <el-col :span="10">
          <div class="review review-img">
            <img :src="campaignContent.thumbnailUrl" />
          </div>
        </el-col>
      </el-row>

      <!-- 上传URL -->
      <el-row :gutter="20" class="promo-edit-md" v-show="this.tpClass === '5'">
        <p style="margin-left: 10px;">活动URL</p>
        <el-col :span="12" :offset="2">
          <el-input v-model="campaignContent.clickThroughUrl" placeholder="请输入活动URL"></el-input>
        </el-col>
      </el-row>

      <!-- 活动倒计时 -->
      <el-row :gutter="20" class="promo-edit-md" v-if="tplContent.hasCoutingDown">
        <el-col :span="12">
          <el-checkbox v-model="campaignContent.hasCoutingDown">活动倒计时</el-checkbox>
          <span style="display: inline-block;">
            <el-tooltip content="复选框不选中即使有数据微信端也不展示" placement="right">
              <i class="el-icon-information" style="color: #ccc; font-size: 18px;"></i>
            </el-tooltip>
          </span>
        </el-col>
        <el-col :span="12" v-show="campaignContent.hasCoutingDown">
          <div class="review">
            <count-down @time-end="message = '倒计时结束'" :endTime="viewEndTime"></count-down>
          </div>
        </el-col>
      </el-row>
      <!-- 活动优惠券 -->
      <el-row :gutter="20" class="promo-edit-md" v-if="tplContent.hasCoupon">
        <el-col :span="12">
          <el-checkbox v-model="campaignContent.hasCoupon">活动优惠券</el-checkbox>
          <span style="display: inline-block;">
            <el-tooltip content="复选框不选中即使有数据微信端也不展示" placement="right">
              <i class="el-icon-information" style="color: #ccc; font-size: 18px;"></i>
            </el-tooltip>
          </span>
        </el-col>
        <el-col :span="12" v-show="campaignContent.hasCoupon">
          <div class="review"></div>
        </el-col>
      </el-row>

      <!-- 品宣区 -->
      <el-row :gutter="20" class="promo-edit-md" v-if="tplContent.hasBrandArea">
        <el-col :span="24">
          <el-checkbox v-model="campaignContent.hasBrandArea">品宣区</el-checkbox>
          <span style="display: inline-block;">
            <el-tooltip content="复选框不选中即使有数据微信端也不展示" placement="right">
              <i class="el-icon-information" style="color: #ccc; font-size: 18px;"></i>
            </el-tooltip>
          </span>
        </el-col>
        <el-col :span="22" :offset="2" v-if="campaignContent.hasBrandArea">
          <el-input type="textarea" :rows="4" placeholder="请输入品宣区代码" v-model="campaignContent.brandAreaHtml" ></el-input>
        </el-col>
      </el-row>

      <!-- 主题副图 -->
      <el-row :gutter="20" class="promo-edit-md" v-if="tplContent.hasSubBanner">
        <p style="margin-left: 10px;">
          <el-checkbox v-model="campaignContent.hasSubBanner">主题副图</el-checkbox>
          <span style="display: inline-block;">
            <el-tooltip content="复选框不选中即使有数据微信端也不展示" placement="right">
              <i class="el-icon-information" style="color: #ccc; font-size: 18px;"></i>
            </el-tooltip>
          </span>
        </p>
        <el-col :span="12" :offset="2" v-show="campaignContent.hasSubBanner">
          <el-upload
            ref="uploadPicture"
            name="file"
            :file-list="subFileList"
            action="/crm/api/tp/campaigns/upload-campaign-sub"
            :before-upload="beforeSubPictureUpload"
            :on-error="uploadPictureError"
            :on-success="uploadSubPictureSuccess"
            :on-remove="handleSubRemovePicture"
            accept="image/jpeg, image/jpg, image/png"
            :show-file-list="false">
            <el-button slot="trigger" size="small" type="primary">上传主题副图</el-button>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png图片，图片不超过50kb</div>
          </el-upload>
        </el-col>
        <el-col :span="10" v-show="campaignContent.hasSubBanner">
          <div class="review review-img">
            <img :src="campaignContent.subBannerUrl"/>
          </div>
        </el-col>
      </el-row>

      <!-- 商品 -->
      <el-row :gutter="20" class="promo-edit-md" v-if="tplContent.hasItemArea">
        <el-col :span="24">
          <el-checkbox v-model="campaignContent.hasItemArea">活动商品</el-checkbox>
          <span style="display: inline-block;">
            <el-tooltip content="复选框不选中即使有数据微信端也不展示" placement="right">
              <i class="el-icon-information" style="color: #ccc; font-size: 18px;"></i>
            </el-tooltip>
          </span>
        </el-col>
        <el-col :span="22" :offset="2" style="margin-top: 10px;" v-show="campaignContent.hasItemArea">
          <el-radio class="radio" v-model="campaignContent.itemAreaStyle" :label="2">商品并排排列</el-radio>
          <el-radio class="radio" v-model="campaignContent.itemAreaStyle" :label="1">商品错开并排排列</el-radio>
          <el-radio class="radio" v-model="campaignContent.itemAreaStyle" :label="3" v-show="false">商品三列排列</el-radio>
        </el-col>
        <el-col :span="22" :offset="2" style="margin-top: 10px;" v-show="campaignContent.hasItemArea">
            <el-upload
              ref="upload"
              name="file"
              :data="this.uploadData"
              action="/crm/api/tp/campaign-item/resolve-excel"
              :on-remove="handleRemoveFile"
              :before-upload="beforeUploadFile"
              :on-success="uploadExcelSuccess"
              :on-error="uploadExcelError"
              :show-file-list="false"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              >
              <el-button size="small" type="primary">上传商品文件</el-button>
              <a href="../../../../static/items.xlsx">下载标准模板</a>
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过200kb</div>
            </el-upload>
        </el-col>
        <el-col :span="22" :offset="2" class="data-errcor" v-show="campaignContent.hasItemArea && notFundItem.length > 0">
          <p v-html="notFundItem"></p>
        </el-col>
        <el-col :span="22" :offset="2" style="margin-top: 10px;" v-show="campaignContent.hasItemArea && campaignContent.tpCampaignItems.length > 0">
          <el-table
            :data="campaignContent.tpCampaignItems"
            border
            style="width: 100%"
            max-height="200"
            >
            <el-table-column
              prop="itemCode"
              label="商品代码"
              width="150">
            </el-table-column>
            <el-table-column
              prop="itemName"
              label="商品描述"
              width="200">
            </el-table-column>
            <el-table-column
              prop="promotionPrice"
              label="活动价"
              width="100">
            </el-table-column>
            <el-table-column
              prop="itemGroup1"
              label="商品分类"
              width="80">
            </el-table-column>
            <el-table-column
              prop="cornerHtml"
              label="角标代码"
              width="120">
            </el-table-column>
            <el-table-column
              label="操作"
              width="80">
              <template scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, campaignContent.tpCampaignItems)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div class="promo-btn">
      <el-button @click="inputs.show = false">取消</el-button>
      <el-button type="primary" @click="saveBtn">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import CountDown from 'components/CountDown/CountDown.vue';
  import campaignApi from 'src/api/campaign';
  import { mapGetters } from 'vuex';
  export default {
    props:['inputs'],
    components: {CountDown},
    data () {
      return {
        uploadData: {
          companyCode: null,
        },
        currentBannerName: '',
        mainFileList: [],
        subFileList:[],
        thumbnailList: [],
        tpClass: '',
        tplContent: {
          hasCoutingDown: true,
          hasCoupon: true,
          hasBrandArea: true,
          hasSubBanner: true,
          hasItemArea: true,
        },
        campaignContent:{
          bannerUrl: '',
          thumbnailUrl: '',
          hasCoutingDown: false,
          hasCoupon: false,
          hasBrandArea: false,
          brandAreaHtml: '',
          hasSubBanner: false,
          subBannerUrl: '',
          hasItemArea: false,
          itemAreaStyle: 1,  // 1 2 3
          clickThroughUrl: '',
          tpCampaignItems: []
        },
        viewEndTime: new Date().getTime() + 2 * 24 * 3600 * 1000,
        notFundItem: '',
      }
    },
    computed:{
      ...mapGetters({
        userInfo: 'getUserInfo',
        selectCompanyInfo:'getSelectCompanyInfo'
      })
    },
    methods: {
      onOpen: function () {
        Object.assign(this.tplContent, this.inputs.data.tplContent);
        Object.assign(this.campaignContent, this.inputs.data.tpCampaignContents);
        this.tpClass = this.inputs.data.tpClass;
        this.notFundItem = '';
      },
      beforeMainPictureUpload: function (file) {
        const isJPG = ['image/jpeg','image/jpg','image/png'];
        const isLt50KB = file.size /1024 < 50;
        if (isJPG.indexOf(file.type) < 0) {
          this.$message.error('上传图片格式只能是 JPG,PNG 格式!');
          return false;
        }
        if (!isLt50KB) {
          this.$message.error('上传图片大小不能超过 50KB');
          return false;
        }

//        if (this.campaignContent.bannerUrl.length > 0) {
//          this.$message.error('主题图片 只能上传一张图片');
//          return false;
//        }

        return isJPG && isLt50KB;
      },
      uploadMainPictureSuccess(res,file,fileList){
        if (!res.errcode){
          this.$message.success('主题图图片上传成功');
          this.campaignContent.bannerUrl = res.data;
        }else{
          this.$message.error(res.message);
        }
      },
      handleMainRemovePicture: function () {
        if (file) {
          this.campaignContent.bannerUrl = '';
          this.mainFileList = [];
        }
      },
      beforeThumbnailPictureUpload: function (file) {
        const isJPG = ['image/jpeg','image/jpg','image/png'];
        const isLt50KB = file.size /1024 < 50;
        if (isJPG.indexOf(file.type) < 0) {
          this.$message.error('上传图片格式只能是 JPG,PNG 格式!');
          return false;
        }
        if (!isLt50KB) {
          this.$message.error('上传图片大小不能超过 50KB');
          return false;
        }
        return isJPG && isLt50KB;
      },
      uploadThumbnailPictureSuccess(res,file,fileList){
        if (!res.errcode){
          this.$message.success('缩略图图片上传成功');
          this.campaignContent.thumbnailUrl = res.data;
        }else{
          this.$message.error(res.message);
        }
      },
      handleThumbnailRemovePicture: function () {
        if (file) {
          this.campaignContent.thumbnailUrl = '';
          this.thumbnailList = [];
        }
      },
      beforeSubPictureUpload: function (file) {
        const isJPG = ['image/jpeg','image/jpg','image/png'];
        const isLt50KB = file.size /1024 < 50;
        if (isJPG.indexOf(file.type) < 0) {
          this.$message.error('上传图片格式只能是 JPG,PNG 格式!');
          return false;
        }
        if (!isLt50KB) {
          this.$message.error('上传图片大小不能超过 50KB');
          return false;
        }

        return isJPG && isLt50KB;
      },
      uploadSubPictureSuccess(res,file,fileList){
        if (!res.errcode){
          this.$message.success('主题副图图片上传成功');
          this.campaignContent.subBannerUrl = res.data;
        }else{
          this.$message.error(res.message);
        }
      },
      handleSubRemovePicture: function (file) {
        if (file) {
          this.campaignContent.subBannerUrl = '';
          this.subFileList = [];
        }
      },
      uploadPictureError(error){
        this.$message.error(error.message || '图片上传接口异常');
      },

      beforeUploadFile(file){
        let isEXCEL = ['application/x-excel','application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/excel','application/x-msexcel'];
        let isLt200 = file.size / 1024  < 200;
        if (isEXCEL.indexOf(file.type) < 0) {
          this.$message.error('上传文件只能是Excel格式!');
          return false;
        }
        if (!isLt200) {
          this.$message.error('上传文件大小不能超过 200KB!');
          return false;
        }
        return isEXCEL && isLt200;
      },
      uploadExcelError (error) {
        this.$message.error(error.message || '商品上传文件解析接口异常');
      },
      uploadExcelSuccess(res,file,fileList) {
        this.campaignContent.tpCampaignItems = res.data.succ;
        if (res.data.notExists && res.data.notExists.length > 0){
            this.notFundItem = res.data.notExists.join(',') + '商品不存，请核对！<br/>';
        }
        if (res.data.failed && res.data.failed.length > 0){
          this.notFundItem += res.data.failed.join(',') + '商品数据不对，请核对！';
        }
      },
      handleRemoveFile(file, fileList) {
        this.campaignContent.tpCampaignItems = [];
      },
      saveBtn: function () {
        this.$emit('editdone', this.campaignContent);
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    },
    mounted() {
      this.uploadData.companyCode = this.selectCompanyInfo.companyCode;
    }
  };
</script>

<style lang="scss">
  .promo-edit {
    width: 100%;
    max-height: 400px;
    overflow-y: scroll;
    .promo-edit-md {
      margin-bottom: 20px;
      width: 100%;
      .review {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        & > img {
          width: auto;
        }
      }
    }
    .review-img > img {
      width: 100px;
      height: 50px;
    }
  }
  .promo-btn {
    text-align: right;
  }

  .dialog-width75 {
    width: 75%  !important;
  }

  .data-errcor {
    color: #FF4949;
  }


</style>
