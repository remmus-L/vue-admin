import request from '@/utils/request'

/**
 * 获取左侧列表
 * @param {*} param0
 * @returns
 */
export const getMenuList = () => {
  return request({
    url: 'menus'
  })
}
