Compontents({
  components: {
    [nutcell.name]: nutcell,
    [nutactionsheet.name]: nutactionsheet
  },
  data: {
    sex: '请选择',
    agespec: '请选择',
    isVisible: false,
    isVisible1: false,
    menuItems: [{
      'name': '男',
      'value': 0
    }, {
      'name': '女',
      'value': 1
    }],
    age: '请选择',
    isVisible2: false,
    menuItems2: [{
      'name': '20岁以下',
      'value': 0
    }, {
      'name': '20~40岁',
      'value': 1
    }, {
      'name': '40~60岁',
      'value': 2
    }, {
      'name': '60以上',
      'value': 3
    }],
    constellation: '请选择',
    isVisible3: false,
    menuItems3: [{
      'title': '天蝎座',
      'value': 0
    }, {
      'title': '巨蟹座',
      'value': 1
    }, {
      'title': '双鱼座',
      'value': 2
    }, {
      'title': '水瓶座',
      'value': 3
    }],
    isVisible4: false,
    menuItems4: [{
      'name': '确定'
    }],
    isVisible5: false
  },
  methods: {
    switchActionSheet(param) {
      this[`${param}`] = !this[`${param}`];
    },

    chooseItem(itemParams) {
      this.data.sex = itemParams.name;
    },

    chooseItemAgeSpec(itemParams) {
      this.data.agespec = itemParams.name;
    },

    chooseItemAge(itemParams) {
      this.data.age = itemParams.name;
    },

    chooseItemConstellation(itemParams) {
      this.data.constellation = itemParams.title;
    }

  }
});