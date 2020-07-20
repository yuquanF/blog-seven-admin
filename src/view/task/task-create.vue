<template>
  <div class="container">
    <div class="title">新建任务</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="任务名" prop="name">
              <el-input size="medium" v-model="form.name" placeholder="请填写任务名"></el-input>
            </el-form-item>
            <el-form-item label="单个上传文件大小限制" prop="size">
              <el-input-number
                size="medium"
                v-model="form.size"
                placeholder="请填写单个上传文件大小限制"
              ></el-input-number>
              兆（M）
            </el-form-item>
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category_id" placeholder="请选择分类">
                <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入简介"
                v-model="form.summary"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="创建任务成功" :visible.sync="dialogVisible" width="30%">
      <div>当前任务编号： {{ task_id }}</div>
      <div>当前任务上传码： {{ code }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import task from '@/model/task'
import category from '@/model/category'

export default {
  data() {
    return {
      dialogVisible: false,
      task_id: '',
      code: '',
      form: {
        name: '',
        size: '2',
        summary: '',
        category_id: '',
      },
      categorys: [],
    }
  },
  async created() {
    await this.getCategorys()
  },
  methods: {
    async getCategorys() {
      try {
        const categorys = await category.getCategorys()
        this.categorys = categorys
      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    async submitForm(formName) {
      try {
        const res = await task.createTask(this.form)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.task_id = res.message.task_id
          this.code = res.message.code
          this.dialogVisible = true
          this.resetForm(formName)
        }
      } catch (error) {
        this.$message.error('任务添加失败，请检测填写信息')
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
