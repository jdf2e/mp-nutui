Compontents({
  properties: {
    isAnimation: {
      type: Boolean,
      default: true
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    isClickCloseMask: {
      type: Boolean,
      default: true
    },
    cancelTxt: {
      type: String,
      default: ''
    },
    optionTag: {
      type: String,
      default: 'name'
    },
    chooseTagValue: {
      type: String,
      default: ''
    },
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  data: {},
  methods: {
    isHighlight(item) {
      return this.chooseTagValue && this.chooseTagValue == item[this.optionTag] || this.chooseTagValue === 0;
    },

    closeActionSheet() {
      this.$emit('close');
    },

    clickActionSheetMask() {
      !!this.isClickCloseMask && this.closeActionSheet();
    },

    chooseItem(item) {
      this.closeActionSheet();
      this.$emit('choose', item);
    }

  }
});