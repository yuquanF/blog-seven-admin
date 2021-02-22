<template>
  <div class="file-container" v-loading="loading">
    <div class="title">
      <span>修改文件名</span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-input disabled :value="file.file_name" />
      <el-input size="medium" v-model="filename" placeholder="请填写文件名"></el-input>
      <div class="operate">
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="reset">重 置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import task from '@/model/task'

export default {
  props: {
    file: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      filename: '',
    }
  },
  watch: {
    file() {
      this.filename = this.file.file_name
    },
  },
  methods: {
    async submit() {
      const { file_id } = this.file
      if (!file_id || !this.filename) {
        return
      }
      this.loading = true
      const res = await task.updateTaskFileInfo(file_id, {
        file_name: this.filename,
      })
      setTimeout(() => {
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.$emit('editClose', this.filename) // 将修改后的filename传回
        }
      }, 300)
    },
    // 重置表单
    reset() {
      this.filename = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.file-container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
  }

  .wrap {
    padding: 20px;
    display: flex;
    flex-direction: column;

    .el-input {
      margin: 10px 0;
    }
  }

  .operate {
    display: flex;
    margin-top: 40px;
    justify-content: flex-end;
  }
}
</style>
