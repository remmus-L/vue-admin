<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 按钮 -->
      <el-row type="flex" align="middle" :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="input3"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>
      <!-- 下面的表格 -->
      <el-table border :data="usersList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              @click="editDialogVisible = true"
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-delete"
              size="small"
            ></el-button>
            <el-button
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
    <el-dialog :visible.sync="editDialogVisible" title="编辑用户">
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="用户名称">
          <el-input disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUsersList } from '@/api/user'
export default {
  created () {
    this.getUsersList()
  },
  data () {
    return {
      input3: '',
      paramsObj: {
        pagenum: 1, // 第一页的数据
        pagesize: 4,
        query: ''// 每页显示的数据
      },
      usersList: [],
      total: null,
      editDialogVisible: false,
      form: {
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
        ]
      }
    }
  },
  methods: {
    async getUsersList () {
      try {
        const res = await getUsersList(this.paramsObj)
        this.usersList = res.data.data.users
        this.total = res.data.data.total
        console.log('用户列表', res)
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
.el-pagination{
  margin-top: 20px;
}
</style>
