Compontents({
  properties: {
    shape: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data: {
    cls: ''
  },

  ready() {
    this.initStyle();
  },

  methods: {
    initStyle() {
      this.data.cls = `nut-buttongroup ${this.shape} ${this.type}`;
    }

  }
});