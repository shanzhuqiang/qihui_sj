// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datePickerIsShow: false,
    startAt: "",
    endAt: ""  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startAt: this.getCurrentDate(),
      endAt: this.getCurrentDate() 
    })
  },
  // 完成选择
  onDatePickerOnSureClick(data) {
    console.log(data)
  },
  // 点击蒙版，日期选择器会消失
  onTouchmask () {
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
  getCurrentDate: function () {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    var time = year + "-" + month + "-" + date;
    return time;
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