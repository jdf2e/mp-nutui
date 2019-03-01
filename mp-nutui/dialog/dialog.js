Compontents({
  mixins: [locale],
  data: {
    id: null,
    title: "",
    content: "",
    type: "",
    link: "",
    imgSrc: "",
    animation: true,
    lockBgScroll: false,
    visible: false,
    closeBtn: false,
    closeOnClickModal: true,
    noFooter: false,
    noOkBtn: false,
    noCancelBtn: false,
    cancelBtnTxt: "",
    okBtnTxt: "",
    okBtnDisabled: false,
    cancelAutoClose: true,
    textAlign: "center",
    onOkBtn: null,
    onCloseBtn: null,
    onCancelBtn: null,
    closeCallback: null,
    onClickImageLink: null,
    maskBgStyle: "",
    customClass: ""
  },
  methods: {
    modalClick() {
      if (!this.closeOnClickModal) return;
      this.close("modal");
    },

    close(target) {
      if (typeof this.closeCallback === "function") {
        if (this.closeCallback(target) === false) return;
      }

      this.visible = false;
    },

    okBtnClick() {
      if (typeof this.onOkBtn === "function") {
        this.onOkBtn.call(this);
      }
    },

    cancelBtnClick(autoClose) {
      if (typeof this.onCancelBtn === "function") {
        if (this.onCancelBtn.call(this) === false) return;
      }

      autoClose && this.close();
    },

    closeBtnClick() {
      if (typeof this.onCloseBtn === "function") {
        if (this.onCloseBtn.call(this) === false) return;
      }

      this.close("closeBtn");
    },

    //图片类型弹窗中的链接点击事件，默认跳转
    imageLinkClick(a, b) {
      this.a = 1;
      this.b = 2;
      if (this.onClickImageLink && this.onClickImageLink.call(this) === false) return;
      if (this.link) location.href = this.link;
    }

  }
});