##### 1.请说一下 vue2 响应式原理
简单来说: vue2 基于Object.defineProperty对数据进行劫持

从源码角度：使用initData对数据进行初始化操作，然后调用observe函数并实例化observer类，内部对所有属性进行了重写，并递归劫持了对象中的对象

所以我们在使用vue的时候，如果数据层级过深要注意优化，如果不是响应式的就不要放在data中，要避免多次取值，还可以使用Object.freeze()来冻结对象