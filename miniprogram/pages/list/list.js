// miniprogram/pages/list/list.js
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
    datalist: [], //.wxml文件需要绑定的列表，我这里用的数据类型是数组
    creationTime: new Date(),
    hidden: true,
  },

  getdatalist: function () { //可在onLoad中设置为进入页面默认加载
    var that = this
    //console.log(that.data.hidden)

    if(that.data.hidden == true){
      db.collection('Ballet').where({
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

            if(res.data.length>1){
              that.setData({
                datalist: that.data.datalist.concat(res.data)
              })
            } else {
              that.setData({
                hidden: false
              })
            }
          }
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
    that.getdatalist()
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
    that.getdatalist() //重新调用请求获取下一页数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})