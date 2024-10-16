import request from '@/utils/request'

// 查询存储派出所信息列表
export function listStation(query) {
  return request({
    url: '/police/station/list',
    method: 'get',
    params: query
  })
}

// 查询存储派出所信息详细
export function getStation(pid) {
  return request({
    url: '/police/station/' + pid,
    method: 'get'
  })
}

// 新增存储派出所信息
export function addStation(data) {
  return request({
    url: '/police/station',
    method: 'post',
    data: data
  })
}

// 修改存储派出所信息
export function updateStation(data) {
  return request({
    url: '/police/station',
    method: 'put',
    data: data
  })
}

// 删除存储派出所信息
export function delStation(pid) {
  return request({
    url: '/police/station/' + pid,
    method: 'delete'
  })
}
