<template>
  <el-button class="refresh" plain @click="handleRefresh">刷新</el-button>
</template>

<script>
export default {
  methods: {
    handleRefresh() {
      this.$emit('refresh')
    },
  },
}
</script>

<style lang="scss" scoped>
.refresh {
  position: fixed;
  right: 20px;
  margin: 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  box-shadow: -1px 2px 4px #c8c8c8;
}
</style>
