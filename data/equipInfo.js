/**
 * 小程序配置文件
 */
// var util = require('./server/utils/util');
// 此处主机域名修改成腾讯云解决方案分配的域名

// var host = util.getEnv() ? 'http://localhost:5757' : 'https://gqiwkdby.qcloud.la'
var equipInfo = {}
var host = ''
// -1 未连接
// 0 连接中
// 1 已连接
// 2 已更新
equipInfo.equipList = [
  {
    deviceId: '33994AB7',
    macId: 'A2:C1:16:00:06:02',
    equipName: '血糖仪',
    characterId: '2A18',
    connectStatus: -1,
    value: undefined,
  },
  {
    deviceId: '33994AB6',
    equipName: '血压计',
    characterId: '2A18',
    connectStatus: -1,
    value: undefined,
  },
  {
    deviceId: '33994AB5',
    equipName: '智能手环',
    characterId: '2A18',
    connectStatus: -1,
    value: undefined,
  }
]

equipInfo.searchMatch = function (goalId) {
  let findEquip
  for (let equip of equipInfo.equipList) {
    if (goalId.includes(equip.searchKey)) {
      findEquip = equip
    }
  }
  return findEquip
}

module.exports = equipInfo
