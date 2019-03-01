
const { watch, computed } = require('../vuefy.js')
Compontents({
    properties: {
        test: { a: 123 },//test
        id:null,
        msg: "",
        visible: false,
        duration: 2000, //显示时间(毫秒)
        timer: null,
        center: true,
        type: "",
        customClass: "",
        bottom: 30,
        size:"base",
        icon:null,
        textAlignCenter: true,
        loadingRotate:true,
        bgColor: "rgba(46, 46, 46, 0.7)",
        onClose:null,
        textTimer: null,
        timeStamp:null
    },
    data:{

    },
    attached: function(){alert()
        computed(this, {
            test2: function() {
              return this.data.test.a + '2222222'
            },
            test3: function() {
              return this.data.test.a + '3333333'
            },
            cusIcon() {
                return this.icon ? `url("${this.icon}")` : "";
            }
            
          })
          watch(this, {
            test: function(newVal) {
              console.log('invoke watch-------------')
              this.setData({ test1: newVal.a + '******' })
            },
            visible(val) {
                if (val) {
                  this.show();
                }
            }
          })

    },
/*     watch: {
      visible(val) {
        if (val) {
          this.show();
        }
      }
    },
    computed: {
      cusIcon() {
        return this.icon ? `url("${this.icon}")` : "";
      }
    }, */
    methods: {
      show(force) {
        this.clearTimer();
        clearTimeout(this.textTimer);
        if (this.duration) {
          this.timer = setTimeout(() => {
            this.hide(force);
          }, this.duration);
        }
      },
      hide(force) {
        this.clearTimer();
        this.visible = false;
        if (force) {
          clearTimeout(this.textTimer);
        } else {
          this.textTimer = setTimeout(() => {
            clearTimeout(this.textTimer);
            this.msg = "";
          }, 300);
        }
        typeof(this.onClose) === "function" && this.onClose();
      },
      clearTimer() {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      }
    }
  });