<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="left">
        <img src="@/assets/logo.png" alt="" class="logo" />
        <span class="title">后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 动态绑定  如果侧边栏被折叠 宽度就变为64px  否则为200px -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-menu" @click="toggleCollapse">| | |</div>
        <!-- el-menu中有router属性 -->
        <el-menu
          router
          :collapse-transition="false"
          :collapse="isCollapse"
          unique-opened
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <!-- 一级菜单 -->
          <!-- :index="item.id + ''"动态绑定 避免index重复 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 动态渲染图标-->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转  现在index是路径了-->
            <el-menu-item
              @click="saveNavState('/' + item1.path, item, item1)"
              :index="'/' + item1.path + ''"
              v-for="item1 in item.children"
              :key="item1.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ item1.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- welcom没有保存到本地 所以如果activePath存到了本地-->
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="activePath">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ item.authName }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ item1.authName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from '@/api/menus'
export default {
  created () {
    this.activePath = window.localStorage.getItem('activePath')

    this.getMenuList()
  },
  data () {
    return {
      menuList: [],
      icons: {
        125: 'iconfont icon-user1',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接的地址 el-ui中default-active当前激活菜单的 index
      activePath: '',
      item: '',
      item1: ''
    }
  },
  methods: {
    logout () {
      window.localStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      try {
        const res = await getMenuList()
        console.log('左侧菜单', res)
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        } else {
          this.menuList = res.data.data
          this.menuList.map(item => {
            item.children.map(item1 => {
              // item1.path路由里面的路径 item1.path这个里面没有带/   activePath中带/  所以要处理之后对比
              if (item1.path === this.activePath.replace('/', '')) {
                // 判断当前路径和路由中的路径是否相等  如果相等就把当前的名字给他
                // 去拿getMenuList这个列表的时候就去比较了 item和item1就可以及时的更新
                this.item = item
                this.item1 = item1
              }
              return null
            })

            return null
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 左侧菜单是否收缩
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 将index 路径存储到本地
    saveNavState (activePath, item, item1) {
      this.item = item
      this.item1 = item1
      // this.$store.commit('activePath', activePath)
      window.localStorage.setItem('activePath', activePath)
      // 点击不同的链接的时候 给这个activePath重新赋值
      this.activePath = activePath
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.home-container {
  height: 100vh;
  width: 100vw;
}
.el-container {
  background-color: #eee;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: rgb(84, 92, 100);
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .left {
    display: flex;
    align-items: center;
    .logo {
      margin-left: 20px;
      width: 61px;
      height: 56px;
    }
    .title {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: rgb(84, 92, 100);
  .el-menu {
    border-right: none;
    background-color: pink;
  }
}
.iconfont {
  margin-right: 10px;
}
.toggle-menu {
  height: 40px;
  background-color: #8fddfe;
  font-size: 18px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  // letter-spacing: 0.2em;
  cursor: pointer;
}
.el-breadcrumb__item {
  margin-bottom: 15px;
  font-size: 18px;
}
</style>
