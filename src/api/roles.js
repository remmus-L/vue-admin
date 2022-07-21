import request from '@/utils/request'
// 商品列表数据
export const getRolesList = () => {
  return request({
    url: 'roles'
  })
}
