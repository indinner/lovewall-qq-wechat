// app.js
import {getOpenid} from "./apis/user.api"

App({
  onLaunch() {
    wx.setStorageSync('url_value', 'label_1')
    this.getOpenid()
  },
  getOpenid(callback){
    if(wx.getStorageSync('openid')){
      callback && callback(wx.getStorageSync('openid'))
      return
    }
    // 登录
    wx.login({
      success: res => {
        getOpenid(res.code)
        .then((res)=>{
          console.log("openid获取如下：",res)
          if(res.data.code===200){
            wx.setStorageSync('openid', res.data.data)
            callback && callback(wx.getStorageSync('openid'))
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
