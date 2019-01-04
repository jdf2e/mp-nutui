# Calendar 日历

## 基本用法

日期选择（不带默认日期）

```html
<nut-calendar 
    :is-visible="isVisible"
    :default-value="date"
    @close="switchPicker('isVisible')"
    @choose="setChooseValue"
    :start-date="`2018-10-11`"
    :end-date="`2019-11-11`"
>
</nut-calendar>
```

日期选择（有默认日期，选择后自动回填）

```html
<nut-calendar 
    :is-visible="isVisible2"
    :default-value="date2"
    :is-auto-back-fill="true"
    @close="switchPicker('isVisible2')"
    @choose="setChooseValue2"
>
</nut-calendar>
```

日期区间选择（有默认日期）

```html
<nut-calendar 
    :is-visible="isVisible1"
    :default-value="date1"
    type="range"
    @close="switchPicker('isVisible1')"
    @choose="setChooseValue1"
>
</nut-calendar>
```

日期区间选择（不限制开始结束时间）

```html
<nut-calendar 
    :is-visible="isVisible3"
    :default-value="date3"
    type="range"
    :start-date="null"
    :end-date="null"
    :animation="`nutSlideUp`"
    @close="switchPicker('isVisible3')"
    @choose="setChooseValue3"
>
</nut-calendar>
```

```javascript
export default {
    data() {
        return {
            isVisible: false,
            isVisible1: false,
            isVisible2: false,
            isVisible3: false,
            date: null,
            dateWeek: null,
            date1: ['2018-12-22', '2019-01-08'],
            date2: '2018-11-22',
            date3: null
            
        };
    },
    methods: {
       switchPicker(param) {
            this[`${param}`] = !this[`${param}`];
        },
        setChooseValue(param) {
            this.date = param[3];
            this.dateWeek = param[4];
        },
        setChooseValue1(param) {
            this.date1 = [...[param[0][3],param[1][3]]];
        },
        setChooseValue2(param) {
            this.date2 = param[3];
        },
        setChooseValue3(param) {
            this.date3 = [...[param[0][3],param[1][3]]];
        }
    }
};
```

## Props

| 字段 | 说明 | 类型 | 默认值
|----- | ----- | ----- | ----- 
| type | 类型，日期选择'one'，区间选择'range' | String | 'one'
| isVisible | 是否可见 | Boolean | false
| animation | 日历进入方向，右滑'nutSlideRight'， 上拉'nutSlideUp' | String | 'nutSlideRight' 
| isAutoBackFill | 是否自动回填 | Boolean | false
| isOpenRangeSelect | 是否开启区间选择 | Boolean | false
| title | 显示标题 | String | ‘选择日期’
| defaultValue | 默认值，日期选择String格式，区间选择Array格式 | String || Array | null
| startDate | 开始日期， 如果不限制开始日期传null | String | 今天
| default | 结束日期，如果不限制结束日期传null | String | 距离今天五个月

## Event

| 字段 | 说明 | 回调参数 
|----- | ----- | ----- 
| choose | 选择之后或是点击确认按钮触发 | 日期数组（包含年月日和星期） 
| close | 关闭时触发 | -