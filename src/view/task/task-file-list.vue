<template>
  <div>
    <div class="container">
      <!-- 顶部信息栏 -->
      <sticky-top>
        <div class="header">
          <!-- <el-button type="primary" @click="downAll" :disabled="loading">全部下载</el-button> -->
          <div class="header-left">
            <p class="title">任务编号： {{ task_id }}</p>
            <p class="title">任务名： {{ task_name }}</p>
          </div>
          <div class="header-right">
            <p class="title">当前文件数量： {{ files.count }}</p>
          </div>
        </div>
      </sticky-top>

      <!-- 比对操作 -->
      <div class="excel-names">
        <el-dropdown @command="selectExcelName">
          <span class="el-dropdown-link"> {{ dropTitle }} <i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in excelNames" :key="item" :command="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-popover trigger="click" title="比对相差结果" width="300" placement="right-end" :disabled="!compared">
          <!-- compared用来避免第一次没选择比对文件时，弹出显示结果窗口 -->
          <el-card class="box-card">
            <div v-for="item in difference" :key="item">
              {{ item }}
            </div>
          </el-card>
          <el-button type="success" slot="reference" @click="compareWithExcelData" :disabled="loading">比对</el-button>
        </el-popover>
      </div>

      <!-- 数据展示表格 -->
      <el-table v-loading="loading" :data="currentData" stripe border>
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="file_name" label="文件名" width="320px" sortable>
          <template slot-scope="scope">
            <el-tag size="medium" effect="plain" type="info" @click="downOne(scope.row)">{{
              scope.row.file_name
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="click">
              <task-file-modify @editClose="editClose" :file="editFile" />
              <el-button slot="reference" @click="handleEdit(scope.row)">编辑</el-button>
            </el-popover>
            <el-button type="danger" style="margin-left: 10px" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="file_url" label="下载地址" />
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
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import { mapGetters } from 'vuex'
import task from '@/model/task'
import TaskFileModify from './task-file-modify'

export default {
  data() {
    return {
      pagination: {
        pageSize: 10,
        pageTotal: null,
      },
      compared: false,
      files: {},
      loading: false,
      editFile: {},
      compareData: [],
      compareDataName: '', // 选中的比对的源文件名称
      difference: [],
      currentData: [], // 每次切换页码的时候要给table传入不同的数据
      currentPage: 1, // 当前选中页
      currentIndex: 1, // 当前索引，切换页面的时候需要重新计算
    }
  },
  components: {
    TaskFileModify,
  },
  deactivated() {
    this.$destroy()
  },
  async created() {
    this.loading = true
    this.task_id = this.$route.params.id
    this.task_name = this.$route.query.name
    await this.getTaskFiles()
    this.loading = false
  },
  computed: {
    ...mapGetters(['excelNames']),
    dropTitle() {
      return this.compareDataName ? this.compareDataName : '选择比对数据项'
    },
  },
  methods: {
    // 选择比对的源文件
    selectExcelName(val) {
      this.compareDataName = val
    },
    // 比对
    compareWithExcelData() {
      const key = this.compareDataName
      if (!key) {
        this.$message({
          message: '请先选择比对数据项',
          type: 'error',
          center: true,
        })
        return
      }
      const data = JSON.parse(localStorage.getItem(key))
      this._compare(data)
    },
    _compare(data) {
      this.compared = true // 用来避免第一次没选择比对文件时，弹出显示结果窗口
      if (!this.files.rows) {
        return
      }
      const origin = new Set(data)
      const target = new Set(this.files.rows.map(item => this._fileName(item.file_name)))
      const difference = new Set([...origin].filter(x => !target.has(x)))
      this.difference = difference
    },
    _fileName(data) {
      return data.split('.')[0]
    },
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
    // 关闭编辑栏，刷新数据
    async editClose(filename) {
      const elBody = document.getElementsByTagName('body')[0]
      elBody.click()

      const fileId = this.editFile.file_id
      if (fileId) {
        this.currentData.map(item => {
          if (item.file_id === fileId) {
            item.file_name = filename
          }
          return item
        })
      } else {
        await this.getTaskFiles()
      }
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
    // 获取所有任务文件
    async getTaskFiles() {
      try {
        const taskFiles = await task.getTaskFiles(this.task_id)
        this.files = taskFiles
        this.pagination.pageTotal = this.files.count
        this.tableData = this.files.rows
        this.currentData = this.tableData.filter(
          (item, index) => index >= (this.currentPage - 1) * this.pagination.pageSize
            && index < this.currentPage * this.pagination.pageSize,
        )
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

  .excel-names {
    background: #ffffff;
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-dropdown-link {
      padding: 20px;
    }
  }

  .el-tag {
    font-size: 16px !important;
    cursor: pointer;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-right: -10px;
    margin-top: 15px;
  }
}
</style>
