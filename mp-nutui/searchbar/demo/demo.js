Compontents({
  data: {},
  methods: {
    focusFun() {
      console.log('获取焦点操作！');
    },

    inputFun(value) {
      console.log(value);
      console.log('您正在输入...');
    },

    blurFun(value) {
      console.log(value);
      console.log('您已失去焦点！');
    },

    submitFun(value) {
      console.log(value);
      console.log('默认提交操作！');
    }

  }
});