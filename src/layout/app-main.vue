<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
      <el-button class="refresh" plain @click="handleRefresh">刷新</el-button>
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  watch: {
    $route() {
      if (this.$previewInstance) {
        // this.$previewInstance.destroy()
      }
    },
  },
  methods: {
    handleRefresh() {
      this.$router.go(0)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .wrapper {
    width: 100%;
    height: 100%;
    text-align: left;

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
  }
}
</style>
