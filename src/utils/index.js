
// 用于处理把普通数组变成树形结构  递归
// list中每一项有两个属性 id,pid
export function tranferListToTree (list, pid) {
  const list1 = []
  list.forEach(item => {
    if (item.pid === pid) {
      list1.push(item)
      item.children = tranferListToTree(list, item.id)
    }
  })
  return list1
}
