Compontents({
  properties: {
    listData: {
      type: Array,
      required: true
    },
    defaultValue: {
      type: String | Number
    },
    keyIndex: {
      type: Number,
      default: 0
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: {
    touchParams: {
      startY: 0,
      endY: 0,
      startTime: 0,
      endTime: 0
    },
    transformY: 0,
    scrollDistance: 0,
    lineSpacing: 36,
    timer: null
  },
  methods: {
    updateTransform(value) {
      if (value) {
        this.data.transformY = 0;
        this.data.timer = setTimeout(() => {
          this.modifyStatus(null, value);
        }, 10);
      }
    },

    setTransform(translateY = 0, type, time = 1000) {
      if (type === 'end') {
        this.$refs.list.style.webkitTransition = `transform ${time}ms cubic-bezier(0.19, 1, 0.22, 1)`; //this.$refs.list.style.transition = `transform ${time}ms cubic-bezier(0.19, 1, 0.22, 1)`;
      } else {
        this.$refs.list.style.webkitTransition = ''; //this.$refs.list.style.transition = '';
      }

      this.$refs.list.style.webkitTransform = `translateY(${translateY}px)`; //this.$refs.list.style.transform = `translateY(${translateY}px)`;

      this.data.scrollDistance = translateY;
    },

    setMove(move, type, time) {
      let updateMove = move * this.data.transformY;

      if (type === 'end') {
        // 限定滚动距离
        if (updateMove > 0) {
          updateMove = 0;
        }

        if (updateMove < -(this.listData.length - 1) * this.data.lineSpacing) {
          updateMove = -(this.listData.length - 1) * this.data.lineSpacing;
        } // 设置滚动距离为lineSpacing的倍数值


        let endMove = Math.round(updateMove / this.data.lineSpacing) * this.data.lineSpacing;
        this.setTransform(endMove, type, time);
        this.setChooseValue(endMove);
      } else {
        this.setTransform(updateMove);
      }
    },

    setChooseValue(move) {
      this.$emit('chooseItem', this.listData[Math.round(-move / this.data.lineSpacing)], this.keyIndex);
    },

    touchStart(event) {
      event.preventDefault();
      let changedTouches = event.changedTouches[0];
      this.data.touchParams.startY = changedTouches.pageY;
      this.data.touchParams.startTime = event.timestamp || Date.now();
      this.data.transformY = this.data.scrollDistance;
    },

    touchMove(event) {
      event.preventDefault();
      let changedTouches = event.changedTouches[0];
      this.data.touchParams.lastY = changedTouches.pageY;
      this.data.touchParams.lastTime = event.timestamp || Date.now();
      let move = this.data.touchParams.lastY - this.data.touchParams.startY;
      this.setMove(move);
    },

    touchEnd(event) {
      event.preventDefault();
      let changedTouches = event.changedTouches[0];
      this.data.touchParams.lastY = changedTouches.pageY;
      this.data.touchParams.lastTime = event.timestamp || Date.now();
      let move = this.data.touchParams.lastY - this.data.touchParams.startY;
      let moveTime = this.data.touchParams.lastTime - this.data.touchParams.startTime;

      if (moveTime <= 300) {
        move = move * 2;
        moveTime = moveTime * 1000;
        this.setMove(move, 'end', moveTime);
      } else {
        this.setMove(move, 'end');
      }
    },

    modifyStatus(type, defaultValue) {
      defaultValue = defaultValue ? defaultValue : this.defaultValue;
      let index = this.listData.indexOf(defaultValue);
      let move = index === -1 ? 0 : index * this.data.lineSpacing;
      type && this.setChooseValue(-move);
      this.setMove(-move);
    }

  },

  ready() {
    this.$nextTick(() => {
      this.modifyStatus(true); // 监听

      this.$el.addEventListener('touchstart', this.touchStart);
      this.$el.addEventListener('touchmove', this.touchMove);
      this.$el.addEventListener('touchend', this.touchEnd);
    });
  },

  beforeDestroy() {
    // 移除监听
    this.$el.removeEventListener('touchstart', this.touchStart);
    this.$el.removeEventListener('touchmove', this.touchMove);
    this.$el.removeEventListener('touchend', this.touchEnd);
    clearTimeout(this.timer);
  }

});