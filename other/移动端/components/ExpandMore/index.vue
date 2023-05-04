<template>
  <div ref="expandMore" class="custom-expand">
    <main :style="styles(show)">
      <slot></slot>
    </main>
    
    <footer v-if="hidden">
      <section class="custom-expand-more" v-show="show"  :style="{'height':height + 'px'}">
        <p class="custom-expand-more-event" @click="show = false">
          <slot name="down">
            展示更多
          </slot>
        </p>
      </section>
      

      <section class="custom-expand-up" v-show="!show">
        <span @click="show = true">
          <slot name="up">收起</slot>
        </span>
        
      </section>
    </footer>
  </div>

</template>

<script>
export default {
  props:{
    // 超过这个值代表需要展示更多了
    height:{
      type:Number,
      default:60
    }
  },
  data () {
    return {
      // 是否开启隐藏
      hidden:false,

      // 展开收缩开关
      show:false,
    };
  },

  created(){
    this.$nextTick(()=>{
      this.getContent()
    })
  },

  computed:{
    styles(){
      return (boolean)=>{
        if(boolean){
          return {
            height:this.height + 'px',

            overflow:'hidden',
          }
        }
      }
    }
  },


  methods: {
    // 获取当前内容高度
    getContent(){
      const aim = this.$refs.expandMore.getBoundingClientRect();
      if(this.height < aim.height){
        this.hidden = true;
        this.show = true;
      }
    },

    showExpandMore(){
      this.show = false;
    }
  }
}
</script>
<style lang='less' scoped>
  .custom-expand{
    position: relative;
    main{
      padding-top: 5px;
    }
    .custom-expand-more{
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      color: #666;
      background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, #FFFFFF 70%);
      .custom-expand-more-event{
        position: absolute;
        bottom: 0;
      }
    }
    .custom-expand-up{
      position: relative;
      text-align: center;
      color: #666;
      margin-top: 5px;
      padding: 5px 0;
      &::before{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #EAEAEA;
        transform: scaleY(.5);
      }
    }
  }
</style>