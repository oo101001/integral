<template>
  <transition name="slide">
    <div id="withdraw">
      <form class="form">
        <div class="content mt-10">
          <label>提款姓名:</label>
          <input type="text" placeholder="请输入收款人姓名" v-model="name">
        </div>
        <div class="content">
          <label>银行卡号:</label>
          <input type="number" placeholder="请输入银行卡卡号" v-model="bankCard">
        </div>
        <div class="content">
          <label>开户行:</label>
          <input type="text" placeholder="例:建设银行滨江支行" v-model="openingBank">
        </div>
        <div class="content">
          <label>手机号:</label>
          <div class="phone">{{phone}}</div>
        </div>
        <div class="content last tipHeight">
          <label></label>
          <p>温馨提示：目前只支持餐服长本人手机验证提现。如果以上号码不是餐服长本人的联系方式，请在工作日致电,0571-86293510进行修改审核!</p>
        </div>
        <div class="content last">
          <label>验证码:</label>
          <input type="number" placeholder="请输入验证码" v-model="vcode">
          <div class="getVCode" @click.stop="sendVCode">
            <input type="button" :value="countDown" :disabled="isClick">
          </div>
        </div>
      </form>
      <div class="amount mt-10">
        <div class="withdraw-amount">可提现金额:{{this.sum_money}}元</div>
        <div class="content">
          <label>¥</label>
          <input type="number" v-model="withdrawAmount" @input="oninput">
          <Button type="error" @click="allIn">全部提现</Button>
        </div>
        <div class="tip">
          <span class="text">{{consume_mes}}</span>
        </div>
      </div>
      <div class="withdrawBtn">
        <button :disabled="disabled" @click="submit" :class="disabled ? 'opacity-hide':'opacity-show'">提现</button>
      </div>
      <div class="modal" v-show="isModal">
        <div class="content">
          <div class="icon-success" v-show="hasIcon"></div>
          <h1 class="text">{{withdrawTip}}</h1>
          <div class="hideBtn" @click="hideModal" v-show="!isGoBack">确定</div>
          <div class="hideBtn" @click="goBack" v-show="isGoBack">确定</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {getWithdrawConsumption, getWithdraw, sendVCode} from 'http/api'
import {debounce} from 'common/js/util'
import {ERR_OK} from 'http/config'

const CODE_OK = 1

