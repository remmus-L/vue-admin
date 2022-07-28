<template>
  <div>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 按钮 -->
      <el-row type="flex" align="middle" :gutter="20">
        <el-col :span="8">
          <el-input
            clearable
            @clear="getUsersList"
            placeholder="请输入内容"
            v-model="paramsObj.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="
              addDialogVisible = true;
              userform = {};
            "
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 下面的表格 -->
      <el-table border :data="usersList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409eff"
              inactive-color="#dcdfe6"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              @click="editUsers(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
            <el-button
              @click="del(scope.row.id)"
              type="info"
              icon="el-icon-delete"
              size="small"
            ></el-button>
            <!-- 设置  分配角色 -->
            <el-button
              @click="showRoleDialog(scope.row)"
              type="success"
              icon="el-icon-setting"
              size="small"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- :current-page当前为第几页 -->
      <!-- :page-sizes="[2, 3, 4, 5]"每页的数据有几条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsObj.pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="paramsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改用户 -->
    <el-dialog :visible.sync="editDialogVisible" title="编辑用户">
      <el-form ref="editForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="用户名称" prop="username">
          <el-input disabled v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onEdit">确认</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      title="添加用户对话框"
      @close="reset"
    >
      <el-form ref="myForm" label-width="80px" :model="userform" :rules="rules">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogVisible"
      width="60%"
      @close="setRoleDialogClosed"
    >
      <div class="currentUser">当前用户: {{ userInfo.username }}</div>
      <div class="currentRole">当前角色: {{ userInfo.role_name }}</div>
      <span class="newRole">分配新角色:</span>
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option
          v-for="item in setRoleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsersList, addUser, delUser, editUser } from '@/api/user'
import { getRolesList, assignRole } from '@/api/roles'
export default {
  created () {
    this.getUsersList()
  },
  data () {
    return {
      paramsObj: {
        pagenum: 1, // 第一页的数据
        pagesize: 4,
        query: ''// 每页显示的数据
      },
      usersList: [],
      total: null,
      editDialogVisible: false, // 编辑对话框
      addDialogVisible: false, // 用户对话框
      roleDialogVisible: false, // 分配角色
      userInfo: {}, // 需要被分配角色的用户信息
      setRoleList: [],
      selectedRoleId: '', // 已选中的角色的id值
      form: {
        email: '',
        mobile: '',
        username: ''
      },
      userform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        email: [
          { required: true, message: '请填写邮箱' },
          { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^(?:(?:\+|00)86)?1\d{10}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请填写用户名' }
        ],
        password: [
          { required: true, message: '请填写密码' },
          { pattern: /^[a-zA-Z0-9]{4,16}$/, message: '密码4到16位字母,数字组成', trigger: 'blur' }
        ]
      },
      // 分配角色下拉
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  methods: {
    async getUsersList () {
      try {
        const res = await getUsersList(this.paramsObj)
        this.usersList = res.data.data.users
        this.total = res.data.data.total
        // console.log('用户列表', res)
      } catch (err) {
        console.log(err)
      }
    },
    // 每页条数显示发生变化会触发
    handleSizeChange (pagesize) {
      // 动态设置每页条数
      this.paramsObj.pagesize = pagesize
      this.getUsersList()
    },
    // currentPage 改变时会触发  显示当前页的数据
    handleCurrentChange (pagenum) {
      console.log(pagenum)
      // 动态查看当前页的数据
      this.paramsObj.pagenum = pagenum
      this.getUsersList()
    },
    editUsers (row) {
      // 点击编辑弹出对话框
      this.editDialogVisible = true
      // 让弹出的对话框中显示内容
      this.form = { ...row }
    },
    onClick () {
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法')
        await addUser(this.userform)
        this.getUsersList()
        this.addDialogVisible = false
      })
    },
    // 关闭对话框后重置 清除数据
    reset () {
      this.$refs.myForm.resetFields()
    },
    // 删除单个用户
    del (id) {
      this.$confirm('确定删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delUser(id)
        // 删除当前这一页 最后一页就应该跑到上一页
        if (this.usersList.length === 1 && this.paramsObj.pagenum > 1) {
          this.paramsObj.pagenum--
        }
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
        this.getUsersList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onEdit () {
      this.$refs.editForm.validate(async bool => {
        if (!bool) return this.$message.error('表单数据非法')
        await editUser(this.form)
        this.getUsersList()
        this.editDialogVisible = false
      })
    },
    // 点击设置就去拿数据 点击设置拿过来的 scope.row
    async showRoleDialog (userInfo) {
      // 拿到角色信息 再去全局定义
      this.userInfo = userInfo
      // 在展示对话框之前获取所有的角色
      const res = await getRolesList()
      this.setRoleList = res.data.data
      console.log('分配角色', res)
      this.roleDialogVisible = true
    },
    // 点击确定按钮  分配角色
    async saveRoleInfo () {
      const { data: res } = await assignRole({ id: this.userInfo.id, rid: this.selectedRoleId })
      console.log('11', res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      // 刷新用户列表
      this.getUsersList()
      this.roleDialogVisible = false
    },
    setRoleDialogClosed () {
      this.userInfo = {}
      this.selectedRoleId = ''
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
.input-with-select {
  width: 400px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.currentUser {
  margin-bottom: 15px;
}
.currentRole {
  margin-bottom: 15px;
}
.newRole {
  margin-right: 20px;
}
</style>
