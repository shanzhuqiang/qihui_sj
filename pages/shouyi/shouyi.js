// pages/shouyi/shouyi.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticsSummary: {},
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
    this.getStaticsSummary()
    this.getCashListByTime()
  },
  // 提现
  withdraw () {
    wx.showModal({
      title: '提示',
      content: '平台将于每月5号、15号对商家进行打款，打款日起，3日内到账，确认提现吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: "加载中..."
          });
          wx.request({
            url: app.globalData.baseUrl + `/Merch/withdraw.html`,
            header: {
              Authorization: app.globalData.auth_code
            },
            data: {
              store_id: app.globalData.store_id,
              cash: this.data.staticsSummary.available_money
            },
            method: 'POST',
            success: (res) => {
              wx.hideLoading();
              if (res.data.error_code === 0) {
                wx.showToast({
                  title: '申请成功',
                  mask: true,
                  icon: 'success',
                  success() {
                    setTimeout(() => {
                      wx.navigateBack()
                    }, 1500)
                  }
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
        } else if (res.cancel) {
        }
      }
    })
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
  // 可提现/待确认
  getStaticsSummary() {
    wx.request({
      url: app.globalData.baseUrl + `/Merch/staticsSummary.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      data: {
        store_id: app.globalData.store_id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code === 0) {
          this.setData({
            staticsSummary: res.data.bizobj
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