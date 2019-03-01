Compontents({
  properties: {
    type: {
      type: String,
      default: ''
    },
    shape: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean
    },
    block: {
      type: Boolean
    },
    small: {
      type: Boolean
    },
    label: {
      type: Boolean
    },
    color: {
      type: String,
      default: ''
    }
  },
  components: {
    'nut-icon': Icon
  },
  data: {
    btnCls: ''
  },

  ready() {
    this.initStyle();
    this.initIcon();
  },

  methods: {
    initStyle() {
      this.data.btnCls = `nut-button ${this.type} ${this.shape}`;
      this.data.btnCls += this.small ? ' small' : '';
      this.data.btnCls += this.block ? ' block' : '';
      this.data.btnCls += this.label ? ' label' : '';
    },

    initIcon() {
      if (!this.$slots.default) {
        if (this.small) {
          this.data.btnCls += ' no-txt-small';
        } else {
          this.data.btnCls += ' no-txt';
        }
      }
    },

    clickHandler() {
      this.$emit('click');
    }

  }
});