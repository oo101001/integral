<template>
  <transition name="slide">
    <div id="withdraw">
      <form class="form">
        <div class="content mt-10">
          <label>提款姓名:</label>
          <input type="text" placeholder="请输入您的姓名" v-model="name">
        </div>
        <div class="content mt-10">
          <label>银行卡号:</label>
          <input type="number" placeholder="请输入银行卡卡号" v-model="bankCard">
        </div>
        <div class="content">
          <label>开户行:</label>
          <input type="text" placeholder="列:建设银行滨江支行" v-model="openingBank">
        </div>
      </form>
      <div class="amount mt-10">
        <div class="withdraw-amount">可提现金额:{{this.sum_money}}元</div>
        <div class="content">
          <label>¥</label>
          <input type="number" v-model="withdrawAmount">
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
          <div class="icon-success"></div>
          <h1 class="text">{{withdrawTip}}</h1>
          <div class="hideBtn" @click="goBack">确定</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {getWithdrawConsumption, getWithdraw} from 'http/api'
import {debounce} from 'common/js/util'
import {ERR_OK} from 'http/config'

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
      consume: {},
      consume_state: null,
      consume_mes: '',
      isModal: false,
      withdrawTip: '',
      iconName: ''
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
  methods: {
    goBack () {
      this.isModal = false
      this.$router.back()
    },
    allIn () {
      this.withdrawAmount = this.sum_money
    },
    async submit () {
      let response = await getWithdraw({
        emp_id: this.emp_id,
        apply_money: this.withdrawAmount,
        card_sn: this.bankCard,
        bank_name: this.openingBank
      })
      if (response.state === 1) {
        this.withdrawTip = response.mess
        this.isModal = true
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
        border-bottom 1px solid #ccc
        background #fff
        label
          width 80px
          margin-left 15px
          font-size 15px
          color #232323
        input
          flex 1
          font-size 15px
          color #232323
          border none
        input:
        :-webkit-input-placeholder
          color #999
        input:focus
          outline none
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
        height 225px
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
          line-height 25px
          font-size 18px
          color #232323
        .hideBtn
          margin-top 47px
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
