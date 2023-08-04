<template>
  <div class="j-flex-col" style="height:100%;">
    <div class="screen-custom-box">
      <div class="custom-table">
        <div class="header">
          <p v-for='(item,index) in nurse.title' :key='index'>{{item}}</p>
        </div>

        <Swiper style="height:calc(100% - 45px)" v-if="nurse.data.length > 0" :option="option">
          <swiper-slide v-for='(item,index) in nurse.data' :key='index'>
            <div class="content">
              <img src="@/assets/images/screenPortrait/icon.png" class="icon" alt="">
              <p>{{item.recordName || '糯叽叽的万'}}</p>
              <p>{{item.recordNoticer || '糯叽叽的万'}}</p>
              <p>{{item.recordNoticer || '糯叽叽的万'}}</p>
            </div>
          </swiper-slide>
        </Swiper>

        <div v-else class="j-v-c" style="height:calc(100% - 45px);text-align:center;">暂无数据</div>
      </div>
    </div>
  </div>

</template>

<script>
// import $http from '@/api/xxx.js'
import {swiperSlide } from "vue-awesome-swiper";
export default {
  components:{
    swiperSlide
  },

  data () {
    
    return {
      // 服务记录
      nurse:{
        title:["照护项目","护理员","时间"],

        data:[]
      },

     

       // swiper滚动配置
      option:{
        loop: true,
        // 自动播放
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },

        direction : 'vertical',
        slidesPerView:4,
      },

      oldId:''
    };
  },

  created(){
    this.getCare()
  },

  methods:{
    getCare(){
      $http.xxx().then(({data}) => {
        if(data.length <= this.option.slidesPerView){
          this.option.loop = false;
        }
        this.nurse.data = data;
      })
    },
  },
}
</script>
<style lang='scss' scoped>
.screen-custom-box{
  position: relative;
  flex: 1;
  .custom-table{
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    .header,.content{
      display: flex;
      align-items: center;
      box-sizing: border-box;
      line-height: 46px;
    }
  }
}
.custom-table{
  .header{
    color: #91ABFF;
  }
  .header,.content{
    p{
      flex: 1;
      text-align: center;
    }
  }
  .content{
    height: 90%;
    background-image:linear-gradient(to right,rgba(112, 153, 255, 0) 10%,rgba(86, 145, 255, .5) 50%,rgba(112, 153, 255, 0) 90%);
    .icon{
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .swiper-slide{
    .content{
      
    }
  }
}

</style>