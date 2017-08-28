<template>
  <div class="main" @click="goforDetail()" v-bind:class="{'grey': black}">
      <div class="left" :style="{'background-color':couponColor}" v-bind:class="{'grey': black}">
        <div style="height: 20%;">
          <span class="price" v-show="price ===  true">一口价</span>
        </div>
        <div style="height: 80%;">
          <span class="biggerSpan">{{biggerSpan}}</span><br/>
          <span class="smallerSpan">{{smallerSpan}}</span>
        </div>
      </div>
    <div class="right">
      <span class="rightTitle" v-bind:class="{'grey-font': black}">{{title}}</span><br/>
      <span class="couponNum" v-bind:class="{'grey-font': black}">券码：{{couponCode}}</span>
    </div>
    <div class="underLeft" :style="{'background-color':couponColor}"  v-if="black !== true"></div>
  </div>
</template>

<script>

    export default {
      props: ['couponColor', 'title', 'couponCode', 'startDate', 'endDate', 'biggerSpan', 'smallerSpan', 'get', 'campId', 'desc', 'black', 'clickable', 'select', 'price'],
      data() {
        return {
          test: true
        };
      },
      methods: {
        goforDetail() {
          if (this.clickable === true) {
            this.$router.push({
              path: '/coupon/detail',
              query: {
                couponId: this.couponCode,
                desc: this.desc
              }
            });
          } else {
            console.log('unclickable');
          }
        }
    }
    };
</script>

<style scoped lang="scss">
  .main{
    height:6em;
    width:90%;
    border:1px solid #e8e8e8;
    margin: 5px 5%;
    .left{
      width:28%;
      height:100%;
      float: left;
      /*background-color: #ff718d;*/
      .biggerSpan{
        font-size: xx-large;
        display: block;
        margin: .4em .2em 0 .2em;
        text-align: center;
        color: #fffee3;
      }
      .smallerSpan{
        font-size: small;
        display: block;
        margin: 0 .5em .5em .5em;
        text-align: center;
        color: #fffee3;
      },
      .price{
        color: #fffee3;
      line-height: 1.2em;
      display: inline-block;
      text-indent: 0.2em;
    }
    }
    .underLeft{
      width:30%;
      height:100%;
      /*position: relative;*/
      z-index: -1;
      background: rgba(0, 0, 0, 0) radial-gradient(rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 5px, #ffffff 5px) repeat scroll 9px 3px / 15px 15px;
    }
    .right{
      height:100%;
      float: right;
      width:71%;
      z-index: 100;
      background-color: white;
      .rightTitle{
        display: block;
        margin: .4em .4em 0 .2em;
        font-size: 1.2em;
      }
      .couponNum{
        display: block;
        margin-left:.2em;
        font-size: .9em;
      }
      .rightBottom{
        display: block;
        height:50%;
        padding:.4em;
        color: #cdcdcd;
        font-size: smaller;
        position: relative;
        .startDate{
          margin-top: 1.2rem;
          float: left;
        }
        .endDate{
          margin-top: 1.2rem;
          float: left;
        }
      }
    }
    .get{
      background-color: #d3a858;
      color: #fff;
      position: absolute;
      bottom: 1.1rem;
      right:0.2rem;
    }
    .got{
      background-color: #999999;
      color: #fff;
      position: absolute;
      bottom: 1.1rem;
      right:0.2rem;
    }
    .grey{
    background-color: #888888;
    filter:alpha(opacity=70);
    opacity:0.5;
  }
    .grey-font{
      color: #5b5b5b;
      filter:alpha(opacity=70);
      opacity:0.5;
    }
  }
</style>
