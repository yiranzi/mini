// pages/myhistory/myhistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    array: [1,2,3],
    equipList: [
      {
        equipTitle: '智能手环',
        time: '',
        equipAttrArr: [
          {
            attrName: '智能手表',
            attrValue: '',
            attrUnit: '暂无数据',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/equip_watch.png'
          },
          {
            attrName: '血压仪',
            attrValue: -1,
            attrUnit: '次/分钟',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/equip_pressure.png'
          },
        ],
        status: '',
      },
      {
        equipTitle: '智能手环',
        time: '',
        equipAttrArr: [
          {
            attrName: '血糖仪',
            attrValue: -1,
            attrUnit: '次/分钟',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/equip_sugar.png'
          },
          {
            attrName: '智能床垫',
            attrValue: -1,
            attrUnit: '次/分钟',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/equip_mattress.png'
          }
        ],
        status: 2,
      },
    ]
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
      title: '我的设备'
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