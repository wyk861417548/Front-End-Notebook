<template>
  <!-- 注意  必须等slides存在才去初始化 不然不显示-->
  <Swiper v-if="swiperOptions.virtual.slides.length > 0" ref="swiper" :options="swiperOptions"></Swiper>
</template>

<script>
export default {
  props:{
    vdata:{
      type:Array,
      default:()=>[]
    }
  },
  data () {
    return {
      SWIPER:null,
      // 记录滑到哪里
      currentIndex:0,

      // 轮播配置
      swiperOptions: {
        virtual:{
          slides:[]
        },

        on:{
          slideChange:()=>{
            this.$emit('change',this.SWIPER.activeIndex)
          },
          click: ({target})=>{
            let data = target.dataset;
           
            switch(target.id){
              case 'goTo':
                this.$parent.jumpGdMap(JSON.parse(data.url))
                break;
              case 'mobile':
                this.$config.call(data.mobile)
                break;
            }
          },
        },
        
      },
    };
  },

  created(){
    this.initVirtual();
    this.$nextTick(()=>{
      this.SWIPER = this.$refs.swiper.$el.swiper;
    })
  },

  methods:{
    // 初始化 swiper虚拟dom节点
    initVirtual(){
      this.swiperOptions.virtual.slides = this.vdata.map((item) => {//data为获取到的数据，
        return `
          <section class="custom-box">
            <h2 class="j-flex">
              <span class="font18 text-overflowMut" style="width:70%">${item.name}</span>
              <span id='goTo' class="ban-child ml-15 j-flex-a" data-url='${JSON.stringify(item)}'>
                <span class="text-999">到这去</span>
                <img class="j-img-fit" src='https://img.cdn.vihost.cn/vue_cli/anxinyu/h5/map/nav.png' width="24" alt="">
              </span>
            </h2>

            <p class="mt-5 j-flex">
              <span class="text-overflowMut flex-fit text-999">${item.address || '暂无'}</span>
              <span class="ml-10" v-if="item.distance">距你${item.distance || 0}</span>
            </p>

            <section class="b-t pt-15">
              <p class="j-flex">
                <span class="status" class="${item.status == 2?'active':''}">${item.status==1?'开园中':'关闭'}</span>
                <img id='mobile' class="j-img-fit" data-mobile='${item.mobile}' src='https://img.cdn.vihost.cn/vue_cli/anxinyu/h5/icon/phone.png' width="30" alt="">
              </p>
            </section>
          </section>
        `;
      });
    },

    // 立刻前往第几项
    slideTo(index){
      this.$refs.swiper.$el.swiper.slideTo(index,0)
    }
  },
}
</script>
<style lang='less' scoped>

::v-deep .swiper-wrapper{
  .swiper-slide{
    width: 90% !important;
    margin:  0 5%;
  }
  section.custom-box{
    #mobile:active,#goTo:active{
      opacity: .5;
    }
    h2,h3{
      color: #000;
    }
    p{
      padding: 5px 0;
    }
    color: #999;
    padding: 15px;
    .status{
      display: inline-block;
      padding: 4px 16px;
      font-size: 16px;
      color: #65b93d;
      border-radius: 4px;
      background-color: #e2f1dc;
      &.active{
        background-color: rgba(200,200,200,.5);
        color: #666;
      }
    }
  }
}

</style>