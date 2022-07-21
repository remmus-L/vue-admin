<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 按钮 -->
      <el-row type="flex" align="middle" :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="input1"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="
              addDialogVisible = true;
              userform = {};
            "
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- 下面的表格 -->
      <el-table border :data="goodsList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="upd_time"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              >编辑</el-button
            >
            <el-button
              type="info"
              icon="el-icon-delete"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- :current-page当前为第几页 -->
      <!-- :page-sizes="[2, 3, 4, 5]"每页的数据有几条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsObj.pagenum"
        :page-sizes="[4, 5, 6, 7, 8]"
        :page-size="paramsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from '@/api/goods'
export default {
  paramsObj: {
    pagenum: 1, // 第一页的数据
    pagesize: 4,
    query: ''// 每页显示的数据
  },
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      paramsObj: {
        pagenum: 1, // 第一页的数据
        pagesize: 4,
        query: ''// 每页显示的数据
      },
      input1: '',
      goodsList: [],
      total: null
    }
  },
  methods: {
    async getGoodsList () {
      try {
        const res = await getGoodsList(this.paramsObj)
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
        // this.total = res.data.data.total
        console.log('商品列表', res)
      } catch (err) {
        console.log(err)
      }
    },
    // 每页条数显示发生变化会触发
    handleSizeChange (pagesize) {
      // 动态设置每页条数
      this.paramsObj.pagesize = pagesize
      this.getGoodsList()
    },
    // currentPage 改变时会触发  显示当前页的数据
    handleCurrentChange (pagenum) {
      console.log(pagenum)
      // 动态查看当前页的数据
      this.paramsObj.pagenum = pagenum
      this.getGoodsList()
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
</style>
