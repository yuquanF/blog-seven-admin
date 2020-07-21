<template>
  <div>
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:20px;"
      @header-click="headerClick"
    >
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/component/base/upload-excel/index.vue'
import { get } from 'lodash'
import { mapActions } from 'vuex'

export default {
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
    }
  },
  methods: {
    ...mapActions(['setExcelNames']),
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10

      if (isLt10M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 10m in size.',
        type: 'warning',
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    async headerClick(column) {
      try {
        const confirmRes = await this.$confirm('此操作将把该列元素保存到浏览器缓存中, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        if (confirmRes) {
          const promptRes = await this.$prompt('变量名', '请输入变量名', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          })
          if (promptRes.value) {
            const { property } = column
            let data = this.tableData
            data = data.map(item => {
              return get(item, property)
            })
            const name = `excel_${promptRes.value}`
            this.setExcelNames(name)
            localStorage.setItem(name, JSON.stringify(data))
          }
        }
      } catch (error) {}
    },
  },
}
</script>
