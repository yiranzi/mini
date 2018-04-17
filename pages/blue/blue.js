// pages/blue/blue.js
var equipInfo = require('../../data/equipInfo')
var ajax = require('../../ajax/ajax')
var icons = require('../../static/icons')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blueReady: false,
    blueStatus: false,
    blueDiscovering: false,
    discoverList: [],
    deviceList: [],
    haveConnectDevice: [],
    searching: false,
    myDeviceList: equipInfo.equipList,
    icons: icons,
    nameStatus: {
      '-1': '未连接',
      '0': '连接中',
      '1': '已连接',
      '2': '获得新数据'
    }
  },

  // 开启蓝牙
  openAdapter: function () {
    const funcName = 'openBluetoothAdapter'
    return new Promise ((resolve, reject) => {
      let result = false
      wx.openBluetoothAdapter({
        success: res => {
          this.setData({
            blueReady: true
          })
          result = true
          console.log(funcName + "-----success----------");
        },
        fail: res => {
          this.setData({
            blueReady: false
          })
          result = false
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");
          resolve(result)
        }
      })
    })
  },

  // 获取蓝牙状态
  getAdapterState: function () {
    const funcName = 'getBluetoothAdapterState'
    return new Promise ((resolve, reject) => {
      wx.getBluetoothAdapterState({
        success: res => {
          console.log(funcName + "-----success----------");
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");
          resolve(res)
        }
      })
    })
  },

  // 监听蓝牙状态变化
  onAdaptStateChange: function () {
    wx.onBluetoothAdapterStateChange(res => {
      this.setData({
        blueStatus: res.available,
        blueDiscovering: res.discovering
      })

      console.log(`adapterState changed, now is`, res)
    })
  },


  // 关闭搜索蓝牙
  stopBlueDiscovery: function () {
    const funcName = 'startBluetoothDevicesDiscovery'
    return new Promise ((resolve, reject) => {
      wx.stopBluetoothDevicesDiscovery({
        success: res => {
          console.log(funcName + "-----success----------");
          console.log(res);
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");
          resolve(res)
        }
      })
    })
  },

  bindEquip: function () {
    let url = `/pages/bind/bind`
    wx.navigateTo({
      url: url
    })
  },

