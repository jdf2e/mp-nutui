Compontents({
  mixins: [locale],
  methods: {
    showDialog1: function () {
      const options = {
        title: "确定删除此订单？",
        content: "删除后将从你的记录里消失，无法找回"
      };
      this.$dialog(options);
    },
    showDialog2: function () {
      const options = {
        title: "确定要加入购物车吗？"
      };
      this.$dialog(options);
    },
    showDialog3: function () {
      const options = {
        content: "点击返回将中断注册，确定返回？<br>删除后您可以在回收站还原。",
        noCloseBtn: false,
        noOkBtn: true,
        cancelBtnTxt: "我知道了"
      };
      this.$dialog(options);
    },
    showDialog4: function () {
      const options = {
        customClass: "my-dialog",
        title: "注册说明",
        content: "原账号为您本人所有，建议直接登录或找回密码。原账号内的订单资产可能丢失，可联系京东客服找回。",
        closeBtn: true,
        noFooter: true
      };
      this.$dialog(options);
    },
    showDialog5: function () {
      const options = {
        okBtnTxt: 'qwe',
        title: "自定义Dialog标题",
        content: "小屏或移动端浏览效果最佳",
        closeBtn: true,

        onOkBtn(event) {
          alert("okBtn");
          this.close(); //关闭对话框
        },

        onCancelBtn(event) {
          alert("cancelBtn"); //return false;  //阻止默认“关闭对话框”的行为
        },

        onCloseBtn(event) {
          alert("closeBtn"); //return false;  //阻止默认“关闭对话框”的行为
        },

        closeCallback(target) {
          alert("will close");
        }

      };
      this.$dialog(options);
    },
    showDialog6: function () {
      this.$dialog({
        animation: false,
        //禁用弹出动效
        title: "注册说明",
        content: "原账号为您本人所有，建议直接登录或找回密码。原账号内的订单资产可能丢失，可联系京东客服找回。"
      });
    },
    showDialog7: function () {
      this.$dialog({
        maskBgStyle: 'rgba(0,0,0,0)',
        //设置遮罩层背景透明
        title: "注册说明",
        content: "原账号为您本人所有，建议直接登录或找回密码。原账号内的订单资产可能丢失，可联系京东客服找回。"
      });
    },
    showImageDialog: function () {
      this.$dialog({
        type: "image",
        link: "http://m.jd.com",
        imgSrc: "https://m.360buyimg.com/mobilecms/s750x750_jfs/t1/4875/23/1968/285655/5b9549eeE4997a18c/070eaf5bddf26be8.jpg!q80.dpg",
        onClickImageLink: function () {
          console.log(this); //this指向该Dialog实例

          return false; //返回false可阻止默认的链接跳转行为
        }
      });
    },
    showIdDialog1: function () {
      const options = {
        id: "myDialog",
        title: "我的ID是myDialog",
        content: "只会新建一个实例",
        noOkBtn: true,
        closeBtn: true
      };
      this.$dialog(options);
    },
    showIdDialog2: function () {
      const options = {
        id: "myDialog",
        title: "我的ID也是myDialog",
        content: "与上一个弹窗共享一个实例。",
        noOkBtn: true,
        cancelBtnTxt: "我知道了"
      };
      this.$dialog(options);
    }
  }
});