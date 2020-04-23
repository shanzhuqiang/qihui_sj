// pages/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    storeInfo: {}
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
    this.getStoreInfo()
  },
  // 获取商家详情
  getStoreInfo() {
    wx.request({
      url: app.globalData.baseUrl + `/Merch/storeInfo.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      data: {
        store_id: app.globalData.store_id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code === 0) {
          let storeInfo = res.data.bizobj.data
          this.setData({
            storeInfo: res.data.bizobj.data,
            checked: storeInfo.store_state == 1 ? true : false
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
  // 改变商家状态
  onChange({ detail }) {
    console.log(detail)
    wx.request({
      url: app.globalData.baseUrl + `/Merch/changeStoreState.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      data: {
        store_id: app.globalData.store_id,
        status: detail ? 1 : 0
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code === 0) {
          wx.showToast({
            title: '修改成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.setData({
                checked: detail
              });
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