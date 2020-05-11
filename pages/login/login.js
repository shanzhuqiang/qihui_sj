// pages/changePassword/changePassword.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 用户名
  userBlur(e) {
    this.setData({
      user: e.detail.value
    })
  },
  // 用户名
  userChange(e) {
    this.setData({
      user: e.detail
    })
  },
  // 密码
  passwordChange(e) {
    this.setData({
      password: e.detail
    })
  },
  // 表单提交
  formSubmit(e) {
    if (this.data.user === "") {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入用户名"
      });
    } else if (this.data.password === "") {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入密码"
      });
    } else {
      wx.showLoading({
        mask: true,
        title: "提交中..."
      });
      wx.request({
        url: app.globalData.baseUrl + `/Merch/login.html`,
        header: {
          Authorization: app.globalData.auth_code
        },
        data: {
          username: this.data.user,
          password: this.data.password
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading();
          if (res.data.error_code === 0) {
            app.globalData.merch_login = 1
            app.globalData.store_id = res.data.bizobj.store_id
            wx.showToast({
              title: "登录成功",
              mask: true,
              icon: "success",
              success: () => {
                setTimeout(() => {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }, 1500);
              }
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