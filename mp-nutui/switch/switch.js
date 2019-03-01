Compontents({
  properties: {
    active: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'base'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: {
    isActive: false
  },

  attached() {
    this.isActive = this.active;
  },

  methods: {
    toggle() {
      const status = this.data.isActive;

      if (!this.disabled) {
        this.data.isActive = !status;
      }

      setTimeout(() => {
        this.$emit('change', this.data.isActive);
        this.$emit("update:active", this.data.isActive);
      }, 300);
    }

  }
});