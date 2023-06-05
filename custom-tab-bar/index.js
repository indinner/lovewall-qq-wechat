import {isAdmin} from '../apis/wall.api'
Component({
  lifetimes: {
    attached: function() {
      this.isAdmin()
      setInterval(()=>{
        let url_value=wx.getStorageSync('url_value') || 'label_1'
        // console.log("缓存加载",url_value)
        this.setData({
          value:url_value
        })
      },100)

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      wx.removeStorageSync('url_value')
    },
  },
  data: {
    value: wx.getStorageSync('url_value'),
    list: [
      { value: 'label_1', icon: 'chat', ariaLabel: '首页', url:'/pages/index/index'}
    ],
    show:false
  },


  methods: {
    async isAdmin(){
      let res=await isAdmin(wx.getStorageSync('openid'))
      console.log("isAdmin:",res)
      if(res.data.data){
        let data=this.data.list
        data.push({ value: 'label_2', icon: 'desktop', ariaLabel: '审核', url:'/pages/admin/audit/audit'})
        this.setData({
          list:data,
          show:true
        })
      }
    },
    onChange(e) {
      // console.log(e.detail.value)
      wx.setStorageSync('url_value', e.detail.value)
      let datas=this.data.list
      let value=datas.find(object=> object.value === e.detail.value)
      wx.switchTab({
        url: value.url,
        success:(res)=>{
          console.log("跳转成功",this.data.value)
        }
      })
    },
  },
});
