Compontents({
  mixins: [locale],
  properties: {
    hasIcon: {
      type: Boolean,
      default: false
    },
    placeText: {
      type: String
    },
    hasSearchButton: {
      type: Boolean,
      default: true
    },
    hasTextButton: {
      type: Boolean,
      default: false
    },
    textInfo: {
      type: String
    },
    animation: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  components: {
    [nuticon.name]: nuticon
  },
  data: {
    value: '',
    //输入值
    hasCloseIcon: false,
    inputFocusAnimation: false
  },
  methods: {
    //清空 input 输入
    clearInput: function () {
      this.data.value = '';
      this.data.hasCloseIcon = false;
    },
    focusFun: function () {
      this.data.inputFocusAnimation = true;
      this.$emit('focus');
    },
    inputFun: function () {
      this.data.hasCloseIcon = this.data.value ? true : false;
      this.$emit('input', this.data.value);
    },
    blurFun: function () {
      this.data.inputFocusAnimation = false;
      this.$emit('blur', this.data.value);
    },
    submitFun: function () {
      this.$emit('submit', this.data.value);
    }
  }
});