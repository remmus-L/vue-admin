import request from '@/utils/request'
// 商品列表数据
export const getGoodsList = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'goods',
    params: { query, pagenum, pagesize }
  })
}
