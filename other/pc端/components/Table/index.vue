<template>
  <div ref="tableWrapper">
    <el-table ref="table" @filter-change='handleFilterChange' :data="tableData" :row-class-name="useHeighLight ? tableRowClassName : ''" @sort-change="handleSortChange"  @selection-change="handleSelectionChange" :row-key="rowKey" :tree-props="tree">
      <!-- 是否开启勾选 -->
      <el-table-column v-if="selection" type="selection" width="70" fixed="left" :selectable="selectable" ></el-table-column>
 
      <!-- 序号 -->
      <el-table-column v-if="index" type="index" label="序号" width="70">
        <template slot-scope="scope">{{(currentPage-1)*pageSize + scope.$index+1}}</template>
      </el-table-column>

      <!--checked:表格某列是否能够点击  value:后端穿过来的值所对应的名称 -->
      <el-table-column v-bind={...item} v-bind:slot="'default'" :filter-multiple="item['filter-multiple'] || false" :column-key='item.prop' v-for='(item,index) in tableHead' :key='index'>
        <template slot-scope="scope">
          
          <div v-if="!item.slot">
            <div v-if="!scope.row[item.prop] && scope.row[item.prop] !== 0">/</div>

            <div v-else style="display:inline-block;">
              <p v-if="!item.checked">
                <span v-if="!item.value">{{scope.row[item.prop]}}</span>
                <span v-if="item.value">{{item.value[scope.row[item.prop]]}}</span>
              </p>
              <p v-if="item.checked" :class="{'active':item.checked}" type="text" @click="handleChecked(scope.row,item.com)">{{scope.row[item.prop]}}</p>
            </div>
          </div>

          <!-- 自定义随意插槽位置 -->
          <slot v-else :name="item.slot" :value="scope.row[item.prop]" :row="scope.row" :item="item"></slot>
        </template>

        <!-- 头部自定义 -->
        <!-- <template v-bind:slot="'header'">
          <span v-if="item.h">{{item.label}}</span>
          <span v-else><span class="mr-5">{{item.label}}</span><slot :name="item.h" :label='item.label'></slot></span>
        </template> -->
      </el-table-column>

      <!-- 按钮插槽专用于按钮使用 -->
      <slot></slot>

    </el-table>

    <div class="block" style="text-align:center;padding-top:20px;box-sizing:border-box;" ref="pagination" v-if="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
export default {
  props:{
    // 表头配置
    tableHeadConfig:{
      type:Array,
      default:()=>[]
    },

    // 数据
    tableLoadData:{
      type:Array,
      default:()=>[]
    },

    // 是否显示分页  默认显示
    pagination:{
      type:Boolean,
      default:true
    },

    // 勾选框  默认不选中
    selection:{
      type:Boolean,
      default:false
    },

    // 数据 总个数
    total:{
      type:Number,
      default:0
    },

    // 是否使用索引
    index: {
      type: Boolean,
      default: false
    },

    // 页面limit参数
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    },

    // 默认pageSize
    pageSize: {
      type: Number,
      default: 10
    },

    // 是否使用高亮
    useHeighLight: {
      type: Boolean,
      default: true
    },

    // 分页配置
    layout:{
      type:String,
      default:"total, sizes, prev, pager, next, jumper"
    },

    // 行数据的 Key，用来优化 Table 的渲染
    rowKey:{
      type:String,
      default:""
    },

    // 当前页
    currentPage:{
      type:Number,
      default:0
    },

    // 渲染嵌套数据的配置选项
    tree:{
      type:Object,
      default:()=>{}
    }
  },

  computed:{
    tableData(){
      return this.tableLoadData;
    },

    // 头部配置
    tableHead(){
      return this.tableHeadConfig;
    },
  },

  methods: {
    // 监听勾选的行
    handleSelectionChange(data){
      this.$emit('handleSelectionChange',data)
    },

    // 监听当前行是否可选  show:true 禁止
    selectable(row){
      return !row.show;
    },

    // 设置table行高亮
    tableRowClassName({row}) {
      if (row.isTop == 1) {
        return 'isTop-row'
      }
    },

    // 自定义排序
    handleSortChange(event){
      this.$emit('handleSortChange',event)
    },

     // 表单上 的某列数据可以点击
    handleChecked(row) {
      this.$emit('handleChecked',row)
    },

    handleFilterChange(key,value){
      console.log('key',key,value);
    },

    // -----------------------------分页---------------------
    // 分页每页数更改
    handleSizeChange(val) {
      this.$emit('handleSizeChange',val)
    },
    // 分页页数更改
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange',val)
    },

  },
}
</script>

<style lang='scss' scoped>
.active{
  color:#66b1ff;
  cursor: pointer
}
</style>