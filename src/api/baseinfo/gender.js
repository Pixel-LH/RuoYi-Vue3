import request from '@/utils/request'

// 查询性别信息管理列表
export function listGender(query) {
  return request({
    url: '/baseinfo/gender/list',
    method: 'get',
    params: query
  })
}

// 查询性别信息管理详细
export function getGender(genderId) {
  return request({
    url: '/baseinfo/gender/' + genderId,
    method: 'get'
  })
}

// 新增性别信息管理
export function addGender(data) {
  return request({
    url: '/baseinfo/gender',
    method: 'post',
    data: data
  })
}

// 修改性别信息管理
export function updateGender(data) {
  return request({
    url: '/baseinfo/gender',
    method: 'put',
    data: data
  })
}

// 删除性别信息管理
export function delGender(genderId) {
  return request({
    url: '/baseinfo/gender/' + genderId,
    method: 'delete'
  })
}
