// pages/changePassword/changePassword.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: "",
    newPassword: "",
    newPasswordTwice: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 旧密码
  oldPasswordChange(e) {
    this.setData({
      oldPassword: e.detail
    })
  },
  // 新密码
  newPasswordChange(e) {
    this.setData({
      newPassword: e.detail
    })
  },
  // 新密码
  newPasswordTwiceChange(e) {
    this.setData({
      newPasswordTwice: e.detail
    })
  },
  // 表单提交
  formSubmit() {
    if (this.data.oldPassword === "") {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入旧密码"
      });
    } else if (this.data.newPassword === "") {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入新密码"
      });
    } else if (this.data.newPasswordTwice === "") {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请再次输入新密码"
      });
    } else if (this.data.newPassword !== this.data.newPasswordTwice) {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "两次密码不一致"
      });
    } else {
      wx.showLoading({
        mask: true,
        title: "提交中..."
      });
      wx.request({
        url: app.globalData.baseUrl + `/Merch/changePassword.html`,
        header: {
          Authorization: app.globalData.auth_code
        },
        data: {
          store_id: app.globalData.store_id,
          old_passwd: this.data.oldPassword,
          new_passwd: this.data.newPassword
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading();
          if (res.data.error_code === 0) {
            wx.showToast({
              title: "修改成功",
              mask: true,
              icon: "success",
              success: () => {
                setTimeout(() => {
                  wx.navigateBack()
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