// pages/previewImg/previewImg.js
import {createPreviewImg,toMessage} from '../../apis/wall.api'
import Toast,{hideToast} from 'tdesign-miniprogram/toast/index';
import Dialog from 'tdesign-miniprogram/dialog/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isurl:false,
    url:'',
    createPreviewImgData:{},
    bgColor:1,
    bgColors:[
      {
        color1:'ee9ca7',
        color2:'ffdde1',
      },
      {
        color1:'83a4d4',
        color2:'b6fbff',
      },
      {
        color1:'757f9a',
        color2:'d7dde8',
      },
      {
        color1:'70e1f5',
        color2:'ffd194',
      },
      {
        color1:'9796f0',
        color2:'fbc7d4',
      }
    ]
  },

  //切换颜色
  checkColor(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      bgColor:e.currentTarget.dataset.index+1
    })
    this.initCreatePreviewImgData()
  },

  //发布
  toMessage(){

    /**
     * 订阅授权
     */
    wx.requestSubscribeMessage({
      tmplIds:['73yl4Y19ZQYRFlr_r0KPmXbkLCHCjKWywfTrVExTBok'],
      success:res=>{
        if(res['73yl4Y19ZQYRFlr_r0KPmXbkLCHCjKWywfTrVExTBok']==='accept'){
          //提交到后台审核
          this.toMessageApi()
        }
      }
    })
  },
  //提交审核
  async toMessageApi(){
    let data=this.data.createPreviewImgData
    data.url=this.data.url
    let openid=wx.getStorageSync('openid')
    data.openid=openid
    console.log(data)
    Toast({
      context: this,
      preventScrollThrough: true,
      selector: '#t-toast',
      duration:0,
      message: '正在发送...',
      theme: 'loading',
      direction: 'column'
    });
    let res=await toMessage(data)
    console.log(res)
    if(res.data.code===200){
      hideToast({
        context: this,
        selector: '#t-toast',
      });
      //成功提交给管理员审核
      this.showDialog(res.data.data)
    }else{
      hideToast({
        context: this,
        selector: '#t-toast',
      });
      const dialogConfig = {
        context: this,
        content: '发布失败,请重试',
        confirmBtn: '确定',
      };
  
      Dialog.confirm(dialogConfig)
        .then(() => {})
        .catch(() => console.log('点击了取消'))
        .finally(() => Dialog.close());
    }
  },

  //通知对话框
  showDialog(successMsg) {
    const dialogConfig = {
      context: this,
      content: successMsg,
      confirmBtn: '确定',
    };

    Dialog.confirm(dialogConfig)
      .then(() => {
        wx.removeStorageSync('createPreviewImageData')
        wx.reLaunch({
          url: '../index/index'
        })
      })
      .catch(() => console.log('点击了取消'))
      .finally(() => Dialog.close());
  },

  //返回
  back(){
    wx.navigateBack()
  },
  //从缓存初始化要预览的数据
  async initCreatePreviewImgData(){
    let params=wx.getStorageSync('createPreviewImageData')
    params=JSON.parse(params)
    params.bgColor=String(this.data.bgColor)
    console.log("数据初始化如下：",params)
    this.setData({
      createPreviewImgData:params
    })
    Toast({
      context: this,
      preventScrollThrough: true,
      selector: '#t-toast',
      duration:0,
      message: '图片生成中...',
      theme: 'loading',
      direction: 'column'
    });
    let res=await createPreviewImg(params)
    console.log("预览结果:",res)
    if(res.data.code===200){
      this.setData({
        isurl:true,
        url:res.data.data
      })
      hideToast({
        context: this,
        selector: '#t-toast',
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initCreatePreviewImgData()
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