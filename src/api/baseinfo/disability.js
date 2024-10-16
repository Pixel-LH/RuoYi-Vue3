import request from '@/utils/request'

// 查询残疾情况信息管理列表
export function listDisability(query) {
  return request({
    url: '/baseinfo/disability/list',
    method: 'get',
    params: query
  })
}

// 查询残疾情况信息管理详细
export function getDisability(disabilityId) {
  return request({
    url: '/baseinfo/disability/' + disabilityId,
    method: 'get'
  })
}

// 新增残疾情况信息管理
export function addDisability(data) {
  return request({
    url: '/baseinfo/disability',
    method: 'post',
    data: data
  })
}

// 修改残疾情况信息管理
export function updateDisability(data) {
  return request({
    url: '/baseinfo/disability',
    method: 'put',
    data: data
  })
}

// 删除残疾情况信息管理
export function delDisability(disabilityId) {
  return request({
    url: '/baseinfo/disability/' + disabilityId,
    method: 'delete'
  })
}
