<template>
  <div class="login">
    <a-form @submit.prevent="doLogin" :form="form">
      <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;" :activeKey="activeKey"
              @change="handleTabsChange">
        <a-tab-pane tab="账户密码登录" key="1">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                   style="margin-bottom: 24px;"></a-alert>
          <a-form-item>
            <a-input size="large"  v-decorator="['name',{rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]">
              <a-icon slot="prefix" type="user"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input size="large" type="password" v-decorator="['password',{rules: [{ required: true, message: '请输入密码', whitespace: true}]}]">
              <a-icon slot="prefix" type="lock"></a-icon>
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane tab="手机号登录" key="2">
          <a-form-item>
            <a-input size="large">
              <a-icon slot="prefix" type="mobile"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-row :gutter="8" style="margin: 0 -4px">
              <a-col :span="16">
                <a-input size="large">
                  <a-icon slot="prefix" type="mail"></a-icon>
                </a-input>
              </a-col>
              <a-col :span="8" style="padding-left: 4px">
                <a-button style="width: 100%" class="captcha-button" size="large" @click="getCaptcha">获取验证码</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
      <a-form-item>
        <a-button :loading="loading" style="width: 100%; margin-top: 4px" size="large" htmlType="submit" type="primary">
          登录
        </a-button>
      </a-form-item>
      <div>
        <a style="float: right" @click="regist">注册账户</a>
      </div>
    </a-form>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  // 组件的生命周期：组件实例创建之前被调用
  beforeCreate () {
    // this代表当前的login.vue组件
    this.form = this.$form.createForm(this)
  },
  // 组件的名称
  name: 'Login',
  // 组件的数据对象
  data () {
    return {
      // 组件的加载状态
      loading: false,
      // 组件的错误信息
      error: '',
      // 当前选项卡的激活键
      activeKey: '1'
    }
  },
  // vue组件中的计算属性：根据
  computed: {
    systemName () {
      // systemName：该计算属性返回this.$store.state.setting.systemName的值。这意味着它从Vue应用的状态管理仓库（store）中获取setting模块的systemName属性的值。当setting模块的systemName属性发生变化时，systemName计算属性会自动重新计算并更新其值
      return this.$store.state.setting.systemName
    },
    copyright () {
      // copyright：该计算属性返回this.$store.state.setting.copyright的值。它获取setting模块的copyright属性的值，并且在setting模块的copyright属性发生变化时，自动重新计算并更新
      return this.$store.state.setting.copyright
    }
  },
  // 组件的生命周期：可以执行一些初始化操作，它在组件实例创建完成后被调用
  created () {
    // 清空浏览器的本地存储（localStorage）中的所有数据
    this.$db.clear()
    // 将路由配置项中的路由数组清空，可能是为了在组件创建时重置路由配置，清空已有的路由信息
    this.$router.options.routes = []
  },
  // 组件中可以调用的方法
  methods: {
    // 登录方法
    doLogin () {
      // 如果选项卡为1
      if (this.activeKey === '1') {
        // 用户名密码登录：验证字段后发起请求给
        this.form.validateFields(['name', 'password'], (errors, values) => {
          if (!errors) {
            this.loading = true
            let name = this.form.getFieldValue('name')
            let password = this.form.getFieldValue('password')
            this.$post('login', {
              username: name,
              password: password
            }).then((r) => {
              let data = r.data.data
              this.saveLoginData(data)
              setTimeout(() => {
                this.loading = false
              }, 500)
              this.$router.push('/')
            }).catch((e) => {
              console.error(e)
              setTimeout(() => {
                this.loading = false
              }, 500)
            })
          }
        })
      }
      if (this.activeKey === '2') {
        // 手机验证码登录
        this.$message.warning('暂未开发')
      }
    },
    // 注册方法
    regist () {
      this.$emit('regist', 'Regist')
    },
    getCaptcha () {
      this.$message.warning('暂未开发')
    },
    // 选项卡改变的方法
    handleTabsChange (val) {
      this.activeKey = val
    },
    ...mapMutations({
      setToken: 'account/setToken',
      setExpireTime: 'account/setExpireTime',
      setPermissions: 'account/setPermissions',
      setRoles: 'account/setRoles',
      setUser: 'account/setUser',
      setTheme: 'setting/setTheme',
      setLayout: 'setting/setLayout',
      setMultipage: 'setting/setMultipage',
      fixSiderbar: 'setting/fixSiderbar',
      fixHeader: 'setting/fixHeader',
      setColor: 'setting/setColor'
    }),
    // Vuex store 是一个存储应用程序状态的容器，提供了一种集中式管理状态的机制，以便于状态的修改、访问和追踪
    saveLoginData (data) {
      this.setToken(data.token)
      this.setExpireTime(data.exipreTime)
      this.setUser(data.user)
      this.setPermissions(data.permissions)
      this.setRoles(data.roles)
      this.setTheme(data.config.theme)
      this.setLayout(data.config.layout)
      this.setMultipage(data.config.multiPage === '1')
      this.fixSiderbar(data.config.fixSiderbar === '1')
      this.fixHeader(data.config.fixHeader === '1')
      this.setColor(data.config.color)
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    .icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
</style>
