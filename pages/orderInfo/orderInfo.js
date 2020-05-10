// pages/orderInfo/orderInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: "",
    orderInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.id
    })
    this.getOrderInfo()
  },
  // 获取订单详情
  getOrderInfo() {
    wx.request({
      url: app.globalData.baseUrl + `/Order/orderDetail.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      data: {
        order_id: this.data.order_id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code === 0) {
          let data = res.data.bizobj.data
          this.setData({
            orderInfo: data
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
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.orderInfo.order_info.mobile
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