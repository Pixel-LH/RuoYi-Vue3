import request from '@/utils/request'

// 查询血型信息管理列表
export function listBlood(query) {
  return request({
    url: '/baseinfo/blood/list',
    method: 'get',
    params: query
  })
}

// 查询血型信息管理详细
export function getBlood(bloodId) {
  return request({
    url: '/baseinfo/blood/' + bloodId,
    method: 'get'
  })
}

// 新增血型信息管理
export function addBlood(data) {
  return request({
    url: '/baseinfo/blood',
    method: 'post',
    data: data
  })
}

// 修改血型信息管理
export function updateBlood(data) {
  return request({
    url: '/baseinfo/blood',
    method: 'put',
    data: data
  })
}

// 删除血型信息管理
export function delBlood(bloodId) {
  return request({
    url: '/baseinfo/blood/' + bloodId,
    method: 'delete'
  })
}
