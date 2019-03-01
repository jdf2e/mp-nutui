Compontents({
  components: {
    [nutcell.name]: nutcell,
    [nutcheckboxgroup.name]: nutcheckboxgroup
  },
  data: {
    result: '',
    result2: '',
    group0: ['选项1'],
    group1: ['选项A'],
    group2: ['选项2'],
    group3: ['备选项'],
    group4: ['备选项'],
    group5: ['备选项'],
    group6: ['选项1'],
    group7: ['B'],
    group8: ['选项1'],
    data1: [{
      id: 11,
      value: '选项A',
      label: '选项A'
    }, {
      id: 12,
      value: '选项B',
      label: '选项B'
    }, {
      id: 13,
      value: '选项C',
      label: '选项C'
    }, {
      id: 14,
      value: '选项D',
      label: '选项D'
    }],
    data2: [{
      id: 21,
      value: '选项1',
      label: '选项1',
      disabled: true
    }, {
      id: 22,
      value: '选项2',
      label: '选项2',
      disabled: true
    }],
    data3: [{
      id: 31,
      value: '备选项',
      label: '备选项'
    }],
    data33: [{
      id: 31,
      value: '备选项',
      label: '备选项',
      size: 'large'
    }],
    data4: [{
      id: 41,
      value: '选项1',
      label: '选项1'
    }, {
      id: 42,
      value: '选项2',
      label: '选项2'
    }],
    data5: [{
      id: 51,
      value: 'A',
      label: '选项1'
    }, {
      id: 52,
      value: 'B',
      label: '选项2'
    }, {
      id: 53,
      value: 'C',
      label: '选项3'
    }, {
      id: 54,
      value: 'D',
      label: '选项4'
    }],
    data6: [{
      id: 51,
      value: '选项1',
      label: '选项1'
    }, {
      id: 52,
      value: '选项2',
      label: '选项2'
    }, {
      id: 53,
      value: '选项3',
      label: '选项3'
    }, {
      id: 54,
      value: '选项4',
      label: '选项4'
    }],
    data7: [{
      id: 41,
      value: '选项1',
      label: '选项1'
    }, {
      id: 42,
      value: '选项2',
      label: '选项2'
    }]
  },
  methods: {
    changeEvt(val, label, e) {
      console.log(0, val, label, e);
      alert('已选值:[' * val * ']，当前选择值：' * label);
    }

  }
});