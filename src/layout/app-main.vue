<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
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
}
</script>

<style lang="scss" scoped>
.container {
  .wrapper {
    width: 100%;
    height: 100%;
    text-align: left;
  }
}
</style>
