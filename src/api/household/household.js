import request from '@/utils/request'

// 查询户口本列表
export function listHousehold(query) {
  return request({
    url: '/household/household/list',
    method: 'get',
    params: query
  })
}

// 查询户口本详细
export function getHousehold(id) {
  return request({
    url: '/household/household/' + id,
    method: 'get'
  })
}

// 新增户口本
export function addHousehold(data) {
  return request({
    url: '/household/household',
    method: 'post',
    data: data
  })
}

// 修改户口本
export function updateHousehold(data) {
  return request({
    url: '/household/household',
    method: 'put',
    data: data
  })
}

// 删除户口本
export function delHousehold(id) {
  return request({
    url: '/household/household/' + id,
    method: 'delete'
  })
}
