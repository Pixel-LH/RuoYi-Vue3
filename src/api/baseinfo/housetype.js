import request from '@/utils/request'

// 查询房屋类型信息管理列表
export function listHousetype(query) {
  return request({
    url: '/baseinfo/housetype/list',
    method: 'get',
    params: query
  })
}

// 查询房屋类型信息管理详细
export function getHousetype(housetypeId) {
  return request({
    url: '/baseinfo/housetype/' + housetypeId,
    method: 'get'
  })
}

// 新增房屋类型信息管理
export function addHousetype(data) {
  return request({
    url: '/baseinfo/housetype',
    method: 'post',
    data: data
  })
}

// 修改房屋类型信息管理
export function updateHousetype(data) {
  return request({
    url: '/baseinfo/housetype',
    method: 'put',
    data: data
  })
}

// 删除房屋类型信息管理
export function delHousetype(housetypeId) {
  return request({
    url: '/baseinfo/housetype/' + housetypeId,
    method: 'delete'
  })
}
