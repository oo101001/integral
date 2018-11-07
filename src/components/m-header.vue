<template>
  <div id="title">
    <div class="back" @click="goBack">
      <!--<Icon type="ios-arrow-back" class="icon-back" />-->
    </div>
    <h1 class="text" v-html="title"></h1>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"

  #title
    width: 100%
    height: 40px
    border-bottom 1px solid #f4f4f4
    background #fff
    .back
      position absolute
      top: -3px
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: 22px
        color: #000
    .text
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: 18px
      color: #232323
</style>
