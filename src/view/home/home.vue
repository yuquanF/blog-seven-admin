<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside class="aside" :width="sideBarWidth">
      <side-bar :isCollapse="isCollapse"></side-bar>
    </el-aside>

    <el-container>
      <!-- 头部导航 -->
      <el-header class="header">
        <div class="left">
          <div class="operate" ref="operate">
            <i class="iconfont icon-fold" :class="{ rotate: isCollapse }" @click="changeSlidebarState" />
            <nav-bar></nav-bar>
          </div>
          <el-collapse-transition>
            <reuse-tab ref="reuse"></reuse-tab>
          </el-collapse-transition>
        </div>
      </el-header>
      <!-- 主内容区 -->
      <el-main ref="main">
        <menu-tab></menu-tab>
        <app-main ref="appMain"></app-main>
      </el-main>
      <back-top :right="50" :bottom="50" :fontSize="34"></back-top>
    </el-container>
  </el-container>
</template>

<script>
import { NavBar, SideBar, AppMain, ReuseTab, MenuTab, BackTop } from '@/layout'

export default {
  name: 'layout',
  data() {
    return {
      isCollapse: false, // 左侧菜单栏是否折叠
    }
  },
  methods: {
    // 控制菜单折叠
    changeSlidebarState() {
      this.isCollapse = !this.isCollapse
    },
  },
  computed: {
    sideBarWidth() {
      return this.isCollapse === false ? '210px' : '64px'
    }
  },
  components: {
    NavBar,
    SideBar,
    AppMain,
    ReuseTab,
    MenuTab,
    BackTop,
  },
}
</script>

<style lang="scss" scoped>
.aside {
  overflow-x: hidden;
  background: $sidebar-bg;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}

.header {
  padding: 0;
  background: $header-background;
  height: $header-height !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 6px 0px rgba(190, 204, 216, 0.4);
  border-bottom: 1px solid rgba(190, 204, 216, 0.4);
  margin-bottom: 8px;

  .left {
    width: 100%;

    .operate {
      display: flex;
      align-items: center;
      background: $header-background;
      padding-left: 20px;
      height: 60px;

      .iconfont {
        font-size: 16px;
        font-weight: 500;
        color: $right-side-font-color;
        cursor: pointer;
        transform: rotate(0deg);
        transition: all 0.3s linear;
        margin-right: 10px;

        &:hover {
          color: $theme;
        }
      }

      .rotate {
        transform: rotate(180deg);
        transition: all 0.3s linear;
      }
    }
  }

  .right-info {
    display: flex;
    align-items: center;
  }
}

.el-main {
  overflow-y: auto;
  position: relative;
  padding-bottom: 40px;
}

.backTop {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  right: 50px;
  bottom: 50px;
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  z-index: 99;
  background: #fff;

  .iconfont {
    font-size: 36px;
  }
}
</style>