export default {
  name: 'withdraw',
  data () {
    return {
      name: '',
      bankCard: '',
      openingBank: '',
      withdrawAmount: '',
      disabled: true,
      sum_money: this.$route.params.sum_money,
      emp_id: this.$route.params.emp_id,
      phone: this.$route.params.phone,
      consume: {},
      consume_state: null,
      consume_mes: '',
      isModal: false,
      withdrawTip: '',
      iconName: '',
      SalePrice: '',
      cvodeTip: '发送验证码',
      count: 60,
      timer: '',
      isClick: false,
      hasIcon: false,
      vcode: '',
      isGoBack: false
    }
  },
  created () {
    if (!this.emp_id) {
      this.$router.back()
    }
    this.$watch('withdrawAmount', debounce((newSearchText) => {
      if (newSearchText < 1) {
        this.consume_mes = '提现金额不能低于1元'
        this.disabled = true
        return
      }
      this._getConsumeTip(newSearchText)
    }, 200))
  },
  computed: {
    countDown () {
      return this.count !== 60 ? `${this.count}s` : `发送验证码`
    }
  },
  methods: {
    async sendVCode () {
      this.isClick = true
      let response = await sendVCode({mobile: this.phone})
      if (response.state === CODE_OK) {
        this.timer = setInterval(() => {
          if (this.count > 1) {
            this.count--
            this.isClick = true
          } else {
            this.count = 60
            clearInterval(this.timer)
            this.isClick = false
          }
        }, 1000)
      } else {
        this.isClick = false
        this.withdrawTip = response.mess
        this.isModal = true
      }
    },
    oninput (e) {
      this.withdrawAmount = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    goBack () {
      this.isModal = false
      this.$router.back()
    },
    hideModal () {
      this.isModal = false
    },
    allIn () {
      this.withdrawAmount = this.sum_money
    },
    async submit () {
      let response = await getWithdraw({
        emp_id: this.emp_id,
        emp_name: this.name,
        apply_money: this.withdrawAmount,
        card_sn: this.bankCard,
        bank_name: this.openingBank,
        mobile: this.phone,
        mobile_code: this.vcode
      })
      if (response.state === ERR_OK) {
        this.withdrawTip = response.mess
        this.hasIcon = true
        this.isModal = true
        this.isGoBack = true
      } else {
        this.withdrawTip = response.mess
        this.isModal = true
        this.isGoBack = false
      }
    },
    checkSubmit () {
      if (this.name && this.bankCard && this.openingBank && this.withdrawAmount && this.consume_state === 1) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    async _getConsumeTip (amount) {
      let response = await getWithdrawConsumption({
        emp_id: this.emp_id,
        apply_money: amount
      })
      if (response.state === ERR_OK) {
        this.consume = response.data
        this.consume_state = response.state
        this.consume_mes = `消耗元宝${response.data.consumption_coin};积分${response.data.consumption_integral}`
      } else {
        this.consume_state = response.state
        this.consume_mes = response.mess
      }
      this.checkSubmit()
    }
  },
  watch: {
    name () {
      this.checkSubmit()
    },
    bankCard () {
      this.checkSubmit()
    },
    openingBank () {
      this.checkSubmit()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/mixin'

  #withdraw
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background #f9f9f9
    form
      .content
        display flex
        align-items center
        height 40px
        background #fff
        label
          width 80px
          margin-left 15px
          font-size 15px
          color #232323
        input, p, .phone
          flex 1
          height 100%
          font-size 15px
          color #232323
          border none
          border-radius 0
          border-bottom 1px solid #ccc
          background #fff
        .phone
          line-height 40px
        p
          display flex
          align-items center
          color #999
          font-size 9px
          border-bottom none
        input:
        :-webkit-input-placeholder
          color #999
        input:focus
          outline none
      .last
        border-bottom 1px solid #ccc
        input
          border-bottom none
        .getVCode
          width 80px
          text-align center
          input[type=button]
            font-size 15px
            color #237AD2
            border 0
            border-radius 0
            background #fff
      .tipHeight
        height 50px
    .amount
      padding 15px 20px 0
      background #fff
      .withdraw-amount
        margin-bottom 10px
        font-size 15px
        color #232323
      .content
        display flex
        justify-content space-between
        align-items center
        height 56px
        border-bottom 1px solid #707070
        label
          margin-right 10px
          font-size 40px
          color #232323
        input
          flex 1
          width 150px
          font-size 35px
          color #232323
          border none
        input:focus
          outline none
        button
          font-size 13px
          color #fff
          background #FE5460
      .tip
        height 45px
        line-height 45px
        font-size 13px
        color #FE5460
    .withdrawBtn
      margin 40px 38px 0
      button
        width 100%
        height 40px
        border-radius 4px
        font-size 18px
        color #fff
        border none
        background rgba(254, 84, 96, 1)
      button:focus
        outline none
      .opacity-show
        opacity 1
      .opacity-hide
        opacity .3
    .modal
      position fixed
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      background transparent
      .content
        position absolute
        top 30%
        left 50%
        transform translateX(-50%)
        width 262px
        text-align center
        box-shadow 0px 3px 6px rgba(0, 0, 0, 0.2)
        border-radius 4px
        background rgba(255, 255, 255, 1)
        i
          margin-top 25px
          font-size 64px
        .icon-success
          width 64px
          height 64px
          margin 30px auto 0
          bg-image('success')
          background-size cover
        .text
          margin-top 10px
          padding: 28px 40px 0
          line-height 25px
          font-size 18px
          color #232323
        .hideBtn
          margin-top 47px
          margin-bottom 30px
          line-height 20px
          font-size 14px
          color #FE5460
    .mt-10
      margin-top 10px

  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
