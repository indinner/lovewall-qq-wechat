// pages/admin/audit/audit.js
import {selectSchool,selectPreviewImg,audit,selectAdminQID} from '../../../apis/wall.api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkData:[],
    schoolCode_index: 0,
    schoolCode:0,
    previewImgData:[],
    titles:[]
  },

  //一键复制文案
  copyText(){
    let titles=this.data.titles
    let str=''
    for(let i=0;i<titles.length;i++){
      str=str+'✨图'+(i+1)+'  #'+titles[i]+'\n'
    }
    console.log(str)
    wx.setClipboardData({
      data: str,
      success:res=>{
        this.setData({
          titles:[]
        })
      }
    })
  },

  //审核通过
  onPass(e){
    console.log(e.currentTarget.dataset.data)
    let that=this
    wx.showLoading({
      title: '正在下载...',
      mask:true
    })
    wx.downloadFile({
      url: e.currentTarget.dataset.data.url,
      success:res=>{
        console.log("图片下载成功",res)
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success(res) {
            console.log("保存到相册成功!")
            that.pass(e.currentTarget.dataset.data)
          }
        })
      },
      fail:err=>{
        wx.hideLoading()
      }
    })
  },
  async pass(data){
    let params={
      "openid": data.openid,
      "previewID": data.id,
      "status": 1
    }
    let res=await audit(params)
    console.log("通过结果:",res)
    if(res.data.code===200){
      let previewImgData=this.data.previewImgData
      const newPreviewImgData = previewImgData.filter(item => item.id !== data.id);
      this.setData({
        titles:this.data.titles.concat(data.title),
        previewImgData:newPreviewImgData
      })
    }
  },

  //驳回
  async onDelete(e){
    let data=e.currentTarget.dataset.data
    let params={
      "openid": data.openid,
      "previewID": data.id,
      "status": -1
    }
    let res=await audit(params)
    if(res.data.code===200){
      let previewImgData=this.data.previewImgData
      const newPreviewImgData = previewImgData.filter(item => item.id !== data.id);
      this.setData({
        previewImgData:newPreviewImgData
      })
    }
  },

  //查询学校
  async selectSchool(){
    let qidres=await selectAdminQID(wx.getStorageSync('openid'))
    if(qidres.data.code===200){
      let res=await selectSchool(qidres.data.data)
      console.log("学校查询结果：",res)
      if(res.data.code===200){
        this.setData({
          checkData:res.data.data,
          schoolCode:res.data.data[0].schoolCode
        })
        //查询稿件
        this.selectPreviewImg()
      }
    }
    
  },
  //查询待审核稿件
  async selectPreviewImg(){
    let params={
      "openid": wx.getStorageSync('openid'),
      "schoolCode": this.data.schoolCode,
      "status": 0
    }
    let res=await selectPreviewImg(params)
    if(res.data.code===200){
      this.setData({
        previewImgData:res.data.data
      })
    }
  },

  //预览图片
  previewImg(e){
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  },

  //选择校区
  onChange1(e) {
    this.setData({ schoolCode_index: e.detail.value });
    this.setData({ schoolCode: this.data.checkData[e.detail.value].schoolCode });
    this.selectPreviewImg()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.selectSchool()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})