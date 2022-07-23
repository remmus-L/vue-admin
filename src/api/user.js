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
export const getUsersList = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'users',
    params: { query, pagenum, pagesize }
  })
}

// 添加用户
export const addUser = ({ username, password, email, mobile }) => {
  return request({
    method: 'POST',
    url: 'users',
    data: { username, password, email, mobile }
  })
}

// 删除单个用户
export const delUser = id => {
  return request({
    method: 'DELETE',
    url: `/users/${id}`
  })
}
// 编辑用户  给了啥参数就传啥参数
export const editUser = ({ id, email, mobile }) => {
  return request({
    method: 'PUT',
    url: `/users/${id}`,
    data: { id, email, mobile }
  })
}

// 分配角色
