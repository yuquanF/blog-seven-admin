<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">任务列表</div></div>

      <!-- 数据展示表格 -->
      <el-table v-loading="loading" :data="currentData" stripe border >
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="id" label="上传编号" width="100"></el-table-column>
        <el-table-column prop="code" label="上传码" width="100" ></el-table-column>
        <el-table-column prop="size" label="单个文件上传限制（兆）" width="100"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="name" label="任务名"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button slot="reference" @click="handleSee(scope)">查看</el-button>
            <el-button slot="reference" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" style="margin-left: 10px" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        v-if="pagination"
        small
        background
        layout="sizes, prev, pager, next, total"
        :page-size="pagination.pageSize ? pagination.pageSize : 10"
        :total="pagination.pageTotal ? pagination.pageTotal : null"
        @current-change="currentChange"
        @size-change="sizeChange"
      ></el-pagination>
    </div>

    <!-- 编辑页面 -->
    <task-modify v-else @editClose="editClose" :editTask="editTask"></task-modify>
  </div>
</template>

<script>
import task from '@/model/task'
import TaskModify from './task-modify'

export default {
  components: {
    TaskModify,
  },
  data() {
    return {
      pagination: {
        pageSize: 10,
        pageTotal: null,
      },
      currentData: [], // 每次切换页码的时候要给table传入不同的数据
      currentPage: 1, // 当前选中页
      currentIndex: 1, // 当前索引，切换页面的时候需要重新计算
      tableData: [],
      operate: [],
      showEdit: false,
      editTask: 1,
      loading: false,
    }
  },
  async created() {
    this.loading = true
    await this.getTasks()
    this.loading = false
  },
  methods: {
    // 切换当前页
    currentChange(page) {
      this.currentPage = page
      this.currentData = this.tableData.filter(
        (item, index) => index >= (this.currentPage - 1) * this.pagination.pageSize
          && index < this.currentPage * this.pagination.pageSize,
      )
      // 切换行索引
      this.currentIndex = (this.currentPage - 1) * this.pagination.pageSize + 1
    },
    // 每页显示数量变化时触发
    sizeChange(size) {
      this.currentPage = 1
      this.pagination.pageSize = size
      this.currentData = this.tableData.filter(
        (item, index) => index >= (this.currentPage - 1) * this.pagination.pageSize
          && index < this.currentPage * this.pagination.pageSize,
      )
    },
    async getTasks() {
      try {
        const tasks = await task.getTasks()
        this.pagination.pageTotal = tasks.length
        this.tableData = tasks
        this.currentData = this.tableData.filter(
          (item, index) => index >= (this.currentPage - 1) * this.pagination.pageSize
            && index < this.currentPage * this.pagination.pageSize,
        )
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    handleEdit(val) {
      this.showEdit = true
      this.editTask = val.row
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await task.delectTask(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getTasks()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    handleSee(val) {
      this.$router.push({ path: `/task/filelist/${val.row.id}`, query: { name: val.row.name } })
    },
    async editClose() {
      this.showEdit = false
      await this.getTasks()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-right: -10px;
    margin-top: 15px;
  }
}
</style>
