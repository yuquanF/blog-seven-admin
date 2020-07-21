<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header"><div class="title">分类列表</div></div>
      <!-- 表格 -->
      <my-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"
        v-loading="loading"
      ></my-table>
    </div>

    <!-- 编辑页面 -->
    <category-modify v-else @editClose="editClose" :editCategory="editCategory"></category-modify>
  </div>
</template>

<script>
import category from '@/model/category'
import MyTable from '@/components/my-table'
import CategoryModify from './category-modify'

export default {
  components: {
    MyTable,
    CategoryModify,
  },
  data() {
    return {
      tableColumn: [
        { prop: 'name', label: '分类名' },
        { prop: 'summary', label: '简介' },
      ],
      tableData: [],
      operate: [],
      showEdit: false,
      editCategory: {},
    }
  },
  async created() {
    this.loading = true
    await this.getCategorys()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除分类',
      },
    ]
    this.loading = false
  },
  methods: {
    async getCategorys() {
      try {
        const categorys = await category.getCategorys()
        this.tableData = categorys
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    handleEdit(val) {
      console.log('val', val)
      this.showEdit = true
      this.editCategory = val.row
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await category.delectCategory(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getCategorys()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    rowClick() {},
    async editClose() {
      this.showEdit = false
      await this.getCategorys()
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
