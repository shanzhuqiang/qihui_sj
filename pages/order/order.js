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
    if (app.globalData.merch_login !== 1) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      this.init()
    }
  },
  // 订单详情
  goOrderInfo(e) {
    wx.navigateTo({
      url: `../orderInfo/orderInfo?id=${e.currentTarget.dataset.id}`,
    }) 
  },
  // 同意退单
  agree(e) {
    wx.showModal({
      title: '提示',
      content: '确认同意退单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: "提交中..."
          });
          let data = {
            store_id: app.globalData.store_id,
            order_id: e.currentTarget.dataset.id,
            status: 7
          }
          wx.request({
            url: app.globalData.baseUrl + `/Merch/changeOrderStatus.html`,
            header: {
              Authorization: app.globalData.auth_code
            },
            data: data,
            method: 'POST',
            success: (res) => {
              wx.hideLoading();
              if (res.data.error_code === 0) {
                this.data.order_list.forEach(el =>{
                  el.orders.forEach(el2 =>{
                    if (el2.order_id == e.currentTarget.dataset.id) {
                      el2["order_status"] = 7
                      el2["order_status_tip"] = "已退单"
                    }
                  })
                })
                this.setData({
                  order_list: this.data.order_list
                })
                wx.showToast({
                  title: "退单成功",
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
        } else if (res.cancel) {
        }
      }
    })
  },
  // 不同意退单
  notAgree(e) {
    wx.showModal({
      title: '提示',
      content: '确认驳回退单请求吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: "提交中..."
          });
          let data = {
            store_id: app.globalData.store_id,
            order_id: e.currentTarget.dataset.id,
            status: 8
          }
          wx.request({
            url: app.globalData.baseUrl + `/Merch/changeOrderStatus.html`,
            header: {
              Authorization: app.globalData.auth_code
            },
            data: data,
            method: 'POST',
            success: (res) => {
              wx.hideLoading();
              if (res.data.error_code === 0) {
                this.data.order_list.forEach(el => {
                  el.orders.forEach(el2 => {
                    if (el2.order_id == e.currentTarget.dataset.id) {
                      el2["order_status"] = 2
                      el2["order_status_tip"] = "商家已接单"
                    }
                  })
                })
                wx.showToast({
                  title: "驳回成功",
                  mask: true,
                  icon: "success"
                });
                this.setData({
                  order_list: this.data.order_list
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
    this.getOrderList()
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
              this.init()
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
  // 打电话
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile //仅为示例，并非真实的电话号码
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
        wx.stopPullDownRefresh()
        if (res.data.error_code === 0) {
          let order_list = []
          res.data.bizobj.order_list.forEach(el => {
            let obj = {}
            for (let key in el) {
              obj["time"] = key
              obj["orders"] = el[key]["orders"]
              obj["is_today"] = el[key]["is_today"]
            }
            order_list.push(obj)
          })
          console.log(order_list)
          // 获取各个订单状态类型的数量
          let orderNum = {
            all: 0,
            one: 0,
            two: 0,
            three: 0,
            four: 0
          }
          order_list.forEach(el => {
            if (el.is_today === 1) {
              orderNum.all += el.orders.length
              el["timeShow"] = true
              el.orders.forEach(el2 => {
                el2["isShow"] = true
                if (el2.order_status === 2) {
                  orderNum.one++
                }
                if (el2.order_status === 6) {
                  orderNum.two++
                }
                if (el2.order_status === 5) {
                  orderNum.three++
                }
                if (el2.order_status === 7) {
                  orderNum.four++
                }
              })
            }
          })
          // 判断显示
          if (this.data.type === "all") {
            order_list.forEach(el => {
              el["timeShow"] = true
              el.orders.forEach(el2 => {
                el2["isShow"] = true
              })
            })
          } else {
            let key = {
              one: 2,
              two: 6,
              three: 5,
              four: 7
            }
            order_list.forEach(el => {
              el["timeShow"] = false
              el.orders.forEach(el2 => {
                if (el2.order_status == key[this.data.type]) {
                  el2["isShow"] = true
                  el["timeShow"] = true
                } else {
                  el2["isShow"] = false
                }
              })
            })
          }
          this.setData({
            order_list: order_list,
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
    this.init()
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