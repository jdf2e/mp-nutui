Compontents({
  components: {
    'nut-button': nutButton
  },
  data: {
    val: 0
  },
  methods: {
    setAddVal() {
      if (this.data.val >= 100) {
        return false;
      }

      this.data.val += 10;
    },

    setReduceVal() {
      if (this.data.val <= 0) {
        return false;
      }

      this.data.val -= 10;
    }

  }
});