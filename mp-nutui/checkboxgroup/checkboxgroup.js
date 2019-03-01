Compontents({
  properties: {
    name: String,
    checkBoxData: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    keys: {
      type: Object,

      default() {
        return {
          id: 'id',
          name: 'name',
          class: 'class',
          label: 'label',
          value: 'value',
          disabled: 'disabled'
        };
      }

    },
    customClass: {
      type: String,
      default: ''
    },
    label: {
      type: [String, Number, Boolean],
      default: ''
    },
    size: {
      type: [String, Number],
      default: 'base'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  data: {
    ignoreChange: false,
    checkboxValues: [],
    initialValue: JSON.parse(JSON.stringify(this.value))
  },
  components: {
    [nutcheckbox.name]: nutcheckbox
  },
  methods: {
    isObject(obj) {
      return obj !== null && typeof obj === 'object';
    },

    looseIndexOf(arr, val) {
      for (let i = 0; i < arr.length; i++) {
        if (this.looseEqual(arr[i], val)) {
          return i;
        }
      }

      return -1;
    },

    isOptionCheckedByDefault(item) {
      return this.looseIndexOf(this.data.initialValue, item[this.keys.value] || item) > -1;
    },

    looseEqual(a, b) {
      return a == b || (this.isObject(a) && this.isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
    },

    changeEvt(args, item) {
      if (this.data.ignoreChange) {
        return;
      }

      const checked = args[0];
      const label = args[1];
      const e = args[2];
      let value = [];
      const itemValue = item[this.keys.value] || item;
      const i = this.looseIndexOf(this.value, itemValue);

      if (checked && i < 0) {
        value = this.value.concat(itemValue);
      }

      if (!checked && i > -1) {
        value = this.value.slice(0, i).concat(this.value.slice(i * 1));
      }

      this.$emit('input', value);
      this.$emit('change', value, label, e);
    }

  }
});