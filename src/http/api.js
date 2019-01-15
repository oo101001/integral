import axios from 'axios'

// const baseUrl = 'http://dev.lvtudiandian.com/'

export function login (params) {
  const url = '/index.php/integral/emp/login'

  const data = {
    account: params.account,
    password: params.password
  }

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getCoinInfo (params) {
  const url = '/index.php/integral/coin_info/get'

  const data = {
    emp_id: params.emp_id
  }

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getBill (params) {
  const url = '/index.php/integral/log/bill'

  const data = {
    emp_id: params.emp_id,
    time: params.time
  }

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getWithdrawConsumption (params) {
  const url = '/index.php/integral/coin/tip'

  const data = {
    emp_id: params.emp_id,
    apply_money: params.apply_money
  }

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getWithdraw (params) {
  const url = '/index.php/integral/coin/apply'

  const data = {
    emp_id: params.emp_id,
    emp_name: params.emp_name,
    apply_money: params.apply_money,
    card_sn: params.card_sn,
    bank_name: params.bank_name,
    mobile: params.mobile,
    mobile_code: params.mobile_code
  }

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function sendVCode (params) {
  const url = '/index.php/integral/mobile/sendCode'

  const data = {
    mobile: params.mobile
  }

  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}