// 获取已连接的设备
  getConnectedBlueDevices: function () {
    wx.showModal({
      title: 'getConnectedBlueDevices',
      content: 'getConnectedBlueDevices',
    })
    const funcName = 'getConnectedBluetoothDevices'
    return new Promise ((resolve, reject) => {
      wx.getConnectedBluetoothDevices({
        services: this.data.haveConnectDevice,
        success: res => {
          console.log(funcName + "-----success----------");
          console.log(res);
          if (Array.isArray(res.devices)) {
            res.devices.map((device, index) => {
              if (device.advertisData) {
                device.advertisData = this.ab2hex(device.advertisData)
              }
            })
          }
          if (res) {
            this.setData({
              discoverList: res.devices
            })
          }
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");
          resolve(res)
        }
      })
    })
  },

  ab2hex: function (buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  saveServiceId: function (serviceId) {
    let haveConnectDevice = this.data.haveConnectDevice
    let result = haveConnectDevice.find((ele) => {
      return ele === serviceId
    })
    if (!result) {
      console.log('push success')
      haveConnectDevice.push(serviceId)
      this.setData({
        haveConnectDevice
      })
    } else {
      console.log('exist')
      console.log(result)
    }
  },

  deviceObjInit: function (info) {
    console.log('start')
    let {deviceId, serviceId, characteristics} = info
    // 1 查找有无这个device
    let deviceList = this.data.deviceList
    let findDevice = deviceList.find((device) => {
      return device.deviceId = deviceId
    })
    if (findDevice) {
      console.log('findDevice get')
      let findService = findDevice.services.find((service) => {
        return service === serviceId
      })
      if (!findService) {
        // 设置上
        findDevice.services.push({serviceId, characteristics})
      }
    } else {
      console.log('findDevice init')
      let obj = {
        foundKey: '',
        name: '',
        deviceId: deviceId,
        services: []
      }
      obj.services.push({
        serviceId, characteristics
      })
      deviceList.push(obj)
    }
    this.setData({
      deviceList
    })
  },

  getBLEDeviceCharacteristics: function (deviceId, serviceId) {
    const funcName = 'getBLEDeviceCharacteristics'
    return new Promise ((resolve, reject) => {
      wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: res => {
          console.log(funcName + "-----success----------");
          console.log(res);
          resolve(res)
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");

        }
      })
    })
  },

  createBLEConnection: function (deviceId) {
    return new Promise ((resolve, reject) => {
      wx.createBLEConnection({
        deviceId: deviceId,
        success: res => {
          resolve({
            status: true,
            deviceId: deviceId
          })
        },
        fail: res => {
          console.log("-----fail----------");
          wx.showModal({
            title: 'fail',
            content: deviceId,
          })
        },
        complete: res => {
          // complete
          console.log("-----complete----------");
          wx.hideLoading({
            title: deviceId
          })
        }
      })
    })
  },

  getBLEDeviceServices: function (deviceId) {
    const funcName = 'getBLEDeviceServices'
    return new Promise ((resolve, reject) => {
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        success: res => {
          console.log(funcName + "-----success----------");
          console.log(res);
          resolve(res)
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");

        }
      })
    })
  },

  // 读取特征值
  readBLECharacteristicValue: function (info) {
    let {deviceid: deviceId, serviceid: serviceId, uuid: characteristicId} = info
    const funcName = 'readBLECharacteristicValue'
    return new Promise ((resolve, reject) => {
      wx.readBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        success: res => {
          console.log(funcName + "-----success----------");
          console.log(res);
          resolve(res)
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");

        }
      })
    })
  },

  //
  tapWithUUID: function (e) {
    let {deviceid, serviceid, uuid} = e.currentTarget.dataset
    console.log(deviceid)
    console.log(serviceid)
    console.log(uuid)
    this.notice({state: true, deviceid, serviceid, uuid, success: this.getNotice})
    this.readBLECharacteristicValue({deviceid, serviceid, uuid}).then((info) => {
      wx.showModal({
        title: uuid,
        content: info.errMsg + info.errCode,
      })
    })
  },

  notifyBLECharacteristicValueChange: function (info) {
    let {state = true, deviceId, serviceId, characteristicId} = info
    const funcName = 'notifyBLECharacteristicValueChange'
    return new Promise ((resolve, reject) => {
      wx.notifyBLECharacteristicValueChange({
        state,
        deviceId,
        serviceId,
        characteristicId,
        success: res => {
          console.log(funcName + "-----success----------");
          console.log(res);
          resolve(res)
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");
        }
      })
    })
  },

  getNotice: function (e) {
    console.log(e)
  },

  tapOffDiscover: function () {
    wx.showModal({
      title: 'tapOffDiscover',
      content: 'tapOffDiscover',
    })
    this.stopBlueDiscovery()
  },

  check: function () {
    this.openAdapter().then(res => {
      console.log('get' + res)
      if (res) {
        wx.hideLoading()
        this.startBlueAdapter()
      } else {
        this.timer = setTimeout(() => {
          console.log('轮训')
          this.check()
        }, 4000)
        console.log('showModal' +this.showModal)
        if (!this.showModal) {
          this.showModal = true
          wx.hideLoading()
          wx.showModal({
            title: '蓝牙未开启',
            content: '请开启',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              } else {
                console.log('点击背景？')
              }
              this.showModal = false
              console.log('click' + this.showModal)
              if (!this.data.blueReady) {
                wx.showLoading({
                  title: '加载蓝牙中'
                })
              }
            }
          })
        }
      }
    })
  },

  startBlueAdapter: function () {
    // 1 开启监控
    this.onAdaptStateChange()
    // 开启特征值监听
    this.onBLECharacteristicValueChange()
    // 2 获取状态
    this.getAdapterState().then(res => {
      this.setData({
        blueStatus: res.available,
        blueDiscovering: res.discovering
      })
      // 监控设备变化
      this.onDeviceFound()
      if (res.discovering) {
        this.getBlueDevices()
      } else {
        this.startBlueDiscovery().then(() => {
          this.getBlueDevices()
        })
      }
    })
  },

  // 监听蓝牙状态变化
  // 获取所有设备
  onDeviceFound: function () {
    const funcName = 'onDeviceFound'
    wx.onBluetoothDeviceFound(res => {
      this.searchGetEquip(res)
      console.log(funcName + ` changed, now is`, res)
    })
  },

  // 获取所有设备
  getBlueDevices: function () {
    return new Promise ((resolve, reject) => {
      wx.getBluetoothDevices({
        success: res => {
          this.searchGetEquip(res)
        },
        fail: res => {
        },
        complete: res => {
        }
      })
    })
  },

  // 开始搜索蓝牙
  startBlueDiscovery: function () {
    const funcName = 'startBluetoothDevicesDiscovery'
    return new Promise ((resolve, reject) => {
      wx.startBluetoothDevicesDiscovery({
        success: res => {
          console.log(funcName + "-----success----------");
          console.log(res);
        },
        fail: res => {
          console.log(funcName + "-----fail----------");
          // fail
          console.log(res);
        },
        complete: res => {
          // complete
          console.log(funcName + "-----complete----------");
          resolve(res)
        }
      })
    })
  },

  searchGetEquip: function (res) {
    console.log('searchGetEquip')
    console.log(res)
    let equipArr = this.data.myDeviceList
    equipArr.map((havaSoredDevice, havaSoredDeviceIndex) => {
      res.devices.forEach(device => {
        if (device.deviceId.includes(havaSoredDevice.deviceId)) {
          // 转义
          if (device.advertisData) {
            device.advertisData = this.ab2hex(device.advertisData)
          }
          Object.assign(havaSoredDevice, device)
          havaSoredDevice.connectStatus = 0
          // 发起链接
          this.startConnect(havaSoredDevice, havaSoredDeviceIndex)
        } else {
          return (havaSoredDevice)
        }
      })
    })
    this.setData({
      myDeviceList: equipArr
    })
  },

  startConnect: function (device, index) {
    this.startConnectDeviceProcess(device).then(() => {
      device.connectStatus = 1
      this.data.myDeviceList[index] = device
      this.setData({
        myDeviceList: this.data.myDeviceList
      })
    }).catch(() => {
      this.startConnect(device, index)
    })
  },

  startConnectDeviceProcess: function (device) {
    return new Promise((resolve, reject) => {
      // 1 开始连接
      this.createBLEConnection(device.deviceId).then((result) => {
        if (result.status) {
          // 2 获取service
          this.getBLEDeviceServices(result.deviceId).then((info) => {
            if (Array.isArray(info.services )) {
              info.services.forEach((service, index) => {
                if (service.isPrimary) {
                  // 为了查找 暂时放入
                  // this.saveServiceId(service.uuid)
                  // 发起character请求
                  this.getBLEDeviceCharacteristics(result.deviceId, service.uuid).then((characteristics) => {
                    // 如果是特征值。监听
                    characteristics.characteristics.forEach((character, index) => {
                      if (character.uuid.indexOf(device.characterId) !== -1) {
                        console.log('get 2a18')
                        this.notifyBLECharacteristicValueChange({
                          deviceId: result.deviceId,
                          serviceId: service.uuid,
                          characteristicId: character.uuid
                        }).then(() => {
                          resolve()
                        })
                      }
                    })
                    // 成功完成连接。放入到连接数组中
                    // this.deviceObjInit({
                    //   deviceId: result.deviceId,
                    //   serviceId: service.uuid,
                    //   characteristics: characteristics.characteristics
                    // })
                  })
                }
              })
            }
          })
        }
      })
    })
  },


  onBLECharacteristicValueChange: function () {
    wx.onBLECharacteristicValueChange((res) => {
      // 1 便利搜索
      let myDeviceList = this.data.myDeviceList
      let findDevice = myDeviceList.find((device) => {
        return res.deviceId.includes(device.deviceId)
      })
      findDevice.value = this.ab2hex(res.value)
      findDevice.connectStatus = 2
      wx.showModal({
        title: '获得新数据' + findDevice.value,
        content: findDevice.value,
      })
      ajax.postGluData({
        time: new Date(),
        value: findDevice.value
      })
      this.setData({
        myDeviceList: this.data.myDeviceList
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
      title: '获取设备数据'
    })
  },

  addEquip: function (e) {
    let url = `/pages/bind/bind`
    wx.navigateTo({
      url: url
    })
  },

  onReady: function () {

  },

  onShow: function () {
    console.log(icons)
    this.check()
  },

  onHide: function () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    wx.stopBluetoothDevicesDiscovery()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.stopBluetoothDevicesDiscovery()
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