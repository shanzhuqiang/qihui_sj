// pages/shouyi/shouyi.js
const app = getApp()
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticsSummary: {},
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
  },
  // 订单流水明细
  goDingdanList() {
    wx.navigateTo({
      url: '../dingdanList/dingdanList',
    })
  },
  // 提现记录明细
  goTixianList() {
    wx.navigateTo({
      url: '../tixianList/tixianList',
    })
  },
  // 今日营业额统计
  dialogOne() {
    Dialog.alert({
      message: '您今日的订单金额总和',
    }).then(() => {
      // on close
    });
  },
  // 销售额
  dialogTwo() {
    Dialog.alert({
      message: '您本月的订单金额总和',
    }).then(() => {
      // on close
    });
  },
  // 可提现金额
  dialogThree() {
    Dialog.alert({
      message: '您当前可以提现的金额',
    }).then(() => {
      // on close
    });
  },
  // 待确认金额
  dialogFour() {
    Dialog.alert({
      message: '订单已完成，该笔收入需在1个工作日后自动转换为可提现金额',
    }).then(() => {
      // on close
    });
  },
  // 提现
  withdraw () {
    if (this.data.staticsSummary.available_money && this.data.staticsSummary.available_money !== '0.0' && this.data.staticsSummary.available_money !== '0.00') {
      wx.showModal({
        title: '提示',
        content: '平台将于每周五统一进行打款，最晚于打款日后三个工作日内完成打款操作',
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
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "当前可提现余额为0，无法提现"
      })
    }
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