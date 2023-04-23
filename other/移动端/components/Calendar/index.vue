<template>
  <div class='custom-calendar'>
    <header>
      <p class="j-flex-a year">
        <van-icon name="arrow-left" color="#999" @click="prev" />
        <span class="font16 mr-10 ml-10">{{curY}}.{{curM>=10?curM:'0'+curM}}</span>
        <van-icon name="arrow" color="#999" @click="next" />
      </p>
    </header>

    <Swiper ref="swiper" :options="swiperOptions">
      <swiper-slide v-for="month in timeList" :key="curY + month">
        <date :month="month" :year="curY" :day="curD" @change="change">
          <template v-slot:default="scope">
            <slot :value="scope.value"></slot>
          </template>
        </date>
      </swiper-slide>
    </Swiper>
  </div>

</template>

<script>
import { swiperSlide } from "vue-awesome-swiper";
import date from './date.vue'
export default {
  components:{
    date,
    swiperSlide
  },
  data () {
    return {
      timeList:[],

      // 用于解决
      init:false,

      // 轮播配置
      swiperOptions: {
        pagination: false,

        //自定义 手指滑动停止后  是否能够自动轮播
        mouseAutoplay:false,

        // 注意
        observer: true, //开启动态检查器

        on:{
          slidePrevTransitionEnd:()=>{
            console.log('右滑');
            this.prev();
          },
          slideNextTransitionEnd:()=>{
            console.log('左滑');
            this.next();
          },
        },
      },
      curY:new Date().getFullYear(),
      
      curM:new Date().getMonth()+1,

      curD:new Date().getDate()
    };
  },

  computed:{
    curMonthDay(){
      let date = new Date(this.curY,this.curM,0);
      return date.getDate()
    },
  },
  
  mounted(){
    // 注意数据初始化放这 不然初始化this.$refs.swiper.$el.swiper.activeIndex = 1不生效
    this.timeList = [this.curM-1,this.curM,this.curM+1]
    
    this.$nextTick(()=>{
      this.$refs.swiper.$el.swiper.activeIndex = 1;
      this.changeDate();
    })
  },

  methods: {
    // 点击上个月日期 当前月日期 下个月日期 type:0当前月 1上个月 2下个月
    change({value,type}){
      this.curD = value;
      if(type == 1){
        this.prev()
      }else if(type ==2){
        this.next()
      }
    },

    prev(){
      this.curM--;
      if(this.curM === 0){
        this.curM = 12;
        this.curY--;
      }

      this.handle();
    },

    next(){
      this.curM++;
      if(this.curM === 13){
        this.curM = 1;
        this.curY++;
      }
      this.handle();
    },

    // 为了解决选择了最后一天 切换时 其他月份日期自动选择最后一天
    handle(){
      if(this.curMonthDay < this.curD){
        this.curD = this.curMonthDay;
      }
    },

    changeDate(){
      const yyyy = this.curY;
      const MM = this.curM>=10?this.curM:'0'+this.curM
      const dd = this.curD>=10?this.curD:'0'+this.curD

      this.$emit('change',{year:yyyy,month:MM,day:dd,date:[yyyy,MM,dd].join('-')})
    }
  },

  watch:{
    // 每次监听  动态设置显示数据  以及下表
    curM:{
      handler(newVal){
        this.timeList = [newVal-1,newVal,newVal+1]
        this.$nextTick(()=>{
          this.$refs.swiper.$el.swiper.activeIndex = 1;
        })
        
        this.changeDate();
      },
      deep:true,
    }
  }
}
</script>
<style lang='less' scoped>
.custom-calendar{
  padding: 15px 0;
  box-sizing: border-box;
  header{
    .year{
      justify-content: center;
      margin-bottom: 15px;
    }
  }

  main{
    section.week,section.date{
      display: flex;
      flex-wrap: wrap;
      text-align: center;
      span{
        position: relative;
        z-index: 999;
        box-sizing: border-box;
        padding: 15px 0;
        width: calc(100%/7);
      }
    }

    section.week{
      color: #999;
    }

    section.date{
      color: #000;
      font-weight: 500;
      span.active{
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
      span.gray{
        color: #999;
      }
    }
  }
}

</style>