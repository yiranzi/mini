//app.js
const APP_ID = 'wx503ed8eb029b5a82'
const APP_SECRET = 'bd7c6dd70ceec712ee497bd4c4b62ff7'


App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo()
        } else {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              this.getUserInfo()
            }
          })
        }
      }
    })
  },

  getUserInfo: function () {
    wx.getUserInfo({
      success: res1 => {
        // 可以将 res 发送给后台解码出
        this.globalData.userInfo = res1.userInfo
        let that = this
        wx.login({
          success: res => {
            // 可以将 res 发送给后台解码出
            wx.request({
              //获取openid接口
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data:{
                appid:APP_ID,
                secret:APP_SECRET,
                js_code:res.code,
                grant_type:'authorization_code'
              },
              method:'GET',
              success:function(res){
                console.log(res)
                that.globalData.userInfo.openId = res.data.openid;//获取到的openid
                that.globalCbfFunc.userInfoCbf()
              }
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              that.userInfoReadyCallback(res1)
            }
          }
        })
      }
    })
  },

  //这个是用来设置回调函数的；当或得到openId后就可以执行回调了。

  globalCbfFunc: {
    userInfoCbf: () => {console.log('get user info')}
  },

  globalData: {
    userInfo: null
  }
})