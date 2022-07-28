import request from '@/utils/request'
// 权限列表数据
export const getRightList = data => {
  return request({
    url: 'rights/list',
    data
  })
}

// 所有的权限点
export const getRightListPoint = data => {
  return request({
    url: 'rights/tree',
    data
  })
}
