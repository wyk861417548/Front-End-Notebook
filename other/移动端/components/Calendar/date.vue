<template>
  <main>
    <section class="week">
      <p v-for='(item,index) in title' :key='index'>{{item}}</p>
    </section>

    <section class="date">
      <p class="gray" v-for='item in preOccupy' :key="'prev'+item" @click="change(monthDay-preOccupy+item,1)">{{monthDay-preOccupy+item}}</p>
      <p class="date-item" v-for='item in curMonthDay' :key="'cur'+item" @click="change(item)">
        <span class="" :class="{active:curD == item}">{{item}}</span>
        <span class="slot">
          <slot :value="curDate(item)"></slot>
        </span>
      </p>
      <p class="gray" v-for='item in nextOccupy' :key="'next'+item" @click="change(item,2)">{{item}}</p>
    </section>
  </main>

</template>

<script>
export default {
  props:['month','year','day'],
  data () {
    return {
      // 周
      title:["日", "一", "二", "三", "四", "五", "六"],

      curY:new Date().getFullYear(),

      curM:new Date().getMonth()+1,

      curD: '',
    };
  },

  computed:{
    // 月份 中文显示
    // curMChinese(){
    //   return new Date(this.curY,this.curM-1,this.curD).toLocaleString('defalut',{month:'short',day:'2-digit',weekday:'short'});
    // },

    // new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
    // 计算当前月有多少天  月份加一  变成下个月   day设置0变成当前月的最后一天
    curMonthDay(){
      let date = new Date(this.curY,this.curM,0);
      return date.getDate()
    },

    curDate(){
      return (day)=>{
        return this.curY +'-'+ (this.curM>=10?this.curM:'0'+this.curM)  + '-'+ (day>=10?day:'0'+day)
      }
    },

    // 上个月的天数
    monthDay(){
      return new Date(this.curY,this.curM-1,0).getDate()
    },

    //上个月占位 计算当前月一号是星期几   从而空出几个格子
    preOccupy(){
      return new Date(this.curY,this.curM-1,1).getDay();
    },

    // 下个月占位
    nextOccupy(){
      let num =42 - this.curMonthDay - this.preOccupy;
      return num;
      // return num>7?num-7:num;
    },
  },

  created(){
    this.curM = this.month;
    this.curY = this.year;
  },

  methods: {
    // 选择日期
    change(value,type=0){
      this.curD = value;
      this.$emit('change',{value,type})
    },
  },

  watch:{
    day:{
      handler(newVal){
        this.curD = newVal
      },
      immediate:true
    }
  }
}
</script>
<style lang='less' scoped>
main{
  section.week,section.date{
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    p{
      position: relative;
      z-index: 999;
      padding: 15px 0;
      line-height: 1;
      box-sizing: border-box;
      width: calc(100%/7);
    }
  }

  section.week{
    color: #999;
    p{
      padding-bottom: 20px;
    }
  }

  section.date{
    color: #000;
    font-weight: 500;
    .date-item{
      &>span:first-child{
        position: relative;
      }
      .slot{
        position: absolute;
        top: 30px;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
    
    .active{
      color: #fff;
      &::after{
        content: '';
        position: absolute;
        z-index: -1;
        left: 50%;
        top: 50%;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: #0EC552;
      }
    }
    .gray{
      color: #999;
    }
  }
}
</style>