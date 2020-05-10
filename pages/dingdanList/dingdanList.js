// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    cahs_list: [],
    datePickerIsShow: false,
    timeFilter: false,
    startAt: "",
    endAt: ""  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.merch_login !== 1) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      this.init()
    }
  },
  // 初始化
  init () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let time = year + "-" + (month < 10 ? "0" + month : month) + "-01"
    let time2 = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day)
    this.setData({
      startAt: time,
      endAt: time2
    })
    this.getCashListByTime()
  },
  // 搜索改变
  onChange(e) {
    this.setData({
      value: e.detail
    })
    console.log(this.data.value)
  },
  // 获取订单
  getCashListByTime() {
    let data = {
      start_time: this.data.startAt,
      end_time: this.data.endAt
    }
    wx.request({
      url: app.globalData.baseUrl + `/Merch/cashListByTime.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      data: data,
      method: 'POST',
      success: (res) => {
        if (res.data.error_code === 0) {
          let cahs_list = []
          res.data.bizobj.cahs_list.forEach(el => {
            let obj = {}
            for (let key in el) {
              obj["time"] = key
              obj["cash_list"] = el[key]["cash_list"]
              obj["is_today"] = el[key]["is_today"]
            }
            cahs_list.push(obj)
          })
          cahs_list.forEach(el => {
            el.cash_list.forEach(el2 => {
              if (el2.cash.indexOf("+") === 0) {
                el2["cashOn"] = true
              }
            })
          })
          this.setData({
            cahs_list: cahs_list
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
  },
  // 完成选择
  onDatePickerOnSureClick(e) {
    this.setData({
      startAt: e.detail.startAt,
      endAt: e.detail.endAt
    })
    this.setData({
      timeFilter: true,
      datePickerIsShow: false
    });
    this.getCashListByTime()
  },
  // 点击蒙版，日期选择器会消失
  onTouchmask() {
    this.setData({
      datePickerIsShow: false
    });
  },
  //选择时间
  selectDate: function (e) {
    this.setData({
      datePickerIsShow: true
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.init()
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