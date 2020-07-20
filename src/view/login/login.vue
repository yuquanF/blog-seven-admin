<template>
  <div class="login">
    <div class="form-box" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <form class="login-form" autocomplete="off" @submit.prevent="throttleLogin()">
        <div class="form-item nickname">
          <span class="icon account-icon"></span>
          <input type="text" v-model="form.username" autocomplete="off" placeholder="用户名" />
        </div>
        <div class="form-item password">
          <span class="icon secret-icon"></span>
          <input type="password" v-model="form.password" autocomplete="off" placeholder="密码" />
        </div>
        <button class="submit-btn" type="submit">登录</button>
      </form>
    </div>
    <div class="music">
      <div class="left-line"></div>
      <div class="right-line"></div>
      <iframe
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        width="330"
        height="86"
        src="//music.163.com/outchain/player?type=2&id=464916877&auto=1&height=66"
      ></iframe>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import UserModel from '@/lib/model/user'
import Utils from '@/lib/util/util'

export default {
  name: 'login',
  data() {
    return {
      loading: false, // 加载动画
      wait: 2000, // 2000ms之内不能重复发起请求
      throttleLogin: null, // 节流登录
      form: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async login() {
      const { username, password } = this.form
      try {
        this.loading = true
        await UserModel.getToken(username, password)
        await this.getInformation()
        this.loading = false
        this.$router.push('/about')
        this.$message.success('登录成功')
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async getInformation() {
      try {
        // 尝试获取当前用户信息
        const user = await UserModel.getPermissions()
        this.setUserAndState(user)
        this.setUserPermissions(user.permissions)
      } catch (e) {
        console.log(e)
      }
    },
    ...mapActions(['setUserAndState']),
    ...mapMutations({
      setUserPermissions: 'SET_USER_PERMISSIONS',
    }),
  },
  created() {
    // 节流登录
    this.throttleLogin = Utils.throttle(this.login, this.wait)
  },
}
</script>

<style lang="scss">
.music {
  transform: rotate(-7deg);
  position: fixed;
  top: 50px;
  right: 10px;
  opacity: 0.5;
  .left-line,
  .right-line {
    width: 4px;
    height: 100px;
    background-color: #efd6d6;
    position: fixed;
    top: -75px;
    right: 200px;
    transform: rotate(-7deg);
    z-index: -1;
  }
  .right-line {
    right: 100px;
  }
}

.login {
  width: 100%;
  height: 100%;

  .form-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 445px;

    .login-form {
      width: 100%;

      .form-item {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        padding-bottom: 13px;
        margin-bottom: 34px;

        input {
          width: 100%;
          height: 100%;
          background: transparent;
          font-size: 20px;
          color: #e8c7c7;
          padding-left: 74px;
          box-sizing: border-box;
          opacity: 0.8;
          &::placeholder {
            color: #e8c7c7;
            opacity: 0.5;
          }
        }
      }

      .submit-btn {
        width: 100%;
        height: 70px;
        color: #e8c7c7;
        font-size: 24px;
        text-align: left;
        box-sizing: border-box;
        padding: 0 10px;
        padding-left: 74px;
        border: none;
        cursor: pointer;
        background: transparent;
        opacity: 0.8;
      }
    }
  }
}
</style>
