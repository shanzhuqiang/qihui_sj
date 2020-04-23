//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 登录接口
        wx.request({
          url: this.globalData.baseUrl + `/Merch/auth.html`,
          data: {
            code: res.code
          },
          method: 'POST',
          success: (res) => {
            if (res.data.error_code === 0) {
              let data = res.data.bizobj.data
              this.globalData.auth_code = data.auth_code
              this.globalData.merch_login = data.merch_login
              //1:已登录 0:未登录
              this.globalData.store_id = data.store_id
              if (this.readyCallback) {
                this.readyCallback()
              }
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
  },
  globalData: {
    auth_code: "",
    merch_login: "",
    store_id: "",
    baseUrl: "https://o2o.pinecc.cn/api"
  }
})