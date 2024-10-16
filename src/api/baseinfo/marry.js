import request from '@/utils/request'

// 查询婚姻状况信息管理列表
export function listMarry(query) {
  return request({
    url: '/baseinfo/marry/list',
    method: 'get',
    params: query
  })
}

// 查询婚姻状况信息管理详细
export function getMarry(marryId) {
  return request({
    url: '/baseinfo/marry/' + marryId,
    method: 'get'
  })
}

// 新增婚姻状况信息管理
export function addMarry(data) {
  return request({
    url: '/baseinfo/marry',
    method: 'post',
    data: data
  })
}

// 修改婚姻状况信息管理
export function updateMarry(data) {
  return request({
    url: '/baseinfo/marry',
    method: 'put',
    data: data
  })
}

// 删除婚姻状况信息管理
export function delMarry(marryId) {
  return request({
    url: '/baseinfo/marry/' + marryId,
    method: 'delete'
  })
}
