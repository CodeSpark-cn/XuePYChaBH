// miniprogram/pages/myIndex/myIndex.js
var util = require('../../utils/util.js')
var Dec = require('../../utils/public.js')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    balletContent: '',
    showStatus: [
      { name: '公开', value: true },
      { name: '私密', value: false, checked: 'true' },
    ],
    statusValue: false,
    coverUrl: '',
    creationTime: new Date(),
    hidden: true,
  },

  //点击News列表跳转
  jumpToUrl: function (e) {
    //console.log('根据用户点击跳转到详情页显示')
    // app.globalData.webUrl = e.currentTarget.id
    // wx.navigateTo({
    //   url: '../webview/webview',
    // })
  },

  //显示最新列表
  getDataList: function (that) {
    wx.showLoading({
      title: '加载中',
    });

    if (that.data.hidden == true) {
      db.collection('Ballet').where({
        _openid: app.globalData.openid,
        creationTime: _.lt(that.data.creationTime)
      }).orderBy('creationTime', 'desc').limit(20)
        .get({
          success(res) {
            //console.log(res)
            for (let i = 0; i < res.data.length; i++) {

              if (res.data[i].creationTime < that.data.creationTime) {
                that.setData({
                  creationTime: res.data[i].creationTime
                })
              }

              res.data[i].creationTime = util.formatDate(new Date(res.data[i].creationTime))
              res.data[i].content = Dec.Decrypt(res.data[i].content)
            }

            if (res.data.length > 0) {
              that.setData({
                dataList: that.data.dataList.concat(res.data)
              })
            } else {
              that.setData({
                hidden: false
              })
            }
            wx.hideLoading()
          }
        })
    } else {
      wx.hideLoading()
    }
  },

  //显示最新列表 -  新增后专用
  getDataListforadd: function (that) {
    wx.showLoading({
      title: '加载中',
    });

    if (that.data.hidden == true) {
      db.collection('Ballet').where({
        _openid: app.globalData.openid
      }).orderBy('creationTime', 'desc').limit(20)
        .get({
          success(res) {
            //console.log(res)
            for (let i = 0; i < res.data.length; i++) {

              if (res.data[i].creationTime < that.data.creationTime) {
                that.setData({
                  creationTime: res.data[i].creationTime
                })
              }

              res.data[i].creationTime = util.formatDate(new Date(res.data[i].creationTime))
              res.data[i].content = Dec.Decrypt(res.data[i].content)
            }

            if (res.data.length > 0) {
              that.setData({
                dataList: that.data.dataList.concat(res.data)
              })
            } else {
              that.setData({
                hidden: false
              })
            }
            wx.hideLoading()
          }
        })
    } else {
      wx.hideLoading()
    }
  },

  inputContent: function (e) {
    this.setData({
      balletContent: e.detail.value.replace(/^\s+|\s+$/gm, '')
    })
  },

  radioStatus: function (e) {
    this.setData({
      statusValue: e.detail.value
    })
  },

  coverTheCover: function (e) {
    var that = this
    wx.chooseImage({
      count: 1, // 可以选择图片张数，默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], 
      success: function (res) {
        // 返回选定照片的本地文件路径列表
        that.uploadcoverimg(that, res.tempFilePaths[0])
      }
    })
  },

  coverUrlChange: function (e) {
    this.setData({
      coverUrl: e.detail.value
    })
  },

  uploadcoverimg: function (that, tmpurl) {
    wx.cloud.uploadFile({
      cloudPath: 'CoverImages/' + that.RndNum(20) + '.png',
      filePath: tmpurl, // 小程序临时文件路径
      success: res => {
        that.setData({
          coverUrl: res.fileID
        })
        wx.showModal({
          title: '图片上传成功',
          content: '图片上传成功',
          showCancel: false,
        })
      },
      fail: err => {
      }
    })
  },

  RndNum: function (n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
      rnd += Math.floor(Math.random() * 10);
    return rnd;
  },

  submitContent: function (e) {
    var that = this
    if (that.data.balletContent != '')
    {
      db.collection('Ballet').add({
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          isOpen: Boolean(that.data.statusValue),
          hugAmount:0,
          courageAmount:0,
          content: Dec.Encrypt(that.data.balletContent),
          stills: that.data.coverUrl,
          creationTime: db.serverDate()
        },
        success: function (res) {
          wx.showModal({
            title: '发布成功',
            content: '发布成功',
            showCancel: false,
          })
          that.setData({
            dataList: [],
            balletContent: '',
            showStatus: [
              { name: '公开', value: true },
              { name: '私密', value: false, checked: 'true' },
            ],
            statusValue: false,
            coverUrl: '',
            creationTime: new Date(),
            hidden: true,
          })
          that.getDataListforadd(that)
          // that.setData({
          //   balletContent: '',
          //   dataList: [],
          //   creationTime: new Date(),
          //   hidden: true
          // }, function(e){
          //   that.getDataList(that)
          // })
          //setTimeout(function () { that.getDataList(that) }, 1000)
        }
      })
    } else {
      wx.showModal({
        title: '请输入发布内容',
        content: '请输入发布内容',
        showCancel: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      creationTime: new Date(),
      hidden: true
    })

    app.globalData.orgiUrl = '../myIndex/myIndex'
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
    var that = this
    that.getDataList(that)
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
    var that = this
    that.getDataList(that) //重新调用请求获取下一页数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})