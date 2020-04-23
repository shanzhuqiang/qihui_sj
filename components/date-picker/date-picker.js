// components/date-picker/date-picker.js
// 初始化日期模态框数据
let date = new Date();
let years = [];
let months = [];
let days = [];
for (let i = date.getFullYear() - 10; i <= (date.getFullYear() + 10); i++) {
  years.push(String(i))
}
for (let i = 1; i <= 12; i++) {
  months.push(String(i))
}
//后面会根据需求动态改变每月的天数，数组
for (let i = 1; i <= 31; i++) {
  days.push(String(i))
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //开始期间
    startAt: {
      type: String,
      value: "",
      observer: "onStartAt"
    },
    //结束时间
    endAt: {
      type: String,
      value: "",
      observer: "onEndAt"
    },
    isShow: {
      type: Boolean,
      value: false,
      observer: "onDateShow"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    years: years,
    months: months,
    days: days,
    startValue: [],
    endValue: [],
    showPicker: false,
    tapIndex: "startTime"
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  lifetimes: {
    attached: function () {
      this.setData({
        days: days,
        tapIndex: this.data.tapIndex,
        startValue: this.data.startValue,
        endValue: this.data.endValue
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 时间滚动
    bindPickerChange(e) {
      if (this.data.tapIndex == 'startTime') {
        this.data.startValue = e.detail.value;
      } else {
        this.data.endValue = e.detail.value;
      }
      this.calculate();
    },
    // 滚动改变时间
    calculate() {
      if (this.data.tapIndex == "startTime") {
        let curYear = this.data.years[this.data.startValue[0]];
        let curMonth = this.data.months[this.data.startValue[1]];
        let curDay = this.data.days[this.data.startValue[2]];
        this.data.startAt = curYear + '-' + (curMonth.length == 1 ? ('0' + curMonth) : curMonth) + '-' + (curDay.length == 1 ? ('0' + curDay) : curDay);

        this.setData({
          days: this.getTotalDayByMonth(curYear, curMonth),
          startAt: this.data.startAt
        })
      } else {
        let endCurYear = this.data.years[this.data.endValue[0]];
        let endCurMonth = this.data.months[this.data.endValue[1]];
        let endCurDay = this.data.days[this.data.endValue[2]];
        this.data.endAt = endCurYear + '-' + (endCurMonth.length == 1 ? ('0' + endCurMonth) : endCurMonth) + '-' + (endCurDay.length == 1 ? ('0' + endCurDay) : endCurDay);

        this.setData({
          days: this.getTotalDayByMonth(endCurYear, endCurMonth),
          endAt: this.data.endAt,
        })
      }
    },
    // 点击蒙版，日期选择器会消失
    onTouchmask: function (event) {
      this.triggerEvent('onTouchmask', {});
    },
    // 点击确定，完成选择
    onSureClick(e) {
      if (new Date(this.data.startAt).getTime() <= new Date(this.data.endAt).getTime()) {
        this.triggerEvent('sureclick', {
          startAt: this.data.startAt,
          endAt: this.data.endAt,
        });
      } else {
        wx.showToast({
          title: '开始时间不能晚于结束时间',
          icon: 'none',
          duration: 2000
        })
      }
    },
    // 界面切换---开始于/结束于
    onTapTimeIndex(e) {
      this.data.tapIndex = e.currentTarget.dataset.type;
      if (this.data.tapIndex == "startTime") {
        let curYear = this.data.years[this.data.startValue[0]];
        let curMonth = this.data.months[this.data.startValue[1]];
        days = this.getTotalDayByMonth(curYear, curMonth);
      } else {
        let endCurYear = this.data.years[this.data.endValue[0]];
        let endCurMonth = this.data.months[this.data.endValue[1]];
        days = this.getTotalDayByMonth(endCurYear, endCurMonth);
      }
      this.setData({
        tapIndex: this.data.tapIndex,
        startValue: this.data.startValue,
        endValue: this.data.endValue,
        days: days
      })
    },
    // 处理界面传递参数---startAt
    onStartAt() {
      this.data.startValue = this.getDateArrWithtime(this.data.startAt, years, months, days);
      days = this.getTotalDayByMonth(this.data.years[this.data.startValue[0]], this.data.months[this.data.startValue[1]]);
    },
    // 处理界面传递参数---endAt
    onEndAt() {
      this.data.endValue = this.getDateArrWithtime(this.data.endAt, years, months, days);
    },
    // 处理界面传递参数---isShow
    onDateShow() {
      this.setData({
        showPicker: this.data.isShow
      });
    },
    //获取月的总天数--数组
    getTotalDayByMonth: function (year, month) {
      month = parseInt(month, 10);
      var d = new Date(year, month, 0);
      let totalDay = d.getDate();
      let daySource = [];
      for (let i = 1; i <= totalDay; i++) {
        daySource.push(String(i))
      }
      return daySource;
    },
    //根据时间2019-01-02  得到 ['2019','1','2']
    getDateArrWithtime: function (str, years, months, days) {
      let arr = [];
      arr = (str).split('-');
      arr[0] = years.indexOf(arr[0]);
      arr[1] = months.indexOf((arr[1].startsWith('0') ? arr[1].substr(1, arr[1].length) : arr[1]));
      arr[2] = days.indexOf((arr[2].startsWith('0') ? arr[2].substr(1, arr[2].length) : arr[2]));
      return arr;
    }
  }
})
