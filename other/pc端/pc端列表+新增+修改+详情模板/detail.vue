<template>
  <div class="detail" v-if="vdata">
    <p>
      <span>企业名称：</span>
      <span>{{vdata.projectName || '/'}}</span>
    </p>
    <p>
      <span>行业：</span>
      <span>{{vdata.projectName || '/'}}</span>
    </p>
    <p>
      <span>碳指标配额：</span>
      <span>{{vdata.startDate}}</span>
    </p>

    <p>
      <span>累计碳排放（吨）：</span>
      <span>{{vdata.remark || '/'}}</span>
    </p>

    <p>
      <span>配额余量（吨）：</span>
      <span>{{vdata.remark || '/'}}</span>
    </p>
  </div>

</template>

<script>
export default {
  dicts: [],
  props:{
    vdata:{
      type:Object,
      default:()=>{
        return null
      }
    },
  },

  data () {
    return {
    };
  },

}
</script>
<style lang='scss' scoped>
  .detail{
    p{
      display: flex;
      margin-bottom: 25px;
      span:first-child{
        display: inline-block;
        width: 120px;
        color: rgba(0, 0, 0, 0.85);
        text-align: right;
        margin-right: 20px;
      }
      span:nth-child(2){
        flex: 1;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
</style>