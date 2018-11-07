import storage from 'good-storage'

const USER_INFO = '__userInfo__'

export function saveUserInfo (userInfo) {
  storage.set(USER_INFO, userInfo)
}

export function loadUserInfo () {
  return storage.get(USER_INFO, [])
}
