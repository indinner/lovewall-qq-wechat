
export const baseUrl='https://wall.indinner.com/'
// export const baseUrl='http://10.100.158.131:8009/'


export const myRequest=(url,params,method)=>{
  return new Promise((resolve, reject)=>{
    wx.request({
      url: baseUrl+url,
      data:params,
      method:method||'POST',
      success:res=>{
        resolve(res)
      }
    })
  })
}