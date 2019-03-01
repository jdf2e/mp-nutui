Compontents({
  properties: {
    value: {
      type: [String, Number, Boolean],
      default: false
    },
    label: {
      type: [String, Number, Boolean]
    },
    size: {
      type: String,
      default: 'base'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: true
    }
  },
  data: {},

  ready() {},

  methods: {
    changeEvt(event) {
      this.$emit("change", this.label);
      this.$emit('input', this.label);
    }

  }
});