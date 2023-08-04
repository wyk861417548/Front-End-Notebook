##### 1.什么是MVVM？和MVM有什么区别？什么又是MVP？[参考](https://zhuanlan.zhihu.com/p/27302766)
- MVC
  - M（model）用于封装业务逻辑相关得数据以及对数据得处理方法
  - V（view）视图层，主要负责数据得展示
  - C（controller）响应机制封装在此，当用户和应用产生交互，控制器中得触发器开始工作
    - M和V之间使用了观察者模式，V先在M上注册，进入观察M，以便更新在M上发生改变得数据（M只是写了注册和通知V的方法，实际操作在C中）
    - V和C之间使用了策略模式，V中引入了C得实例来实现特定得响应策略
      - 问题：每个事件都经过controller使得这层变得十分臃肿,而且V和C一般都是一一对应，这种紧密得连接让C得复用成了问题。

- MVP
  - P（Presenter），通过P来实现V和C的解耦，mvc中C只知道M的接口，因此没办法控制V的更新，MVP中，V层的接口暴露给P，因此我们可以在P层中将V和C的变化绑定在一起，以此来实现V和M的更新

- MVVM
 - VM（ViewModel视图模型）：和mvp思路是相同的，只不过通过双向绑定将V和M的同步更新给自动化，当M变化VM就会自动更新，VM变化了V也会更新，这样就将Presenter中的工作给自动化了。

##### 2.什么是Virtual DOM？为什么 Virtual DOM 比原生 DOM 快？
- Virtual DOM
  - 我们通过将模板经过一系列操作，生成一个与实际dom有着映射关系的一个ast树。

- 减少了DOM的操作次数，从而避免了频繁的回流与重绘