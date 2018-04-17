var ajax = require('../../ajax/ajax');
var util = require('../../utils/util');

// pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    array: [1,2,3],
    equipList: [
      {
        equipTitle: '智能床垫',
        time: '',
        equipAttrArr: [
          {
            attrName: '睡眠时间',
            attrValue: '',
            attrUnit: '暂无数据',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/attr_sleep.png'
          },
          {
            attrName: '呼吸',
            attrValue: -1,
            attrUnit: '次/分'
          },
          {
            attrName: '心率',
            attrValue: -1,
            attrUnit: '次/分钟',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/attr_heart.png'
          },
          {
            attrName: '体动次数',
            attrValue: -1,
            attrUnit: '次'
          },
        ],
        status: '',
      },
      {
        equipTitle: '血糖仪',
        time: '',
        equipAttrArr: [
          {
            attrName: '血糖',
            attrValue: -1,
            attrUnit: '毫摩/升',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/attr_sugar.png'
          }
        ],
        status: 2,
      },
      {
        equipTitle: '智能手表',
        time: '',
        equipAttrArr: [
          {
            attrName: '心率',
            attrValue: -1,
            attrUnit: '次/分钟',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/attr_heart.png'
          },
          {
            attrName: '步数',
            attrValue: -1,
            attrUnit: '步',
            icon: 'https://jiuhetang-1256506523.cos.ap-chengdu.myqcloud.com/attr_step.png'
          }
        ],
        status: 2,
      },
    ]
  },

  setAttrData: function (name, data) {
    let equipIndex = this.name2index[name]
    let equipList = this.data.equipList
    let equip = equipList[equipIndex]
    switch (name) {
      case 'jh':
        const stausArr = {
          '-1': '无法连接设备',
          '0': '离床',
          '1': '连接中',
          '2': '在床',
          '3': '连接中'
        }
        var {date, isbed, heart ,resp ,turn} = data
        equip.time = (new Date(date)).toLocaleString()
        equip.equipAttrArr[1].attrValue = resp
        equip.equipAttrArr[2].attrValue = heart
        equip.equipAttrArr[3].attrValue = turn
        equip.status = stausArr[isbed]
        break;
      case 'glu':
        var {time, value} = data
        equip.time = (new Date(time)).toLocaleString()
        equip.equipAttrArr[0].attrValue = value
        break;
      case 'watch':
        var {time, heart, walk} = data
        equip.time = (new Date(time)).toLocaleString()
        equip.equipAttrArr[0].attrValue = heart
        equip.equipAttrArr[1].attrValue = walk
        break;
    }
    console.log(equipList)
    this.setData({
      equipList
    })
  },

  getAttrData: function (name, value) {
    let equip = this.data.equipList[this.name2index[name]]
    if (typeof value === 'number') {
      let result = equip.equipAttrArr[value].attrValue
      return result
    } else if (typeof value === 'string') {
      let result = equip[value]
      return result
    }
  },

  initData: function () {
    this.name2index = {
      'jh': 0,
      'glu': 1,
      'watch': 2,
    }
    // let equipList = []
    // for (let key in name2index) {
    //   let value = name2index[key]
    //   equipList[value] =
    // }
    // this.name2index.map(() => {
    //
    // })
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
      title: '云健康平台'
    })
    getApp().globalCbfFunc.userInfoCbf = this.update
  },

  viewhistory: function (e) {
    console.log(e)
    let {equip, attr} = e.currentTarget.dataset
    // 1获得数据
    let url = `/pages/history/history?equipIndex=${equip}&attrIndex=${attr}`
    wx.navigateTo({
      url: url
    })
    // 2渲染
  },

  getJhData: function (timeValue) {
    this.timer = setTimeout(() => {
      let json = {macId: '5ccf7f623051', type: 'GetUpdate'}
      // isbed -1 长时间离线 0暂时离线 1在线 不在床 2在线 再床
      ajax.getJHData(json).then((res) => {
        // 是否长时间离线
        if (res && res.data.data) {
          let {date, isbed, heart ,resp ,turn} = res.data.data
          if (date === this.getAttrData('jh', 'time')) {
            // 新数据失效
            console.log('000')
            this.setAttrData('jh', {date, isbed: 0, heart: -1 ,resp: -1 ,turn: -1})
          } else if (this.getAttrData('jh', 'time')) {
            // 正常更新
            console.log('111')
           this.setAttrData('jh', {date, isbed, heart ,resp ,turn})
          } else {
            // 首次连接
            console.log('222')
           this.setAttrData('jh', {date, isbed: 3, heart: -1 ,resp: -1 ,turn: -1})
          }
          this.getJhData(3000)
        } else {
          // 长时间离线
          let date = this.getAttrData('jh', 'time') || (new Date()).toLocaleString()
          this.setAttrData('jh', {date, isbed: -1, heart: -1 ,resp: -1 ,turn: -1})
          this.getJhData(10000)
        }
      })
    }, timeValue)
  },

  getGluData: function () {
    ajax.getGluData().then(res => {
      if (res) {
        let result = res.data.data
        this.setAttrData('glu', result[result.length - 1])
      }
    })
  },

  getWatchData: function () {
    ajax.getWatchData().then(res => {
      if (res) {
        let result = res.data.data
        this.setAttrData('watch', result[result.length - 1])
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  update: function () {
    this.readyStatus = true
    // 初始化
    this.initData()
    // 1 拉下来实时数据。 每隔一段时间拉一次
    this.getJhData(0)
    this.getGluData()
    this.getWatchData()
    this.getUserInfo()
    // 2 这个页面拉取数据包。并进行渲染
    // 2 上报这数据。给服务器。并且计算出来心率数据的平均值。。？或者有一个表存放当日实时数值。。有个表存放历史平均值
    // 3 历史页面拉取历史全部数据。。。然后绘制？
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.readyStatus) {
      this.update()
    }
  },

  getUserInfo: function () {
    ajax.getUserInfo().then((res) => {
      let data = res.data.data
      console.log(data)
      if (data.name) {
        this.setData({
          userInfo: data,
        })
      } else {
        // 发起注册请求
        ajax.newUserSign().then((res) => {
          let data = res.data.data
          if (data) {
            this.setData({
              userInfo: data
            })
          }
        })
      }
      console.log(res)
    })
  },

  addEquip: function () {
    console.log('123123')
    let url = `/pages/blue/blue`
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('hide')
    if (this.timer) {
      clearTimeout(this.timer)
    }
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