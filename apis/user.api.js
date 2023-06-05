import {myRequest} from "../config/request.config"
/**
 * 获取用户openid
 */
export const getOpenid=(code)=>{
  return myRequest("wechat/wx/getopenid?code="+code,null,'GET')
}