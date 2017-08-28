<template>
    <section>
      <!--筛选和上传部分-->
      <el-row class="row" v-loading="listLoading">
        <el-col :span="11">
        <span>按导入时间筛选：</span>
        <el-date-picker v-model="filter.startDate" type="date" placeholder="选择起始日期"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="filter.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-input v-model="filter.fuzzItemName" placeholder="输入商品名关键词查找"></el-input>
        </el-col>
        <el-col :span="2" style="margin-left: 5px;">
          <el-button type="primary" @click="getItemList({pageSize:pageSize,currentPage:1},uploadData.companyCode)">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-upload :show-file-list="false" action="/crm/api/sp/items/uploadItemsImg" :on-success="uploadItemsPic" multiple ref="picUpload">
            <el-button type="text">上传商品图片</el-button>
          </el-upload>
        </el-col>
        <el-col :span="2">
          <el-upload action="/crm/api/sp/items/import-items-by-excel" :show-file-list="false" :data="uploadData" :on-success="uploadExcel">
            <el-button type="text">上传商品</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <!--item图表-->
      <el-row class="row">
        <template>
          <el-table
            ref="multipleTable"
            :data="itemList"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="商品编号"
              min-width="100">
              <template scope="scope">{{ scope.row.itemCode }}</template>
            </el-table-column>
            <el-table-column
              label="商品标题"
              min-width="180">
              <template scope="scope">{{ scope.row.itemName }}</template>
            </el-table-column>
            <el-table-column
              label="类别"
              min-width="70">
              <template scope="scope">{{ scope.row.itemGroup }}</template>
            </el-table-column>
            <el-table-column
              prop="brandValue"
              label="供应商品牌"
              min-width="80">
            </el-table-column>
            <el-table-column
              prop="listPrice"
              label="吊牌价"
              width="80">
            </el-table-column>
            <el-table-column
              prop="discountPrice"
              label="现价"
              width="80">
            </el-table-column>
            <el-table-column
              prop="regionNames"
              label="所属分区"
              width="100">
            </el-table-column>
            <el-table-column
              label="状态"
              prop="displayStatus"
              min-width="60">
            </el-table-column>
            <el-table-column
              prop="displayCreatedTime"
              label="添加时间"
              min-width="120">
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="110">
              <template scope="scope">
                <el-button type="text" @click="editItem(scope.row.id)">编辑</el-button>
                <el-button type="text" @click="updateOffSale(scope.row.id)" v-if="scope.row.status === 10">设为停售</el-button>
                <el-button type="text" @click="updateSale(scope.row.id)" v-if="scope.row.status === 90">设为在售</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button @click="open(1,multipleSelection)">设为停售</el-button>
            <el-button @click="open(2,multipleSelection)">设为在售</el-button>
            <span class="editType">修改类别：</span>
            <el-select v-model="selectedOptions" placeholder="请选择">
              <el-option v-for="item in itemType" :key="item.value" :label="item.name" :value="item.value" @click.native="open(3,item.name)"></el-option>
            </el-select>
          </div>
          <Pagination :currentPage=this.currentPage :total=this.total :pageSizes=this.pageSizes  v-on:handleSizeChange="handleSizeChange" v-on:handleCurrentChange="handleCurrentChange" ></Pagination>
        </template>
      </el-row>
      <!--上传商品弹出框-->
      <template>
        <el-dialog
          title="上传结果"
          :visible.sync="excelUploadVisible"
          size="large">
          <el-table
            :data="uploadExcelResult"
            style="width: 100%"
            height="400">
            <el-table-column
              label="status"
              width="100">
              <template scope="scope">
                <span style="color:#ff4949" v-if="scope.row.status == 2">{{statusFilter(scope.row.status)}}</span>
                <span v-if="scope.row.status == 1">{{statusFilter(scope.row.status)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="itemCode"
              label="item_code"
              width="130">
            </el-table-column>
            <el-table-column
              prop="itemName"
              label="item_name">
            </el-table-column>
            <el-table-column
              prop="itemDesc"
              label="item_desc">
            </el-table-column>
            <el-table-column
              prop="regionNames"
              label="region_names">
            </el-table-column>
            <el-table-column
              prop="itemAttr"
              label="item_attr">
            </el-table-column>
            <el-table-column
              prop="itemBarcode"
              label="item_barcode">
            </el-table-column>
            <el-table-column
              prop="listPrice"
              label="list_price">
            </el-table-column>
            <el-table-column
              prop="discountPrice"
              label="discount_price">
            </el-table-column>
            <el-table-column
              prop="itemGroup1"
              label="item_group1">
            </el-table-column>
            <el-table-column
              prop="itemType"
              label="item_type">
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
    <el-button @click="excelUploadVisible = false">取 消</el-button>
    <el-button type="primary" @click="insertOrUpdateItem(true)" :disabled="addItemsBtnStatus">只导入新增</el-button>
    <el-button type="primary" @click="insertOrUpdateItem(false)" :disabled="addAllItemsBtnStatus">全部导入</el-button>
  </span>
        </el-dialog>
      </template>
      <!--上传图片弹出框-->
      <template>
        <el-dialog
          title="上传结果"
          :visible.sync="picUploadVisible"
          size="large">
          <el-table
            :data="uploadPicsResult"
            style="width: 100%"
            height="400">
            <el-table-column
              label="status">
              <template scope="scope">
                <span v-if="scope.row.status == 1">{{statusFilter(scope.row.status)}}</span>
                <span v-if="scope.row.status == 3" style="color: #f7ba2a">{{statusFilter(scope.row.status)}}</span>
                <span v-if="scope.row.status == 2" style="color: #ff4949">{{statusFilter(scope.row.status)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="picName"
              label="picName">
            </el-table-column>
            <el-table-column
              prop="itemDesc"
              label="item_desc">
            </el-table-column>
            <el-table-column label="图片">
              <template scope="scope">
                  <img @click="showPic(scope.row.picUrl)" :src="scope.row.picUrl" width="30" height="30">
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
    <el-button @click="picUploadVisible = false">取 消</el-button>
    <el-button type="primary" @click="uploadPics(true)" :disabled="addPicsBtnStatus">只导入新增</el-button>
    <el-button type="primary" @click="uploadPics(false)" :disabled="addAllPicsBtnStatus">全部导入</el-button>
  </span>
        </el-dialog>
      </template>
    </section>
</template>

<script>
    import spApi from '../../api/sp';
    import Pagination from '../../components/Pagination.vue';
    import { mapGetters, mapActions } from 'vuex'

    export default {
        data() {
            return {
              filter:{
                  startDate:'',
                  endDate:'',
                  fuzzItemName:'',
                  asc: false,
                  orderByField: 'id'
              },
              listLoading:false,
              multipleSelection: [],
              editTypeValue:'',
              itemList:[],
              total: 0,
              currentPage: 1,
              pageSize: 10,
              pageSizes:[10,20,50,100],
              selectedOptions:'',
              options:[],
              itemType:[
                {name:'上装',value:'1'},
                {name:'下装',value:'2'},
                {name:'套装',value:'3'}
              ],
              uploadData:{
                  companyCode:''
              },
              excelUploadVisible:false,
              picUploadVisible:false,
              uploadExcelResult:[],
              uploadPicsResult:[],
              addItemsBtnStatus:false,
              addAllItemsBtnStatus:false,
              addPicsBtnStatus:false,
              addAllPicsBtnStatus:false
            }
        },
        methods: {
          open(type,data) {
            let name=''
            switch (type){
              case 1: name="为停售状态";break
              case 2: name="为在售状态";break
              case 3: name="类别";break
            }
            this.$confirm(`确定修改所选项${name}?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                switch (type){
                  case 1: this.groupUpdateOffSale(data);break
                  case 2: this.groupUpdateSale(data);break
                  case 3: this.updateItemGroupBatch(data);break
                }
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          },

//          把选中的数据传入
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },
//          获取当前商品列表
          getItemList(pager,companyCode){
            spApi.getItemList(this.filter,pager,companyCode).then(rst=>{
              this.itemList = rst.data.records;
              this.total = rst.data.total;
          })
        },
//          页码大小变更执行函数
          handleSizeChange (pageSize){
            this.pageSize = pageSize;
            this.getItemList({pageSize:pageSize, currentPage:this.currentPage},this.uploadData.companyCode);
          },
//          分页跳转
          handleCurrentChange (currentPage){
            this.currentPage = currentPage;
            this.getItemList({currentPage:currentPage,pageSize:this.pageSize},this.uploadData.companyCode);
          },
//          编辑商品
          editItem(id){
              this.$router.push({path:'/sp/items/detail?id='+id})
          },
//          更新为在售状态
          updateSale(id){
            spApi.updateForSaleBatch(id).then(()=>{
              this.getItemList({currentPage:this.currentPage,pageSize:this.pageSize},this.uploadData.companyCode);
            }).then(()=>{
              this.$notify({
                title: '成功',
                message: '更新成功',
                duration: 1000,
                type: 'success'
              });
            }).catch(err=>{
              this.$notify.error({
                title: '失败',
                message: '更新失败',
                duration: 1000
              });
            })
          },
//          更新为停售状态
          updateOffSale(id){
            spApi.updateOffSaleBatch(id).then(()=>{
              this.getItemList({currentPage:this.currentPage,pageSize:this.pageSize},this.uploadData.companyCode);
            }).then(()=> {
              this.$notify({
                title: '成功',
                message: '更新成功',
                duration: 1000,
                type: 'success'
              })
            }).catch(err=>{
                this.$notify.error({
                  title: '失败',
                  message: '更新失败',
                  duration: 1000
                })
              })
          },
//          更新所有选中的为在售
          groupUpdateSale(arr){
              let returnObj = [];
              for(let i = 0;i < arr.length ; i++){
                  returnObj.push(arr[i].id);
              }
              this.updateSale(returnObj);
          },
//          更新所有选中的为停售
          groupUpdateOffSale(arr){
              let returnObj = [];
              for(let i = 0;i < arr.length ; i++){
                returnObj.push(arr[i].id);
              }
              this.updateOffSale(returnObj);
          },
//          更新所中的所有商品的类别
          updateItemGroupBatch(itemGroup){
            let returnObj = [];
            for(let i = 0;i < this.multipleSelection.length ; i++){
              returnObj.push(this.multipleSelection[i].id);
            }
            spApi.updateItemGroupBatch(returnObj,itemGroup).then(rst=>{
              this.getItemList({currentPage:this.currentPage,pageSize:this.pageSize},this.uploadData.companyCode);
              this.$notify({
                title: '成功',
                message: '更新成功',
                duration: 1000,
                type: 'success'
              });
            }).catch(err=>{
              this.$notify.error({
                title: '失败',
                message: '更新失败',
                duration: 1000
              });
            })
          },
//          上传商品
          uploadExcel(res,file,fileList){
              if(res.errcode === 1){
                this.$notify.error({
                  title: '失败',
                  message: res.message,
                  duration: 1000
                });
              } else {
                this.uploadExcelResult = res.data.list;
                this.excelUploadVisible = true;
              }
          },
//          格式化上传商品或者图片的状态
          statusFilter(status){
              let statusStr;
              switch (status) {
                case 1:
                    statusStr = '新增';
                    break;
                case 2:
                    statusStr = '重复';
                    break;
                case 3:
                    statusStr = '未找到';
                    break;
              }
              return statusStr;
          },
//          点击导入商品处理
          insertOrUpdateItem(signal){
            let list = [];
            if(signal === true){
                this.addItemsBtnStatus=true
              for(let i = 0;i<this.uploadExcelResult.length;i++){
                  if(this.uploadExcelResult[i].status === 1){
                      list.push(this.uploadExcelResult[i]);
                  }
              }
            } else {
              this.addAllItemsBtnStatus=true
              list = this.uploadExcelResult;
            }
            let that = this;
            if(list.length === 0){
              this.$notify.error({
                title: '失败',
                message: '无新增商品',
                duration: 1000
              });
              this.addItemsBtnStatus=false
              that.excelUploadVisible = false
              return false;
            }
            spApi.insertOrUpdateItem(list,signal).then(rst=>{
              this.getItemList({pageSize:this.pageSize,currentPage:this.currentPage},this.uploadData.companyCode)
              this.$notify({
                title: '成功',
                message: '上传成功',
                duration: 1000,
                type: 'success'
              });
              that.excelUploadVisible = false
              that.addItemsBtnStatus=that.addAllItemsBtnStatus=false
            }).catch(err=>{
              this.$notify.error({
                title: '失败',
                message: '上传失败',
                duration: 1000
              });
            });
          },
//          点击上传图片处理
          uploadItemsPic(res,file,fileList){
              this.listLoading=true
              let picList = [];
              for(let i = 0;i<fileList.length;i++){
                if(fileList[i].response !== undefined){
                  picList.push({
                    picName:fileList[i].name.replace(/.png/,''),
                    picUrl:fileList[i].response.data.url
                  });
                }
              }
              if(picList.length === fileList.length){
                  this.listLoading=false
                  var data={}
                  data.pics=picList
                  data.companyCode=this.uploadData.companyCode
                  spApi.listUploadPics(data).then(rst=>{
                      this.uploadPicsResult = rst.data.list;
                      this.picUploadVisible = true;
                      this.$refs['picUpload'].clearFiles();
                  }).catch(err=>{
                      console.log(err);
                  })
              }
          },
//          点击导入图片处理
          uploadPics(signal){
            let list = [];
            if(signal === true){
              this.addPicsBtnStatus=true
              for(let i = 0;i<this.uploadPicsResult.length;i++){
                if(this.uploadPicsResult[i].status === 1){
                  list.push(this.uploadPicsResult[i]);
                }
              }
            } else {
              this.addAllPicsBtnStatus=true
              for(let i = 0;i<this.uploadPicsResult.length;i++){
                if(this.uploadPicsResult[i].status !== 3){
                  list.push(this.uploadPicsResult[i]);
                }
              }
            }
            let that = this;
            if(list.length === 0){
              this.$notify.error({
                title: '失败',
                message: '无新增图片',
                duration: 1000
              });
              that.picUploadVisible = false
              that.addPicsBtnStatus=false
              return false;
            }
            spApi.uploadPics(list,signal).then(rst=>{
              this.$notify({
                title: '成功',
                message: '上传成功',
                duration: 1000,
                type: 'success'
              });
              that.picUploadVisible = false
              that.addAllPicsBtnStatus=that.addPicsBtnStatus=false
            }).catch(err=>{
              this.$notify.error({
                title: '失败',
                message: '上传失败',
                duration: 1000
              });
            });
          },
          showPic(url){
              window.open(url)
          }
      },
      mounted(){
//        获取公司编码和该公司的商品列表
        this.uploadData.companyCode = this.selectCompanyInfo.companyCode;
        this.getItemList({pageSize:10,currentPage:1},this.uploadData.companyCode);
      },
//      引入分页组件
      components:{
        Pagination
      },
//      从vuex获取公司信息
      computed: {
        ...mapGetters({
          selectCompanyInfo: 'getSelectCompanyInfo',
        }),
      }
    }
</script>

<style>
  .row{
    margin:10px 0;
  }
  .editType{
    display: inline-block;
    padding-left:20px;
  }
</style>
