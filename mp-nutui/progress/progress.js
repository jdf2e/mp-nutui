Compontents({
  properties: {
    percentage: {
      type: [Number, String],
      default: 0,
      required: true
    },
    size: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'text'
    },
    strokeWidth: {
      type: [Number, String],
      default: ''
    },
    textInside: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: true
    },
    strokeColor: {
      type: String,
      default: ''
    }
  },
  data: {
    currentStatus: this.status
  },
  methods: {}
});