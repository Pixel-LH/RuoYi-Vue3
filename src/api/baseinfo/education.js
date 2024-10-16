import request from '@/utils/request'

// 查询文化程度信息管理列表
export function listEducation(query) {
  return request({
    url: '/baseinfo/education/list',
    method: 'get',
    params: query
  })
}

// 查询文化程度信息管理详细
export function getEducation(educationId) {
  return request({
    url: '/baseinfo/education/' + educationId,
    method: 'get'
  })
}

// 新增文化程度信息管理
export function addEducation(data) {
  return request({
    url: '/baseinfo/education',
    method: 'post',
    data: data
  })
}

// 修改文化程度信息管理
export function updateEducation(data) {
  return request({
    url: '/baseinfo/education',
    method: 'put',
    data: data
  })
}

// 删除文化程度信息管理
export function delEducation(educationId) {
  return request({
    url: '/baseinfo/education/' + educationId,
    method: 'delete'
  })
}
