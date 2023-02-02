// miniprogram/pages/index/index.js
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
    creationTime: new Date(),
    hidden: true,
  },

  //点击News列表跳转
  jumpToUrl: function (e) {
    console.log('根据用户点击跳转到详情页显示')
    // app.globalData.webUrl = e.currentTarget.id
    // wx.navigateTo({
    //   url: '../webview/webview',
    // })
  },

  //显示最新列表
  getDataList: function () {
    var that = this
    //console.log('加载最新活动列表')
    wx.showLoading({
      title: '加载中',
    });

    if (that.data.hidden == true) {
      db.collection('Ballet').where({
        isOpen: true,
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

            if (res.data.length > 1) {
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

  //显示最新列表
  getDataListNew: function () {
    var that = this
    //console.log('加载最新活动列表')
    wx.showLoading({
      title: '加载中',
    });

    if (that.data.hidden == true) {
      db.collection('Ballet').where({
        isOpen: true,
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

            if (res.data.length > 1) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      creationTime: new Date(),
      hidden: true
    })

    app.globalData.orgiUrl = '../index/index'
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
    that.getDataList()
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
    var that = this
    that.setData({
      dataList: [],
      creationTime: new Date(),
      hidden: true,
    })
    that.getDataListNew(that)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.getDataList() //重新调用请求获取下一页数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})