import request from '@/utils/request'
// 商品列表数据
export const getGoodsList = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'goods',
    params: { query, pagenum, pagesize }
  })
}
// 删除商品
export const delGoods = id => {
  return request({
    method: 'DELETE',
    url: `goods/${id}`
  })
}
