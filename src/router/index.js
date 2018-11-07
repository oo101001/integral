import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: resolve => require(['components/register'], resolve)
    },
    {
      path: '/',
      name: 'MyIntegral',
      component: resolve => require(['components/myIntegral'], resolve)
    },
    {
      path: '/rule',
      name: 'Rule',
      component: resolve => require(['components/rule'], resolve)
    },
    {
      path: '/withdraw',
      name: 'Withdraw',
      component: resolve => require(['components/withdraw'], resolve)
    }
  ]
})
