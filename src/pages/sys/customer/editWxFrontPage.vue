<template>
  <section>
    <el-row>
      <el-col :span="18">
        <template>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="sectionOrder"
              label="序号">
            </el-table-column>
            <el-table-column label="版块类型">
              <template scope="scope">
                <span>{{getSectionType(scope.row.sectionCode)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="版块名称">
              <template scope="scope">
                <el-input v-model="scope.row.sectionTitle" @blur="updateTitle(scope.row.id,scope.row.sectionTitle)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否显示">
              <template scope="scope">
                <el-switch v-model="scope.row.isVisible" on-color="#42b983" off-color="#ff4949" :on-value="1" :off-value="0" @change="visibleChange(scope.row.isVisible,scope.row.id)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="上移/下移">
              <template scope="scope">
                  <el-button icon="arrow-up" size="mini" @click="updateSectionOrder(true,scope.row.id)" v-if="scope.row.sectionOrder !== 1"></el-button>
                  <el-button icon="arrow-down" size="mini" @click="updateSectionOrder(false,scope.row.id)" v-if="scope.row.sectionOrder !== 6"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
  </section>
</template>

<script>

  import sys from '../../../api/sys';
    export default{
        data() {
            return {
                tableData:[],
                dictionary:[],
                companyId:''
            }
        },
        methods: {
            getWxSection(campanyCode) {
              sys.getWxSection(campanyCode).then(rst=>{
                  this.tableData = rst.data.records;
              })
            },
            getSysDic(index){
            sys.getSysDic(index).then(rst=>{
              this.dictionary = rst.data;
              this.getWxSection(this.companyId);
            });
          },
            getSectionType(code) {
              var that = this;
              for(let i = 0;i<that.dictionary.length;i++){
                  if(code.toString() === that.dictionary[i].code) {
                      return that.dictionary[i].codeText;
                  }
              }
          },
            visibleChange(params,id) {
              var data = {
                id:id,
                visible:params === 1 ? false:true
            };
              sys.sectionVisible(data).then(rst=>{
                this.getWxSection(this.companyId);
              })
          },
            updateSectionOrder(ascending,id) {
                var data = {
                    ascending:ascending,
                    id:id
                };
              sys.sectionOrder(data).then(rst=>{
                this.getWxSection(this.companyId);
              })
            },
            updateTitle(id,title) {
                var data = {
                    id:id,
                    sectionTitle:title
                };
                sys.sectionTitleUpdate(data).then(rst=>{
                  this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getWxSection(this.companyId);
                })
            }
        },
      mounted() {
        this.companyId = this.$route.params.id;
        this.getSysDic(25);
      }
    }
</script>

<style>

</style>
