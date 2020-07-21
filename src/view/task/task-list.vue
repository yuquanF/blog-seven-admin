<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">任务列表</div></div>
      <!-- 表格 -->
      <my-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleSee="handleSee"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
      ></my-table>
    </div>

    <!-- 编辑页面 -->
    <task-modify v-else @editClose="editClose" :editTask="editTask"></task-modify>
  </div>
</template>

<script>
import task from '@/model/task'
import MyTable from '@/components/my-table'
import TaskModify from './task-modify'

export default {
  components: {
    MyTable,
    TaskModify,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'id', label: '上传编号' },
        { prop: 'code', label: '上传码' },
        { prop: 'size', label: '单个文件上传限制（兆）' },
        { prop: 'name', label: '任务名' },
        { prop: 'summary', label: '简介' },
        { prop: 'creator', label: '创建人' },
        { prop: 'category_id', label: '分类编号' },
      ],
      tableData: [],
      operate: [],
      showEdit: false,
      editTask: 1,
    }
  },
  async created() {
    this.loading = true
    await this.getTasks()
    this.operate = [
      { name: '查看', func: 'handleSee', type: 'primary' },
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除任务',
      },
    ]
    this.loading = false
  },
  methods: {
    async getTasks() {
      try {
        const tasks = await task.getTasks()
        this.tableData = tasks
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    handleEdit(val) {
      console.log('val', val)
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
    margin: 20px;
  }
}
</style>
