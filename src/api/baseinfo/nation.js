import request from '@/utils/request'

// 查询民族信息管理列表
export function listNation(query) {
  return request({
    url: '/baseinfo/nation/list',
    method: 'get',
    params: query
  })
}

// 查询民族信息管理详细
export function getNation(nationId) {
  return request({
    url: '/baseinfo/nation/' + nationId,
    method: 'get'
  })
}

// 新增民族信息管理
export function addNation(data) {
  return request({
    url: '/baseinfo/nation',
    method: 'post',
    data: data
  })
}

// 修改民族信息管理
export function updateNation(data) {
  return request({
    url: '/baseinfo/nation',
    method: 'put',
    data: data
  })
}

// 删除民族信息管理
export function delNation(nationId) {
  return request({
    url: '/baseinfo/nation/' + nationId,
    method: 'delete'
  })
}
