<template>
  <!--编辑界面-->
  <el-dialog title="编辑" v-model="inputs.show" :close-on-click-modal="false" @open="onOpen">
    <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
      <el-form-item label="角色代码" prop="roleCode">
        <el-input v-model.trim="editForm.roleCode"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model.trim="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleType">
        <el-select v-model="editForm.roleType">
          <el-option v-for="item in roleTypes" key="" :label="item.DisplayName" :value="item.Code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="inputs.show = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import lookup from 'supports/lookup';
  import sysApi from '../../../api/sys';

  export default {
    props: ['inputs'], //{show: true/false,  data:{}}
    computed:{
    },
    data() {
      return {
        roleTypes: lookup.RoleType.getList(),
        editLoading: false,
        editFormRules: {
          roleCode: [
            { required: true, message: '请输入角色代码', trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          roleCode: '',
          roleName: '',
          roleType: 1
        },
      }
    },
    methods: {
      onOpen: function(){
        Object.assign(this.editForm, this.inputs.data);
      },
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = Object.assign({}, this.editForm);
//              this.$emit('editdone', para);
//              this.editLoading = false;
//              this.inputs.show = false;
              sysApi.editRole(para).then(() => {
                this.editLoading = false;
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.inputs.show = false;
                this.$emit('editdone', para);
              });
            });
          }
        });
      },
    },
    mounted() {
    }
  }

</script>

<style scoped>

</style>
