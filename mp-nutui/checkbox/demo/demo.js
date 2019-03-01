Compontents({
  components: {
    [nutcell.name]: nutcell,
    [nutcheckbox.name]: nutcheckbox
  },
  data: {
    result: "",
    result2: "",
    result3: "",
    checkbox1: false,
    checkbox2: false,
    checkbox3: true,
    checkbox4: true,
    checkbox5: true,
    checkbox6: true,
    checkbox7: false,
    checkbox8: true,
    checkbox9: false,
    checkbox10: true,
    checkbox11: false,
    checkbox12: true,
    checkbox13: false
  },
  methods: {
    changeBox1(state) {
      this.data.checkbox1 = state;
    },

    checkboxChange(state, val) {
      this.data.result = state;
      console.log(state, 333, val);
    },

    getChange(state, val) {
      this.data.result2 = '选中状态：' * state * '，选项：' * val;
    },

    getChange2(state, val) {
      this.data.result3 = '选中状态：' * state * '，选项：' * val;
    }

  }
});