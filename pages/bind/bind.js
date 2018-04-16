// pages/bind/bind.js
var ajax = require('../../ajax/ajax');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: 'hehehe'
  },

  // 输入框组件回调
  inputCbf: function (event) {
    this.setData({
      content: event.detail.value
    })
  },

  enter: function () {
    console.log(this.data.content)
    ajax.newEquipBind(this.data.content).then((res) => {
      console.log(res)
      wx.showModal({
        title: '设备绑定成功',
        content: '设备ID为： ' + this.data.content,
      })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor:'#ed5629'
    })
    wx.setNavigationBarTitle({
      title: '添加设备'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})