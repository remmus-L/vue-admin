import request from '@/utils/request'

/**
 * 登录
 * @param {*} param0
 * @returns
 */
export const login = ({ username, password }) => {
  return request({
    method: 'POST',
    url: 'login',
    data: {
      username,
      password
    }
  })
}

// 用户列表数据
export const getUsersList = ({ pagenum, pagesize }) => {
  return request({
    url: 'users',
    params: { pagenum, pagesize }
  })
}
