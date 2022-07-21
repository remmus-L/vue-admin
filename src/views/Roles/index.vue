<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
    </el-card>
  </div>
</template>

<script>
import { getRolesList } from '@/api/roles'
export default {
  created () {
    this.getRolesList()
  },
  data () {
    return {
      roleList: []
    }
  },
  methods: {
    async getRolesList () {
      const res = await getRolesList()
      console.log('角色列表', res)
      this.roleList = res.data.data
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
</style>
