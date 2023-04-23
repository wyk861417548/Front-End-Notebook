<template>
  <Swiper ref="swiper" :options="swiperOptions">
    <swiper-slide v-for="(month,index) in dataList" :key="index">
      <slot :scope='weekList'></slot>
    </swiper-slide>
  </Swiper>

</template>

<script>
import { swiperSlide } from "vue-awesome-swiper";
export default {
  props:{
    // 渲染组件 1 + 2*number 个
    number:{
      type:Number,
      default:1
    }
  },
  components:{
    swiperSlide
  },
  data () {
    return {
      SWIPER:null,

      dataList:[], //数据集合
      weekList:[],
      oneDayTime:24 * 3600 * 1000,// 每天

      MondayTime:'',// 当前周一时间 或者是 记住swiper滑动后的当前周一时间

      // 轮播配置
      swiperOptions: {
        pagination: false, //是否展示分页点
        speed:300,
        // mouseAutoplay:false,//自定义 手指滑动停止后  是否能够自动轮播 
        observer: true, //开启动态检查器 重要
        on:{
          slidePrevTransitionEnd:()=>{//右滑
            this.handle(false);
          },
          slideNextTransitionEnd:()=>{//左滑
            this.handle(true);
          },
        },
      },

    };
  },

  mounted(){
    this.SWIPER = this.$refs.swiper.$el.swiper;

    // 注意dataList数据初始化放这 不然初始化this.$refs.swiper.$el.swiper.activeIndex = 1不生效
    this.handleData();
  },

  methods: {
    handleData(){
      this.initDate()

      const WTIME  = this.oneDayTime*7;
      let data = [];
      for (let i = -this.number; i <= this.number; i++) {
        data.push(this.MondayTime + i*WTIME)
      }
      this.dataList = data;

      this.SWIPER.activeIndex = this.number;
    },

    // Monday 周一  没有通过计算几天是周几 然后计算出周一时间  time:获取周一到周w的时间
    initDate(time=5){
      const Monday = this.MondayTime;

      this.weekList = [];
      const week =Monday?new Date(Monday).getDay():new Date().getDay();  //今天是星期几
      const nowTime = Monday || new Date().getTime();

      // 本周一
      const MondayTime = Monday ? Monday : (nowTime - (week - 1) * this.oneDayTime);

      for (let i = 0; i < time; i++) {
        let date = new Date(MondayTime + i*this.oneDayTime).format('yyyy-MM-dd 周w').split(' ')
        this.weekList.push({date:date[0],week:date[1],day:date[0].slice(-2)*1})
      }

      if(!Monday){
        this.MondayTime = MondayTime;
      }

      let time_ = Monday?this.weekList[week-1].date:new Date().format('yyyy-MM-dd');
      this.$emit('change',time_)
    },

    // 左右滑动
    handle(boolean){
      const WTIME  = this.oneDayTime*7;

      this.MondayTime =this.MondayTime + (boolean?WTIME:-WTIME)

      this.handleData()
    },
  }
}
</script>
<style lang='less' scoped>
</style>