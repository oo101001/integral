<template>
  <transition name="slide">
    <div class="wrapper" ref="wrapper">
      <div id="myIntegral">
        <Carousel  v-model="value" loop class="carousel"
                   :autoplaySpeed="setting.autoplaySpeed"
                   :dots="setting.dots"
                   :radiusDot="setting.radiusDot"
                   :arrow="setting.arrow"
        >
          <CarouselItem>
            <div class="demo-carousel">
              <img src="../common/images/banner_01@2x.jpg">
            </div>
          </CarouselItem>
        </Carousel>
        <div class="withdrawals">
          <div class="rules">
            <div class="text">
              <h2 class="title">兑换比例</h2>
              <p class="desc">今日提现元宝,消耗积分比例<span class="scale">{{coin_info.integral_rate_format}}</span></p>
            </div>
            <div class="rulesBtn" @click="goRule">
              规则<Icon type="ios-arrow-forward" />
            </div>
          </div>
          <div class="integral-show">
            <div class="integral">
              <div class="icon-integral"></div>
              <p class="text">我的积分:<span>{{coin_info.integral === null ? 0 : coin_info.integral}}</span></p>
            </div>
            <div class="ingot">
              <div class="icon-ingot"></div>
              <p class="text">我的元宝:<span>{{coin_info.coin === null ? 0 : coin_info.coin}}</span></p>
            </div>
          </div>
          <div class="withdraw" @click="goWithdraw">
            <Button type="success" long>提现</Button>
          </div>
        </div>
        <div class="line"></div>
        <div class="bill">
          <h1 class="title">账单</h1>
          <ul class="bill-detail" v-for="(item, index) in bill_info" :key="index">
            <li class="detail">
              <div class="desc">
                <div class="type">
                  <div class="type-text">{{item.type_name}}</div>
                  <div class="state">{{item.status_name}}</div>
                </div>
                <div class="time">
                  <div class="date">{{item.create_date.substring(0, 10)}}</div>
                  <div class="minutes">{{item.create_date.substring(11, 18)}}</div>
                </div>
              </div>
              <div class="amount">{{item.status_name === '增加' ? '+' + item.num : item.num}}</div>
            </li>
          </ul>
        </div>
        <div class="loading" v-show="hasMore">
          <img src="../common/images/loading.gif" width="24" height="24">
          <p class="desc">正在载入...</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {getCoinInfo, getBill} from 'http/api'
import {ERR_OK} from 'http/config'
import {loadUserInfo} from 'common/js/cache'

export default {
  name: 'myIntegral',
  data () {
    return {
      value: 0,
      setting: {
        autoplaySpeed: 3000,
        dots: 'none',
        radiusDot: true,
        trigger: 'click',
        arrow: 'never'
      },
      coin_info: {},
      bill_info: {},
      isFirst: true,
      billLength: -1,
      hasMore: false
    }
  },
  created () {
    this.id = loadUserInfo().id
    this._getCoinInfo()
    this._getBill()
    if (!this.$route.query.emp_id) {
      this.$router.push('/register')
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    goRule () {
      this.$router.push('/rule')
    },
    goWithdraw () {
      this.$router.push({
        name: 'Withdraw',
        params: {
          emp_id: this.$route.query.emp_id || this.id,
          sum_money: this.coin_info.sum_money
        }
      })
    },
    async _getCoinInfo () {
      let response = await getCoinInfo({emp_id: this.$route.query.emp_id || this.id})
      if (response.state === ERR_OK) {
        this.coin_info = response.data
      }
    },
    async _getBill () {
      this.hasMore = true
      let response = await getBill({
        emp_id: this.$route.query.emp_id || this.id,
        time: this.time
      })
      if (response.state === ERR_OK) {
        setTimeout(() => {
          this.hasMore = false
          if (this.isFirst) {
            this.bill_info = response.data
            this.isFirst = false
          } else {
            this.bill_info = this.bill_info.concat(response.data)
            if (response.data.length === 0) {
              return
            }
          }
          this.billLength = response.data.length - 1
          this.time = response.data[this.billLength].create_time
        }, 1000)
      }
    },
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: true,
          pullup: true
        })
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this._getBill()
            this.scroll && this.scroll.refresh()
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/mixin'

  .wrapper
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    #myIntegral
      .carousel
        width 100%
        height 120px
        .demo-carousel
          img
            width 100%
            height 100%
    .withdrawals
        margin 20px 15px 20px
        .rules
          display flex
          justify-content space-between
          .text
            .title
              font-size 18px
              color #333
            .desc
              font-size 13px
              color #999
              .scale
                color #FE5460
          .rulesBtn
            margin-top 3px
            font-size 13px
            color #999
            i
              font-size 16px
              vertical-align text-bottom
        .integral-show
          display flex
          justify-content center
          margin-top 26px
          .text
            line-height 25px
            font-size 13px
            color #999
            span
              font-size 18px
              color #333
          .integral
            margin-right 58px
            .icon-integral
              width 34px
              height 34px
              margin 0 auto 3px
              bg-image('integral')
              background-size cover
          .ingot
            .icon-ingot
              width 34px
              height 34px
              margin 0 auto 3px
              bg-image('ingot')
              background-size cover
        .withdraw
          margin 27px 23px 0
          button
            height 40px
            font-size 18px
            color #fff
            background #FE5460
            border-color #FE5460
      .line
        width 100%
        height 10px
        background #f9f9f9
      .bill
        margin 0 15px
        .title
          height 50px
          border-bottom 1px solid #ccc
          line-height 50px
          color #232323
          font-size 18px
        .bill-detail
          .detail
            display flex
            justify-content space-between
            align-items center
            height 55px
            border-bottom 1px solid #f4f4f4
            .desc
              flex 1
              .type
                display flex
                justify-content space-between
                width 105px
                .type-text
                  font-size 15px
                  color #333
                .state
                  display inline-flex
                  align-items flex-end
                  font-size 11px
                  color #707070
              .time
                display flex
                justify-content space-between
                width 105px
                font-size 11px
                color #999
            .amount
              font-size 18px
              color #333
      .loading
        width 100%
        text-align center
        .desc
          line-height 20px
          font-size 13px
          color #666
  .slide-enter-active, .slide-leave-active
    transition: all .3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
