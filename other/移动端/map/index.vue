<template>
  <div class="j-vh custom-map">
    <div id="map" ref="map"></div> 

    <header class="position" >
      <van-search shape="round" v-model="data.name"  placeholder="请输入搜索关键词" @clear="getData(true)" @search="getData(true)" />
      <!-- 输入框右侧 -->
      <section class="inputRight j-flex-a">
        <span class="custom-line"></span>

        <van-dropdown-menu active-color="#23A989" >
          <!-- @open="open" -->
          <van-dropdown-item title="机构列表" ref="dropdown" @open="open">
            <!-- 距离筛选 -->
            <!-- <van-dropdown-menu active-color="#23A989" class="b-b">
              <van-dropdown-item @change="changeMenu" v-model="data.orderby" :options="metre" />
            </van-dropdown-menu> -->
            <section class="downList radius8">
              <Scroll ref="scroll" class="scroll">
                <section class="custom-scroll-list j-flex" v-for="(item,index) in searchList" :key="index" >
                  <aside class="j-flex flex-fit" @click="getCurrentPoient(item)">
                    <p class="text-333">
                      <span class="font14 mr-10 font600">{{item.name}}</span>
                      <span class="font12 text-999" v-if="item.distance">{{item.distance || 0}}</span>
                    </p>
                  </aside>
                  <p style="color:#485067;" @click="jumpGdMap(item)">导航<van-icon name="location-o" class="ml-5" /></p>
                </section>
              </Scroll>
            </section>
            
          </van-dropdown-item>
        </van-dropdown-menu>

      </section>
    </header>

    <footer class="position">
      <section class="location" @click="getLocationGD(true)">
        <img :src="$RESOURE + 'icon/location.png'" alt="">
      </section>

      <Smap v-if="dataList.length > 0" ref="smap" :vdata="dataList" @change="slideChangeTransitionEnd"></Smap>
    </footer>

    <div v-show="mask" class="mask j-full-curbox j-v-c">
      <van-loading color="#fff" vertical>{{text}}</van-loading>
    </div>
  </div>
</template>

