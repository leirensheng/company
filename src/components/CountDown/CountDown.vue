<template>
  <span v-html="time"></span>
</template>

<script>
  export default{
    data () {
      return {
        time : '',
        flag : false
      }
    },
    mounted () {
      let time = setInterval(()=>{
        if(this.flag == true){
          clearInterval(time);
        }
        this.timeDown();
      },500)
    },
    props : {
      endTime : {
        type : Number
      }
    },
    methods : {
      timeDown () {
        const endTime = new Date(this.endTime);
        const nowTime = new Date();
        let leftTime = parseInt((endTime.getTime()-nowTime.getTime())/1000);
        let d = parseInt(leftTime/(24*60*60));
        let h = this.format(parseInt(leftTime/(60*60)%24));
        let m = this.format(parseInt(leftTime/60%60));
        let s = this.format(parseInt(leftTime%60));
        if(leftTime <= 0){
          this.flag = true;
          this.$emit('time-end')
        }
        this.time = `<span style="color:red;">${d}</span>天
                      <span style="color:red;">${h}</span>时
                      <span style="color:red;">${m}</span>分
                      <span style="color:red;">${s}</span>秒`;
      },
      format (time) {
        if(time>=10){
          return time
        }else{
          return `0${time}`
        }
      }
    }
  }
</script>
