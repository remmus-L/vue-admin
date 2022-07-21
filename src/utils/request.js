import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://liufusong.top:8899/api/private/v1/',
  timeout: 8000
})

//! 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (store.state.user) {
    config.headers = {
      Authorization: store.state.user
    }
  }
  // 成功时就return config
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
export default request
