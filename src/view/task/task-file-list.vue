<template>
  <div>
    <div class="container">
      <sticky-top>
        <div class="header">
          <el-button type="primary" @click="downAll" :disabled="loading">下载全部</el-button>
          <div class="header-left">
            <p class="title">任务编号： {{ task_id }}</p>
            <p class="title">任务名： {{ task_name }}</p>
          </div>
          <div class="header-right">
            <p class="title">当前文件数量： {{ files.count }}</p>
          </div>
        </div>
      </sticky-top>
      <el-table v-loading="loading" :data="files.rows" stripe border>
        <el-table-column prop="file_name" label="文件名" width="320px" sortable>
          <template slot-scope="scope">
            <el-tag size="medium" effect="plain" type="info" @click="downOne(scope.row)">{{
              scope.row.file_name
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="click" ref="popover">
              <task-file-modify @editClose="editClose" :file="editFile" />
              <el-button slot="reference" @click="handleEdit(scope.row)">编辑</el-button>
            </el-popover>
            <el-button type="danger" style="margin-left: 10px;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="file_url" label="下载地址" />
      </el-table>
    </div>

    <!-- 编辑页面 -->
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import task from '@/model/task'
import TaskFileModify from './task-file-modify'

export default {
  data() {
    return {
      task_id: '',
      task_name: '',
      files: {},
      loading: false,
      editFile: {},
    }
  },
  components: {
    TaskFileModify,
  },
  async created() {
    this.task_id = this.$route.params.id
    this.task_name = this.$route.query.name
    await this.getTaskFiles()
  },
  methods: {
    async editClose() {
      this.$refs.popover.$el.click()
      await this.getTaskFiles()
    },
    handleEdit(file) {
      this.editFile = file
    },
    handleDelete(file) {
      if (!file.id) {
        return
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await task.deleteTaskFile(file.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getTaskFiles()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    async downOne(item) {
      await saveAs(item.file_url, item.file_name)
    },
    async downAll() {
      this.loading = true
      const files = this.files.rows
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i].file_name
        const fileUrl = files[i].file_url
        // eslint-disable-next-line no-await-in-loop
        await saveAs(fileUrl, fileName)
      }
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    async getTaskFiles() {
      try {
        const taskFiles = await task.getTaskFiles(this.task_id)
        this.files = taskFiles
      } catch (error) {
        if (error.code === 10020) {
          this.files = []
        }
      }
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
    padding: 0 20px;

    .header-left {
      display: flex;

      .title {
        height: 59px;
        line-height: 59px;
        color: #4c76af;
        font-size: 16px;
        font-weight: 500;
        padding: 0 10px;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .el-tag {
    font-size: 16px !important;
    cursor: pointer;
  }
}
</style>
