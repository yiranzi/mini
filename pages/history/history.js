var ajax = require('../../ajax/ajax');

// pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    equipIndex: -1,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '历史数据'
    })
    // 初始化
    // 1 拉下来实时数据。 每隔一段时间拉一次
    let equipIndex = parseInt(options.equipIndex)
    let attrIndex = parseInt(options.attrIndex)
    console.log(options)
    switch (equipIndex) {
      case 0:
        this.getJhData()
        break
      case 1:
        this.getGluData()
        break
      case 2:
        this.getWatchData()
        break
    }
    this.setData({
      equipIndex
    })
    // 2 这个页面拉取数据包。并进行渲染
    // 2 上报这数据。给服务器。并且计算出来心率数据的平均值。。？或者有一个表存放当日实时数值。。有个表存放历史平均值
    // 3 历史页面拉取历史全部数据。。。然后绘制？
  },

  // 根据openId获取
  getGluData: function () {
    ajax.getGluData().then(res => {
      let result = res.data.data
      result.map((item) => {
        item.time = (new Date(item.time)).toLocaleString()
      })
      this.setData({
        list: result
      })
    })
  },

  getWatchData: function () {
    ajax.getWatchData().then(res => {
      let result = res.data.data
      result.map((item) => {
        item.time = (new Date(item.time)).toLocaleString()
      })
      this.setData({
        list: result
      })
    })
  },

  getJhData: function () {
    let json = {openId: 'o0f3l0fmMIV4LKsOjLPsfn8sYgEs', orders: '', pageCurrent: 1, pageSize: 5}
    ajax.getJHHistoryData(json).then((res) => {
      this.setData({
        list: res.data.data.list
      })
      console.log(res.data.data.list)
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