import request from '@/utils/request'
// 商品列表数据
export const getRightList = data => {
  return request({
    url: 'rights/list',
    data
  })
}
