import request from '@/utils/request'
// 角色列表数据
export const getRolesList = () => {
  return request({
    url: 'roles'
  })
}
// 删除角色
export const delRole = id => {
  return request({
    method: 'DELETE',
    url: `/roles/${id}`
  })
}

// 添加角色
export const addRole = ({ roleName, roleDesc }) => {
  return request({
    method: 'POST',
    url: 'roles',
    data: { roleName, roleDesc }
  })
}
// 编辑角色
// 编辑用户  给了啥参数就传啥参数
export const editRole = ({ id, roleName, roleDesc }) => {
  return request({
    method: 'PUT',
    url: `/roles/${id}`,
    data: { id, roleName, roleDesc }
  })
}
