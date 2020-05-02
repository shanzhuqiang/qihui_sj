// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merch_login: "",
    homeData: null
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
    if (app.globalData.auth_code) {
      this.judgeMerch()
    } else {
      app.readyCallback = res => {
        this.judgeMerch()
      }
    }
  },
  // 判断是否登录
  judgeMerch() {
    this.setData({
      merch_login: app.globalData.merch_login
    })
    if (this.data.merch_login === 1) {
      this.getStaticsByTime()
    }
  },
  // 扫码核销
  saoCode() {
    if (this.data.merch_login === 1) {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          console.log(res)
          return false
          wx.showLoading({
            mask: true,
            title: "核销中..."
          });
          wx.request({
            url: app.globalData.baseUrl + `/Merch/changeOrderStatus.html`,
            header: {
              Authorization: app.globalData.auth_code
            },
            data: {
              store_id: app.globalData.store_id,
              order_id: res.result,
              status: 5
            },
            method: 'POST',
            success: (res) => {
              wx.hideLoading();
              if (res.data.error_code === 0) {
                wx.showToast({
                  title: "订单已完成",
                  mask: true,
                  icon: "success"
                });
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
        }
      })
    } else if (this.data.merch_login !== 1) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  getStaticsByTime () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let time = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day)
    let data = {
      start_time: time,
      end_time: time
    }
    wx.request({
      url: app.globalData.baseUrl + `/Merch/staticsByTime.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      data: data,
      method: 'POST',
      success: (res) => {
        wx.stopPullDownRefresh()
        if (res.data.error_code === 0) {
          this.setData({
            homeData: res.data.bizobj
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
  // 进入营业额
  goShouyi() {
    console.log(this.data.merch_login)
    if (this.data.merch_login === 1) {
      wx.navigateTo({
        url: '../shouyi/shouyi?money=' + this.data.homeData.total_money,
      })
    } else if (this.data.merch_login !== 1) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  // 订单数
  orderNum() {
    if (this.data.merch_login === 1) {
      wx.switchTab({
        url: '../order/order',
      })
    } else if(this.data.merch_login !== 1) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
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
    this.judgeMerch()
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