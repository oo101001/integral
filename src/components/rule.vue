<template>
  <transition name="slide">
    <div id="rule">
      <div class="rule-detail">
        <div class="content">
          <h1 class="title">积分获取:</h1>
          <p class="text">1.线下扫码一单+1积分;</p>
        </div>
        <div class="content">
          <h1 class="title">元宝获取:</h1>
          <p class="text">1.做任务活动获取;</p>
          <p class="text">2.通过专属链接下载APP获取;</p>
        </div>
        <div class="content">
          <h1 class="title">兑换规则:</h1>
          <p class="text">1.100元宝=1人民币;</p>
          <p class="text">2.请注意适时兑换, 参考比例: 元宝: 积分=1:1(每日都会有浮动);</p>
          <p class="text">3.提现的时候,提取100元宝;还需消耗100个积分;同时满足两个条件方可提现;</p>
        </div>
        <div class="content">
          <h1 class="title">提现步骤:</h1>
          <p class="text">1.绑定银行卡;</p>
          <p class="text">2.输入提现金额;</p>
          <p class="text">3.确认提现;</p>
        </div>
      </div>
      <p class="tip">提现金额将会在7个工作日之内打到你绑定的银行卡</p>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'rule'
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #rule
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background #fff
    .rule-detail
      margin 21px 22px 20px
      .content
        margin-bottom 20px
        .title
          font-size 15px
          color #FF0D0D
        .text
          line-height 16px
          font-size 13px
          color #232323
          text-indent 10px
    .tip
      padding-top 10px
      text-align center
      font-size 11px
      color #999
  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