<script>
import Smap from './components/Smap.vue'
export default {
  components:{
    Smap
  },
  data () {
    return {
      // 遮罩
      mask:false,

      map:null,

      layer:null,

      text:'定位中...',

      // icon点
      markerList:[],

      // icon图标 person：本人   house.默认站点  house_active：被点击站点
      icon:{
        person:this.$RESOURE + 'map/person.png',
        house:this.$RESOURE + 'map/house.png',
        house_active:this.$RESOURE + 'map/house_active.png',
      },

      // 当前机构下标
      currentMarkerIndex:'',

      metre: [
        { text: '默认排序', value: 0 },
        { text: '距离最近', value: 1 },
        { text: '距离最远', value: 2 },
      ],

      // 搜索列表
      searchList:[],

      // 所有站点名称及活动相关信息
      dataList: [],

      data:{
        longitude:'',
        latitude:'',
        // 机构名称
        name:'',
        // 距离近远排序 1:近
        // orderby:1
      },
    };
  },

  created(){
    // 如果不是从详情页进入  重新加载
    this.$config.loadScript('https://webapi.amap.com/maps?v=1.4.10&key=489436b6f963d47d7ca1f814b0e01b33&plugin=AMap.Geocoder,AMap.Geolocation',this.initMap);
  },

  methods: {
    // 创建地图实例
    initMap(){
      this.map = new AMap.Map('map', {
        zoom: 14,
        resizeEnable: true,
        center:[119.695322,30.629728] 
      });

      // 使用layer在大量数据的时候 不会卡
      this.layer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        collision: false
      });
      // 将图层添加到地图
      this.map.add(this.layer);
      this.getLocationGD();
    },

    // 为了保证  滚动最下方显示已经到底了  this.$refs.dropdown.toggle(true)会触发 
    open(){
      this.$nextTick(()=>{
        this.$isScroll(this.$refs.scroll,this.searchList,0)
      })
    },

    // 点击当前搜索列表某项  获取点前点下标
    getCurrentPoient(item){
      this.dataList.map((v,i)=>{
        if(v.name == item.name){
          this.$refs.smap.slideTo(i)
        }
      })
    },

    // 设置当前点icon  virtual.from
    setCurrentMap(item,index){
      const {lng,lat} = item;
      // 上一个icon先恢复
      this.changeMarkerIcon(this.markerList[this.currentMarkerIndex],false)
      this.map.setZoom(14);
      this.map.setCenter([lng,lat]); //设置地图中心点
      this.currentMarkerIndex = index;
      this.changeMarkerIcon(this.markerList[index],true)
      this.$refs.dropdown.toggle(false)
    },
  
    // 跳转高德
    jumpGdMap({lng,lat,name}){
      this.$config.jumpGdMap({lng,lat,name})
    },

    // 定位自己的位置
    getLocationGD(boolean){
      if(boolean){this.text = '重新定位中...'}
      this.mask = true;
      this.$config.getLocationGD().then(({position}) => {
        const {lng,lat} = position;
        this.mask = false;
        this.data = {...this.data,lng,lat}
        this.reload(lng,lat);
      }).catch(() => {
        // 定位出错
        this.$config.tip('精准定位失败',"#3A4675",3000)
        this.mask = false;
        this.reload();
      });
    },

    reload(longitude,latitude){
      this.changeMenu();
      // 如果自身位置定位成功
      if(longitude && latitude){
        this.setPersonMarker({longitude,latitude}) //设置本人
        this.map.setCenter([longitude,latitude]); //设置地图中心点
      }
    },

    // 筛选条件改变
    changeMenu(){
      this.dataList = [];
      this.data.current = 1;
      this.currentMarkerIndex = '';
      this.getData();
    },

    // 获取地图所有点  boolean代表走的刷新操作
    getData(boolean = false){
      this.$api.common.org(this.data).then(({rows}) => {
        this.map.setZoom(14);
        if(boolean){
          this.searchList = rows;
          this.$refs.dropdown.toggle(true)
          return;
        }
        this.searchList = this.dataList = rows;
        this.addMarker();
      })
    },

    // swiper滚动结束
    slideChangeTransitionEnd(index){
      this.setCurrentMap(this.dataList[index],index)
    },

    addMarker(){
      this.layer.remove(this.markerList);
      this.markerList = [];
      let image; // 点 图片
      this.dataList.map((item,index)=>{
        // 当坐标无  防止报错导致其他icon不显示
        if(!item.lng || !item.lat)return;

        // 设置当前点图片
        image = this.currentMarkerIndex && this.currentMarkerIndex == index?this.icon.house_active:this.icon.house;

        let marker = new AMap.LabelMarker({
          position:new AMap.LngLat(item.lng, item.lat),
          icon: {
            type: 'image',
            image,
            size: [34,34],
            anchor: 'bottom-center',
          }
        });

        // 点击  联动swiper
        marker.on("click",()=>{
          if(item){
            // 如果cMarker(‘点’)的下标存在 先把cMarker位置的点恢复默认图片 然后 在设置当前点击‘点’的图片
            if(this.currentMarkerIndex == '0' || this.currentMarkerIndex){
              this.changeMarkerIcon(this.markerList[this.currentMarkerIndex],false)
            }
            this.currentMarkerIndex = index;
            this.$refs.smap.slideTo(index) //swiper 跟随变化
            this.changeMarkerIcon(marker,true)
          }
        })
        this.markerList.push(marker)
      })
      this.layer.add(this.markerList);
    },

    // 修改地图上当前选中机构icon 和 移除上一个选中icon boolean:false 默认图片  true
    changeMarkerIcon(marker,boolean){
      if(!marker) return;
      const image = boolean?this.icon.house_active:this.icon.house;
      marker.setIcon({
        type: 'image',
        image,
        size: [34,34],
        anchor: 'bottom-center',
      })
      
    },

    // 设置本人定位icon
    setPersonMarker(item){
      let marker = new AMap.Marker({
        position:new AMap.LngLat(item.longitude, item.latitude),
        icon: this.icon.person
      });
      this.map.add(marker);
    },
  },
}
</script>

<style lang='less' scoped>
.scroll{
  position: relative;
  &::-webkit-scrollbar {width:4px;height:10px;}
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background: #66b1ff;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: #ededed;
  }
}


// 下拉菜单设置
::v-deep.van-dropdown-menu{
  .van-dropdown-menu__bar{
    height: auto;
    padding: 10px 0;
    box-shadow: none;
    background-color: none;
    .van-dropdown-menu__item{
      justify-content: start !important;
      .van-dropdown-menu__title {
        font-size: 14px;
      }
    }
  }
  .van-dropdown-item {
    top: 70px !important;
    right: 2.5vw;
    left: 2.5vw;
    height:400px;
    border-radius: 10px;
    .van-overlay{
      background-color: rgba(0,0,0,0);
    }

    .van-popup{
      border-radius: 10px;
      overflow: hidden;
    }
  }
}

::v-deep.custom-map{
  z-index: 99;
  position: relative;
  #map{
    width: 100%;
    height: 100%;
    .amap-icon img{
      width: 34px;
      height: 34px;
    }
  }
  .position{
    position: absolute;
    width: 95vw;
    left: 0;
    right: 0;
    margin: auto;
  }
  header{
    display: flex;
    align-items: center;
    background-color: #fff;
    top: 20px;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    .van-search{
      flex: 1;
    }
    .inputRight {
      margin-right: 20px;
      .custom-line{
        height: 16px;
        margin:0;
      }
      .downList {
        position: relative;
        left: 0;
        height: 220px;
        background-color: #fff;
        .custom-scroll-list {
          padding: 16px 10px;
        }  
      }
    }
    
  }

  footer{
    bottom: 30px;
    section.location,section.open{
      position: absolute;
      top: -50px;
      right: 10px;
      background-color: #fff;
      padding: 10px;
      display: inline-block;
      img{display: block;width:20px;}
    }
  }
  
  .mask{
    z-index: 1000;
    background: rgba(100,100,100,.8);
  }
}
  
</style>
