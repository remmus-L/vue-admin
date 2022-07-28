<template>
  <div>
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
        <el-table-column label="#" type="expand">
          <template v-slot="scope">
            <!-- 动态给一级权限加上底边框 -->
            <!-- 为每个一级权限加上下边框，如果为第一个，就加上上边框  否则不加 -->
            <el-row
              :class="[
                'bottomborder',
                index === 0 ? 'topborder' : '',
                'vcenter',
              ]"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <!-- <pre>
                 {{ scope.row }}
               </pre
                > -->
                <el-tag
                  closable
                  @close="delClick(scope.row.id, item1.id, scope.row)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 放在同一块区域里的 -->
              <el-col :span="19">
                <!-- 渲染二级循环 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'topborder', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delClick(scope.row.id, item2.id, scope.row)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <!-- scope.row, item3.id角色id和权限id -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="delClick(scope.row.id, item3.id, scope.row)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
              @click="showRoleDialog(scope.row)"
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
      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="rightVisible"
        width="60%"
        @close="setRightDialog"
      >
        <!-- 数据里面没有label  所以这里给他添加上 -->
        <!-- v-if="rightVisible"让每次对话框关闭的时候  让tree销毁 避免缓存 -->
        <!-- :default-checked-keys="selectedPermissions" -->
        <el-tree
          :data="allRightList"
          ref="myTree"
          node-key="id"
          :props="treeProps"
          default-expand-all
          show-checkbox
          :default-checked-keys="defKeys"
        ></el-tree>
        <!-- default-checked-keys 选中不选中是看这个id值  唯一 -->
        <template #footer>
          <!-- @click="save" -->
          <el-button type="primary" @click="saveRight()">确认</el-button>
          <el-button @click="rightVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRightListPoint } from '@/api/rights'
import { getRolesList, delRole, addRole, editRole, delAppointRole, setRight } from '@/api/roles'
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
      id: null,
      rightVisible: false,
      allRightList: [], // 所有权限点
      defKeys: [], // 默认选中的节点的id值数组
      roleId: '', // 设置分配权限 角色id  在点击分配权限时拿到的
      treeProps: {
        label: 'authName',
        children: 'children'
      },
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
      // 拿到角色id  作为全局变量
      this.id = id
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
    // 编辑角色
    editRoles (row) {
      // 编辑角色传row进来  就是为了打开表单里面有数据
      this.isEdit = true
      this.addDialogVisible = true
      this.roleform = { ...row }
    },
    // 根据id删除权限
    delClick (roleId, rightId, row) {
      this.$confirm('确定删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delAppointRole({ roleId, rightId })// 注意多个参数后面要加{}
        console.log('删除权限', res)
        if (res.data.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        }
        // 这里是不是相当于  重新拿到删除之后里面的数据  在重新去遍历
        row.children = res.data.data
        // 不能直接去调用列表  因为删除后会跳转到列表  效果不好
        // this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          // 这是点取消时弹出的
          message: '已取消删除'
        })
      })
    },
    // 分配权限
    // role是点击分配权限的时候传过来的  然后递归去遍历role的children  再接着继续遍历children
    async showRoleDialog (role) {
      // 将角色id拿到 在分配权限保存时 传参
      this.roleId = role.id
      this.getLeafKeys(role, this.defKeys)
      this.rightVisible = true
      const res = await getRightListPoint()
      console.log('所有权限点', res)
      this.allRightList = res.data.data
    },
    // 递归遍历默认选中的id
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭对话框时 重新更新一下选中的权限  让视图更新
    setRightDialog () {
      this.defKeys = []
    },
    async saveRight () {
      // 拿到所有选中和半选中的节点的数组
      const keys = [
        ...this.$refs.myTree.getCheckedKeys(),
        ...this.$refs.myTree.getHalfCheckedKeys()
      ]
      // 后台数据需要格式
      const idStr = keys.join(',')
      // 从data中拿数据一定要加this.
      this.$confirm('确定更改权限设置吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await setRight({ roleId: this.roleId, rids: idStr })// 注意多个参数后面要加{}
        this.$message.success('设置权限成功')
        this.getRolesList()
        this.rightVisible = false
      }).catch(() => {
        this.$message({
          type: 'info',
          // 这是点取消时弹出的
          message: '已取消更改'
        })
      })
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
.el-tag {
  margin: 7px;
}
.topborder {
  border-top: 1px solid #eee;
}
.bottomborder {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
