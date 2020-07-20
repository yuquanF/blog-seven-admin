<template>
  <div class="container">
    <div class="title">
      <span>修改任务</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" v-loading="loading" @submit.native.prevent>
            <el-form-item label="任务编号" prop="task_id">
              <el-input size="medium" v-model="form.id" disabled></el-input>
            </el-form-item>
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
  </div>
</template>

<script>
import category from '@/model/category'
import task from '@/model/task'

export default {
  props: {
    editTask: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        category_id: '',
        size: '',
        name: '',
        summary: '',
      },
      categorys: [],
    }
  },
  async mounted() {
    this.loading = true
    this.form = this.editTask
    this.loading = false
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
    async submitForm() {
      const res = await task.editTask(this.editTask.id, {
        name: this.form.name,
        summary: this.form.summary,
        category_id: this.form.category_id,
        size: this.form.size,
      })
      if (res.code < window.MAX_SUCCESS_CODE) {
        this.$message.success(`${res.message}`)
        this.$emit('editClose')
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('editClose')
    },
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
