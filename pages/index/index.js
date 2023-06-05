// pages/index/index.js
import {uploadFile} from '../../apis/uploadfile.api'
import Message from 'tdesign-miniprogram/message/index';
import {selectSchool,addUser,selectQID} from '../../apis/wall.api'
import Toast from 'tdesign-miniprogram/toast/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originFiles: [],
    gridConfig: {
      column: 4,
      width: 160,
      height: 160,
    },
    config: {
      count: 4,
    },
    tags:[
      {
        checked:false,//默认不被选中
        icon:'heart',//标签图标
        content:'表白'//标签内容,
      },
      {
        checked:false,//默认不被选中
        icon:'call',//标签图标
        content:'求助'//标签内容,
      },
      {
        checked:false,//默认不被选中
        icon:'help-circle',//标签图标
        content:'提问'//标签内容,
      },
      {
        checked:false,//默认不被选中
        icon:'link-unlink',//标签图标
        content:'吐槽'//标签内容,
      },
      {
        checked:false,//默认不被选中
        icon:'discount',//标签图标
        content:'出物'//标签内容,
      },
      {
        checked:false,//默认不被选中
        icon:'user-talk',//标签图标
        content:'征友'//标签内容,
      },
      {
        checked:false,//默认不被选中
        icon:'root-list',//标签图标
        content:'失物招领'//标签内容,
      },
      {
        checked:false,//默认不被选中
        icon:'thumb-up',//标签图标
        content:'夸夸'//标签内容,
      }
    ],
    title:'',
    content:'',
    qq:'',
    wechat:'',
    tel:'',
    tag:'',
    checkData:[],
    schoolCode_index: 0,
    schoolCode:0
  },
  //查询学校
  async selectSchool(){
    let res=await selectSchool(wx.getStorageSync('QID'))
    console.log("学校查询结果：",res)
    if(res.data.code===200){
      if(res.data.data.length===0){
        Toast({
          context: this,
          selector: '#t-toast',
          message: '非法参数',
          theme: 'error',
          direction: 'column',
          duration:0
        });
      }
      this.setData({
        checkData:res.data.data,
        schoolCode:res.data.data[0].schoolCode
      })
    }
  },
 //选择校区
 onChange1(e) {
  this.setData({ schoolCode_index: e.detail.value });
  this.setData({ schoolCode: this.data.checkData[e.detail.value].schoolCode });
},

  createPreviewImg(){
    Date.prototype.Format = function (fmt) {
      var o = {
          "M+": this.getMonth() + 1, //月份 
          "d+": this.getDate(), //日 
          "H+": this.getHours(), //小时 
          "m+": this.getMinutes(), //分 
          "s+": this.getSeconds(), //秒 
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
          "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
    let imgUrls=[]
    this.data.originFiles.forEach(item=>{
      imgUrls.push(item.url)
    })
    let params={
      title:this.data.title,
      qq:this.data.qq,
      wechat:this.data.wechat,
      tel:this.data.tel,
      tag:this.data.tag,
      schoolCode:this.data.schoolCode,
      createTime: new Date().Format("yyyy-MM-dd HH:mm:ss"),
      messages:this.data.content.split("\n"),
      imgUrlList:imgUrls
    }
    console.log("params：",params)
    wx.setStorageSync('createPreviewImageData', JSON.stringify(params))
    /**
     * TODO:数据校验
     */
    console.log(params.title.length)
    if(params.title.length==0){
      this.showIconMessage('请输入标题')
      return
    }else if(this.data.content.length==0){
      this.showIconMessage('请输入内容')
      return
    }else if(this.data.tag===''){
      this.showIconMessage('请选择标签')
      return
    }
    wx.navigateTo({
      url: '../previewImg/previewImg',
    })
  },
  //消息通知
  showIconMessage(content) {
    Message.error({
      context: this,
      offset: ['60rpx', '32rpx'],
      duration: 3000,
      content: content,
    });
  },

  clickTag(e){
    console.log("点击标签:",e.currentTarget.dataset.index)
    let tags_=this.data.tags
    for(let i=0;i<tags_.length;i++){
      if(i!=e.currentTarget.dataset.index){
        tags_[i].checked=false
      }else{
        tags_[i].checked=true
        this.setData({
          tag:tags_[i].content
        })
      }
    }
    this.setData({
      tags:tags_
    })
  },

  handleRemove(e) {
    const { index } = e.detail;
    const { originFiles } = this.data;
    originFiles.splice(index, 1);
    this.setData({
      originFiles,
    });
  },
  selectChange(e){
    let files=e.detail.currentSelectedFiles[0]
    files.forEach(file => {
      file.status='loading'
    });
    this.setData({
      originFiles: this.data.originFiles.concat(files),
    });
    let dfile=this.data.originFiles
    dfile.forEach(async file=>{
      if(file.status==='loading'){
        let res=await uploadFile(file.url)
        if(res){
          file.status=''
          file.url=res
        }
        this.setData({
          originFiles: dfile,
        });
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log("页面参数:",options.QID)
    if(options.QID===undefined){
      //没有指定QID，查询用户绑定的QID,若未绑定QID,分配默认QID
      let res=await selectQID(wx.getStorageSync('openid'))
      console.log(res)
      if(res.data.code===201){
        //未绑定QID,绑定默认QID
        let addUser_res=await addUser(wx.getStorageSync('openid'),'QID1000')
        if(addUser_res.data.code===200){
          wx.setStorageSync('QID', 'QID1000')
          this.selectSchool()
        }
      }else{
        //已绑定QID
        wx.setStorageSync('QID', res.data.data)
        this.selectSchool()
      }
    }else{
      console.log("检测到QID")
      //携带QID,给用户绑定当前的QID
      wx.setStorageSync('QID', options.QID)
      let addUser_res=await addUser(wx.getStorageSync('openid'),options.QID)
      console.log("addUser_res:",addUser_res)
      if(addUser_res.data.code===200){
        this.selectSchool()
      }
    }
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