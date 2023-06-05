import {myRequest} from "../config/request.config"

/**
 * 生成预览图
 */
export const createPreviewImg=(params)=>{
  return myRequest("wall/createPreviewImg",params,'POST')
}

/**
 * 发布稿件
 */
export const toMessage=(params)=>{
  return myRequest("wall/toMessage",params,'POST')
}

/**
 * 查询学校
 */
export const selectSchool=(params)=>{
  return myRequest("wall/selectSchool?adminID="+params,null,'GET')
}

/**
 * 查询稿件
 */
export const selectPreviewImg=(params)=>{
  return myRequest("wall/selectPreviewImg",params,'POST')
}

/**
 * 审核
 */
export const audit=(params)=>{
  return myRequest("wall/audit",params,'POST')
}

/**
 * 判断管理员
 */
export const isAdmin=(params)=>{
  return myRequest("wall/isAdmin?openid="+params,null,'GET')
}

/**
 * 绑定用户QID
 */
export const addUser=(openid,QID)=>{
  return myRequest("wall/addUser?openid="+openid+'&QID='+QID,null,'GET')
}

/**
 * 查询用户QID
 */
export const selectQID=(openid)=>{
  return myRequest("wall/selectQID?openid="+openid,null,'GET')
}

/**
 * 查询管理员绑定的QID
 */
export const selectAdminQID=(openid)=>{
  return myRequest("wall/selectAdminQID?openid="+openid,null,'GET')
}
