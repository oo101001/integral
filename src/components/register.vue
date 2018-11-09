<template>
  <div id="register">
    <div class="logo"></div>
    <form class="form">
      <div class="border-b">
        <Input type="text" placeholder="账号" v-model="account" class="account"/>
      </div>
      <div class="password border-b">
        <Input type="password" placeholder="密码" v-model="password" v-show="!isEye"/>
        <Input type="text" placeholder="密码" v-model="password" v-show="isEye"/>
        <Icon :type="eyeType" @click="toggleEye"/>
      </div>
      <div class="vcode border-b">
        <Input type="text" placeholder="验证码" v-model="vCode"/>
        <div class="content" @click="refresh">{{random}}</div>
      </div>
      <div class="tip">
        <span class="text" v-show="isTip">{{tip}}</span>
      </div>
      <Button type="success"
              :disabled="disabled"
              :class="disabled ? 'opacity-hide':'opacity-show'"
              @click="submit"
              long
      >登录
      </Button>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
import {login} from 'http/api'
import {saveUserInfo} from 'common/js/cache'

export default {
  name: 'register',
  data () {
    return {
      account: '',
      password: '',
      vCode: '',
      isEye: false,
      disabled: true,
      tip: '',
      isTip: true,
      random: null
    }
  },
  computed: {
    eyeType () {
      return this.isEye === true ? 'ios-eye' : 'ios-eye-off'
    }
  },
  created () {
    this.random = this.randomVCode()
  },
  methods: {
    refresh () {
      this.random = this.randomVCode()
    },
    randomVCode () {
      let random = Math.floor(Math.random() * 10000)
      if (random < 1000) {
        random = '0' + random
      }
      return random.toString()
    },
    toggleEye () {
      this.isEye = !this.isEye
    },
    async submit () {
      let isPhone = this._checkPhone(this.account)
      let isVCode = this._checkVCode()
      if (!isPhone) {
        this.tip = '手机号输入有误,请重新输入'
        return
      }
      if (!isVCode) {
        this.tip = '验证码输入有误,请重新输入'
        return
      }
      this.isTip = false
      let response = await login({
        account: this.account,
        password: this.password
      })
      if (response.state === 1) {
        this.isTip = false
        saveUserInfo(response.data)
        this.$router.push(`/?emp_id=${response.data.id}`)
      } else {
        this.isTip = true
        this.tip = response.mess
      }
    },
    _checkSubmit () {
      if (this.account && this.password && this.vCode) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    _checkPhone (phoneNum) {
      const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      return phoneReg.test(phoneNum)
    },
    _checkVCode () {
      if (this.vCode === this.random) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    account () {
      this._checkSubmit()
    },
    password () {
      this._checkSubmit()
    },
    vCode () {
      this._checkSubmit()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  #register
    .logo
      width: 86px
      height: 86px
      margin: 49px auto 0
      bg-image('logo')
      background-size cover
    .form
      margin: 40px 38px 0
      input
        border: none
        border-radius 0
        font-size 15px
        color #232323
      input:
      :-webkit-input-placeholder
        color #999
      input:focus
        outline none
        border none
        box-shadow none
      input[type=password], input[placeholder="验证码"]
        margin-top: 15px
      .border-b
        border-bottom: 1px solid #DEDEDE
      .password, .vcode
        display flex
        justify-content space-between
        align-items center
        i
          font-size 22px
        input[type=text]
          margin-top: 15px
        .content
          flex 1
          height 30px
          line-height 30px
          margin-top: 15px
          padding 0 10px
          border-left 1px solid #DEDEDE
      .tip
        height 50px
        line-height 50px
        padding-left 7px
        font-size 13px
        color #FE5460
      button
        width 100%
        height 40px
        border-radius 4px
        font-size 18px
        color #fff
        border none
        background rgba(254, 84, 96, 1)
      button:focus
        box-shadow none
      .opacity-show
        opacity 1
      .opacity-hide
        opacity .3
</style>
