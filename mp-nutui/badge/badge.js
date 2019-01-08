Compontents({
  properties: {
    value: {
      type: String
    },
    max: {
      type: Number,
      default: 10000
    },
    isDot: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '0'
    },
    right: {
      type: String,
      default: '0'
    }
  },
  data: {
    stl: {
      top: this.top,
      right: this.right
    }
  }
});