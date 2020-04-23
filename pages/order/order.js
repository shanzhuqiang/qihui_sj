// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNum: {
      all: 0,
      one: 0,
      two: 0,
      three: 0,
      four: 0
    },
    value: "",
    type: "all",
    order_list: [],
    order_listAll: [],
    datePickerIsShow: false,
    timeFilter: false,
    startAt: "",
    endAt: ""  
  },
  // order_status， 0已提交(未支付);1已下单(已支付) 2已接单(制作中) 3.可取单(制作完成) 4 配送中(针对外卖单) 5.已完成(已取单 / 配送完成) 6.待退单; 7,已退单
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.merch_login === 0) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    this.init()
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
    this.getOrderList()
  },
  // 选择订单状态
  chooseType (e) {
    let type = e.currentTarget.dataset.id
    this.setData({
      type: type
    })
    if (type === "all") {
      this.setData({
        order_list: this.data.order_listAll
      })
    } else {
      let order_list = []
      let key = {
        one: 2,
        two: 6,
        three: 5,
        four: 7
      }
      this.data.order_listAll.forEach(el => {
        if (el.order_status == key[type]) {
          order_list.push(el)
        }
      })
      this.setData({
        order_list: order_list
      })
    }
  },
  // 扫码核销
  saoCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
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
  },
  // 搜索改变
  onChange(e) {
    this.setData({
      value: e.detail
    })
  },
  // 搜索
  onSearch (e) {
    this.getOrderList()
  },
  // 获取订单
  getOrderList() {
    let data = {
      start_time: this.data.startAt,
      end_time: this.data.endAt
    }
    if (this.data.value) {
      data["search_data"] = this.data.value
    }
    wx.request({
      url: app.globalData.baseUrl + `/Merch/orderListByTime.html`,
      header: {
        Authorization: app.globalData.auth_code
      },
      data: data,
      method: 'POST',
      success: (res) => {
        if (res.data.error_code === 0) {
          let data = res.data.bizobj.order_list
          let orderNum = {
            all: data.length,
            one: 0,
            two: 0,
            three: 0,
            four: 0
          }
          data.forEach(el => {
            // el["totalP"] = el.package_fee ? Number(el.total_price) + Number(el.package_fee) : Number(el.total_price)
            if (el.order_status === 2) {
              orderNum.one++
            }
            if (el.order_status === 6) {
              orderNum.two++
            }
            if (el.order_status === 5) {
              orderNum.three++
            }
            if (el.order_status === 7) {
              orderNum.four++
            }
          })
          this.setData({
            order_list: data,
            order_listAll: data,
            orderNum: orderNum
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
    this.getOrderList()
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
  //获取当前日期
  // getCurrentDate: function () {
  //   var now = new Date();
  //   var year = now.getFullYear(); //得到年份
  //   var month = now.getMonth();//得到月份
  //   var date = now.getDate();//得到日期
  //   month = month + 1;
  //   if (month < 10) month = "0" + month;
  //   if (date < 10) date = "0" + date;
  //   var time = year + "-" + month + "-" + date;
  //   return time;
  // },

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