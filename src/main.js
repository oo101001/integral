import 'babel-polyfill'
import Vue from 'vue'
import Es6Promise from 'es6-promise'
import App from './App'
import router from './router'
import {Button, Radio, Icon, Input, Carousel, CarouselItem} from 'iview'

Es6Promise.polyfill()

Vue.component('Button', Button)
Vue.component('Radio', Radio)
Vue.component('Icon', Icon)
Vue.component('Input', Input)
Vue.component('Carousel', Carousel)
Vue.component('CarouselItem', CarouselItem)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
