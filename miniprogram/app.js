//app.js
App({
  onLaunch: function () {
    var that = this

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      //console.log('初始化云环境，env指定云环境ID')
      wx.cloud.init({
        traceUser: true,
        env:'carsonlib'
      })
    }

    //console.log('云函数login获取openid')
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      complete: res => {
        //console.log(res)
        that.InfoInit(res, that) //初始化用户信息
      }
    })

    //console.log('清空globalData')
    that.globalData = {}
  },

  InfoInit: function (res0, that) {
    //console.log('InfoInit 初始化函数')
    that.globalData.openid = res0.result.openid

    //console.log('根据openid检测用户是否已经存在')
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('Urbanite').where({
      _openid: res0.result.openid
    })
      .get({
        success(res1) {
          //console.log(res1)
          if (res1.data.length > 0) {
            //console.log('用户在数据库已有记录，将使用现有记录')
            that.globalData.nickName = res1.data[0].nickName

          } else {
            //console.log('用户在数据库未有记录，将创建新记录')
            db.collection('Urbanite').add({
              data: {
                // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                nickName: '秦始皇',
                creationTime: db.serverDate()
              },
              success: function (res2) {
                that.globalData.nickName = '秦始皇'
              }
            })
          }
        }
      })
  },
})
