<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button
        type="primary"
        @click="
          addDialogVisible = true;
          isEdit = false;
          roleform = {};
        "
        >添加角色</el-button
      >
      <!-- 下面的表格 -->
      <el-table border :data="roleList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              @click="editRoles(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="small"
              >编辑</el-button
            >
            <el-button
              @click="del(scope.row.id)"
              type="info"
              icon="el-icon-delete"
              size="small"
              >删除</el-button
            >
            <el-button
              @click="showRoleDialog(scope.row.id)"
              type="success"
              icon="el-icon-setting"
              size="small"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户对话框 -->
      <el-dialog
        :visible.sync="addDialogVisible"
        :title="isEdit ? '编辑角色对话框' : '添加角色对话框'"
        @close="reset"
      >
        <el-form
          ref="myForm"
          label-width="80px"
          :model="roleform"
          :rules="rules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="onClick">确认</el-button>
          <el-button @click="addDialogVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRolesList, delRole, addRole, editRole } from '@/api/roles'
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      roleList: [],
      addDialogVisible: false,
      roleform: {
        roleName: '',
        roleDesc: ''
      },
      isEdit: false,
      rules: {
        roleName: [
          { required: true, message: '请填写角色名' }
        ],
        roleDesc: [
          { required: true, message: '请填写角色描述' }
        ]
      }
    }
  },
  methods: {
    // 获得角色列表
    async getRolesList () {
      const res = await getRolesList()
      console.log('角色列表', res)
      this.roleList = res.data.data
    },
    // 删除角色
    del (id) {
      this.$confirm('确定删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加角色 editRole
    onClick () {
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.roleform)
        } else {
          await addRole(this.roleform)
        }
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 关闭对话框后重置 清除数据
    reset () {
      this.$refs.myForm.resetFields()
    },
    editRoles (row) {
      // 编辑角色传row进来  就是为了打开表单里面有数据
      this.isEdit = true
      this.addDialogVisible = true
      this.roleform = { ...row }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
}
</style>
