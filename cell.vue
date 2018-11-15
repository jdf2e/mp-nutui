<template>
    <a :class="['nut-cell',{'nut-cell-link':isLink}]" :href="linkUrl||'javascript:;'" :style="{'background-color':bgColor}">
        <div class="nut-cell-box">
            <div class="nut-cell-left">
                <span class="nut-cell-title"><slot name="title">{{title}}</slot></span>
                <span class="nut-cell-sub-title"><slot name="sub-title">{{subTitle}}</slot></span>
            </div>
            <div class="nut-cell-right">
                <span class="nut-cell-desc"><slot name="desc">{{desc}}</slot></span>
                <span class="nut-cell-icon"><slot name="icon" v-if="showIcon"><img src=""></slot></span>
            </div>
        </div>
    </a>
</template>
<script type="javascript">
export default {
  name: "nut-cell",
  props: {
    title: {
      type: String,
      default: ""
    },
    subTitle: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    isLink: {
      type: Boolean,
      default: false
    },
    linkUrl: {
      type: String,
      default: null
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: "#FFFFFF"
    }
  },
  data() {
    return {};
  },
  methods: {},
  mounted: function() {
  }
};
</script>
<style 
>

</style>
<style lang="less">

</style>
