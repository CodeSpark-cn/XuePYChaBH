// miniprogram/pages/bihua/bihua.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hid: '学',
    bishun:'笔顺：丶  丶  ノ  丶  乛  乛  亅  一 ',
    designation:'名称： 点 点 撇 点 横撇/横钩 横撇/横钩 竖钩 横',
    details:'部首：子 ， 笔画：8 ， 繁体：學 ',
    shiyi:'1.学习：～技术。勤工俭～。我跟着他～了许多知识。 2.模仿：他～杜鹃叫，～得很像。 3.学问：治～。才疏～浅。博～多能。 4.指学科：数～。物理～。政治经济～。 5.学校：小～。大～。上～。 6.姓。',
    jyc:'',
    fyc:'反义词：\r\n 教 [ jiào ]',
    zuci:['小学 ',' 中学 ',' 大学'],
    voice: ['xué'],
    voice1:'xué',
    voice1url:'cloud://carsonlib.6361-carsonlib-1257628958/icons/playvoice.png',
    voice2:'',
    voice2url:'',
    voice3:'',
    voice3url:'',
    voice4:'',
    voice4url:'',
    voice5:'',
    voice5url:'',
    voice6:'',
    voice6url:'',
  },

  hasChinese: function (str) { 
    return (str.length != str.replace(/[^\x00-\xff]/g,"**").length); 
  },

  startShow: function (str) {
    var that = this
    const db = wx.cloud.database()
    db.collection('HanyuInfo').where({
      hid: str
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        //console.log(res.data[0].bishun)
        //cloud://carsonlib.6361-carsonlib-1257628958/icons/playvoice.png
        //console.log(res.data[0].voice.length)
        var vvoice = res.data[0].voice
        var vvoice1 = ''
        var vvoice1url = ''
        var vvoice2 = ''
        var vvoice2url = ''
        var vvoice3 = ''
        var vvoice3url = ''
        var vvoice4 = ''
        var vvoice4url = ''
        var vvoice5 = ''
        var vvoice5url = ''
        var vvoice6 = ''
        var vvoice6url = ''
        var iconurl = 'cloud://carsonlib.6361-carsonlib-1257628958/icons/playvoice.png'
        if(vvoice.length>0) {
          for(var i=0;i<vvoice.length;i++) {
            if(i==0) {
              vvoice1 = vvoice[0]
              vvoice1url=iconurl
            }
            else if(i==1){
              vvoice2 = vvoice[1]
              vvoice2url=iconurl
            }
            else if(i==2){
              vvoice3 = vvoice[2]
              vvoice3url=iconurl
            }
            else if(i==3){
              vvoice4 = vvoice[3]
              vvoice4url=iconurl
            }
            else if(i==4){
              vvoice5 = vvoice[4]
              vvoice5url=iconurl
            }
            else if(i==5){
              vvoice6 = vvoice[5]
              vvoice6url=iconurl
            }
            else {
              console.log('error')
            }
          }
        }

        var des = res.data[0].details.split("五笔")
        var detailsformat = ''
        var zuciformat = ''
        var jycformat = ''
        var fycformat = ''


        if(des.length > 0) {
          detailsformat = des[0]
        }
        else {
          detailsformat = res.data[0].details
        }

        detailsformat = detailsformat.replace('笔画：','， 笔画：').replace('繁体：','， 繁体：')
        zuciformat = String(res.data[0].zuci)
        zuciformat = zuciformat.replace(/,/g, ' , ')
        jycformat = res.data[0].jyc
        fycformat = res.data[0].fyc
        jycformat = jycformat.replace('近义词','近义词：')
        fycformat = fycformat.replace('反义词','反义词：')

        that.setData({
          hid: res.data[0].hid,
          bishun: res.data[0].bishun,
          designation: res.data[0].designation,
          details: detailsformat,
          shiyi: res.data[0].shiyi,
          jyc: jycformat,
          fyc: fycformat,
          zuci: zuciformat,
          voice: res.data[0].voice,
          voice1: vvoice1,
          voice1url: vvoice1url,
          voice2: vvoice2,
          voice2url: vvoice2url,
          voice3: vvoice3,
          voice3url: vvoice3url,
          voice4: vvoice4,
          voice4url: vvoice4url,
          voice5: vvoice5,
          voice5url: vvoice5url,
          voice6: vvoice6,
          voice6url: vvoice6url,
        })
      }
    })
  },

  //获取输入字符串
  inputChange: function (e) {
    var that = this
    if (e.detail.value.length > 0) {
      //判断中文
      if (this.hasChinese( e.detail.value.substring(0,1))) {
        var str =  e.detail.value.substring(0,1)
        this.startShow(str)
      }
    }
  },

  //点击按钮显示字符串
  formSubmit: function (e) {
    //console.log(e.detail.value.ziinput.substring(0,1))
    var that = this
    if (e.detail.value.ziinput.length > 0) {
      //判断中文
      if (!this.hasChinese(e.detail.value.ziinput.substring(0,1))) {
        wx.showModal({
          title: '请输入中文',
          showCancel: false,
        })
      }
      else {
        var str = e.detail.value.ziinput.substring(0,1)
        this.startShow(str)
      }
    }
    else {
      wx.showModal({
        title: '请输入一个要查询的中文字符',
        showCancel: false,
       })
    }
  },

  playVoice: function(e) {
    var pinyin = String(e.currentTarget.dataset.voice)

    //āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ aoeiuü
    if(pinyin.indexOf('ā')>0){
      pinyin = pinyin.replace('ā','a')
      pinyin += '1'
    }
    else if(pinyin.indexOf('ō')>0){
      pinyin = pinyin.replace('ō','o')
      pinyin += '1'
    }
    else if(pinyin.indexOf('ē')>0){
      pinyin = pinyin.replace('ē','e')
      pinyin += '1'
    }
    else if(pinyin.indexOf('ī')>0){
      pinyin = pinyin.replace('ī','i')
      pinyin += '1'
    }
    else if(pinyin.indexOf('ū')>0){
      pinyin = pinyin.replace('ū','u')
      pinyin += '1'
    }
    else if(pinyin.indexOf('ǖ')>0){
      pinyin = pinyin.replace('ǖ','ü')
      pinyin += '1'
    }
    else if(pinyin.indexOf('á')>0){
      pinyin = pinyin.replace('á','a')
      pinyin += '2'
    }
    else if(pinyin.indexOf('ó')>0){
      pinyin = pinyin.replace('ó','o')
      pinyin += '2'
    }
    else if(pinyin.indexOf('é')>0){
      pinyin = pinyin.replace('é','e')
      pinyin += '2'
    }
    else if(pinyin.indexOf('í')>0){
      pinyin = pinyin.replace('í','i')
      pinyin += '2'
    }
    else if(pinyin.indexOf('ú')>0){
      pinyin = pinyin.replace('ú','u')
      pinyin += '2'
    }
    else if(pinyin.indexOf('ǘ')>0){
      pinyin = pinyin.replace('ǘ','ü')
      pinyin += '2'
    }
    else if(pinyin.indexOf('ǎ')>0){
      pinyin = pinyin.replace('ǎ','a')
      pinyin += '3'
    }
    else if(pinyin.indexOf('ǒ')>0){
      pinyin = pinyin.replace('ǒ','o')
      pinyin += '3'
    }
    else if(pinyin.indexOf('ě')>0){
      pinyin = pinyin.replace('ě','e')
      pinyin += '3'
    }
    else if(pinyin.indexOf('ǐ')>0){
      pinyin = pinyin.replace('ǐ','i')
      pinyin += '3'
    }
    else if(pinyin.indexOf('ǔ')>0){
      pinyin = pinyin.replace('ǔ','u')
      pinyin += '3'
    }
    else if(pinyin.indexOf('ǚ')>0){
      pinyin = pinyin.replace('ǚ','ü')
      pinyin += '3'
    }
    else if(pinyin.indexOf('à')>0){
      pinyin = pinyin.replace('à','a')
      pinyin += '4'
    }
    else if(pinyin.indexOf('ò')>0){
      pinyin = pinyin.replace('ò','o')
      pinyin += '4'
    }
    else if(pinyin.indexOf('è')>0){
      pinyin = pinyin.replace('è','e')
      pinyin += '4'
    }
    else if(pinyin.indexOf('ì')>0){
      pinyin = pinyin.replace('ì','i')
      pinyin += '4'
    }
    else if(pinyin.indexOf('ù')>0){
      pinyin = pinyin.replace('ù','u')
      pinyin += '4'
    }
    else if(pinyin.indexOf('ǜ')>0){
      pinyin = pinyin.replace('ǜ','ü')
      pinyin += '4'
    }

    var vo = wx.createInnerAudioContext()
    vo.src = "cloud://carsonlib.6361-carsonlib-1257628958/allduyin/" + pinyin + ".mp3"
    vo.play()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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