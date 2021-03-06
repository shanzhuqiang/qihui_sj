// pages/shouyi/shouyi.js
const app = getApp()
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cahs_list: [],
    money: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money
    })
    this.getCashListByTime()
  },
  // 今日营业额统计
  dialogOne() {
    Dialog.alert({
      message: '您今日的订单金额总和',
    }).then(() => {
      // on close
    });
  },
  // 收益记录
  getCashListByTime() {
    wx.request({
      url: app.globalData.baseUrl + `/Merch/cashListByTime.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code === 0) {
          let cahs_list = []
          res.data.bizobj.cahs_list.forEach(el =>{
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