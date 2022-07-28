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

// 编辑角色  给了啥参数就传啥参数
export const editRole = ({ id, roleName, roleDesc }) => {
  return request({
    method: 'PUT',
    url: `/roles/${id}`,
    data: { id, roleName, roleDesc }
  })
}

// 删除角色指定权限（第一列打开里面的）
export const delAppointRole = ({ roleId, rightId }) => {
  return request({
    method: 'DELETE',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
// 角色授权

export const setRight = ({ roleId, rids }) => {
  return request({
    method: 'POST',
    url: `roles/${roleId}/rights`,
    data: { roleId, rids }
  })
}
// 分配用户角色

export const assignRole = ({ id, rid }) => {
  return request({
    method: 'PUT',
    url: `users/${id}/role`,
    data: { id, rid }
  })
}
