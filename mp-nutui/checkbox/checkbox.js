Compontents({
  properties: {
    name: {
      type: String
    },
    size: {
      type: [String, Number, Boolean],
      default: 'base'
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      required: true
    },
    trueValue: {
      default: true
    },
    falseValue: {
      default: false
    },
    submittedValue: {
      type: String,
      default: 'on' // HTML default

    },
    checked: {
      type: Boolean,
      default: false
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
  data: {
    isChecked: this.value == this.trueValue || this.checked
  },

  ready() {
    this.triggerEvent('input', this.isChecked ? this.trueValue : this.falseValue, this.label);
  },

  methods: {
    isObject(obj) {
      return obj !== null && typeof obj === 'object';
    },

    looseEqual(a, b) {
      return a == b || (this.isObject(a) && this.isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
    },

    changeEvt(event) {
      const isCheckedPrevious = this.data.isChecked;
      const isChecked = event.target.checked;
      this.$emit('input', isChecked ? this.trueValue : this.falseValue, this.label, event);

      if (isCheckedPrevious !== isChecked) {
        this.$emit('change', isChecked ? this.trueValue : this.falseValue, this.label, event);
      }
    }

  }
});