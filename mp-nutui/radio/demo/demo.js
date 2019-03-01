Compontents({
  data: {
    result: '',
    radioVal1: 2,
    radioVal2: '选中且禁用',
    radioVal3: 'b',
    radioVal4: 'b',
    radioVal5: 'a'
  },
  methods: {
    radioChange(label) {
      alert('选中的是' + label);
    }

  }
});