---
title: 后台管理列表数据缓存
tags:
- 路由相关
- Vue
categories:
- 心得
date: 2021-04-21
---

问题：我目前正在负责一个后台管理项目，管理系统最多的无外乎就是这张表，那张表。而这个问题就是出现在表上，基本上表上的每个数据都要有一个详情，而且由于表的中的数据量一般都很大，都会用到分页或者查询搜索。

需求：也就是咱们要解决的问题，这个问题就出现在表页面与详情页面或者编辑页面跳转时，不能很好的缓存列表页在跳转至其他页面再进行返回时的场景。简而言之就是缓存列表组件并只在对应模块下进行缓存。

好的扯了这么多，那么我是如何解决的呢?

因为在`Vue`中，每个页面都可以被认为是一个组件，这个时候，可以考虑将该页面进行缓存，然后我在`Vue`官网找到了`keep-alive`,其具体内容如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e1460088d774c84862971a70d6aa991~tplv-k3u1fbpfcp-watermark.image)

以上可以知道，通过`keep-alive`是**可以缓存不活动**的组件实例的，并且在`keep-alive`中是会有`activated`和`deactivated`两个生命周期钩子函数。

最初时，我是在 `router`中添加`meta`元信息,在其中添加一个`keepAlive`属性，并将要缓存的页面设置为`true`

```js
// 需要被缓存的页面路由
{
    path: '/keepAlive',
    name: 'keepAlive',
    component: keepAlive,
    meta:{
        keepAlive: true
    }
}
```

然后在视图组件`router-view`上添加`keepAlive`

```html
<keep-alive>
     <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>
```

最后通过`activated`和`deactivated`函数在被缓存的页面调用相关的方法。

上述方法能将符合条件的路由进行缓存，**但是**上述方法有一个**弊端**，回到一开始的需求，是要在对应模块下缓存列表组件，而上述方法是将所有符合条件的路由进行了缓存，但是并没有做到仅仅只是在对应模块下缓存。

网上说直接将`keepAlive`设置为`false`就能销毁缓存，从我实验的结果来看，貌似并没有什么卵用，改天用`Vue-devtools`看看到底有没有被销毁。

在观看官方文档时，`keep-alive`自带三个`props`,分别是`include、exclude、max`，具体使用方法我就不多做赘述了直接上文档吧。

[API — Vue.js](https://cn.vuejs.org/v2/api/#keep-alive)

好了，下面直接说我的解决办法吧。我将`include`和`vuex`搭配进行了使用，使用`include` 判断需要缓存的路由，通过`vuex` 全局缓存数据，因为这个需求是对整个系统的列表而言，因此我还是用了 [mixin]([混入 — Vue.js](https://cn.vuejs.org/v2/guide/mixins.html#%E5%9F%BA%E7%A1%80))(混入)

```js
// store
state: {
    // 用来存放需要需要缓存的组件
    keepAliveArray: []
}，
mutatios: {
    // 清空缓存组件
    clearKeepAliveArr(state, data){
        state.keepAliveArray = data
    },
    // 添加需要缓存的数据
    pushKeepAliveArr(state, data){
        state.keepAliveArr.push(data)
    },
}
```

```js
// main.js
// 全局混入一个导航守卫，在离开当前页面时使用
Vue.mixin({
    beforeRouteLeave(to, from, next){
      // 如果是跳转的是列表列表要清空之前的数据
      if(to.meta.isList ){
          this.$store.commit('clearKeepAliveArr',[]);
          this.$store.commit('pushKeepAliveArr',to.name);
      }
    }
})
```

```js
// router
// 需要注意的是：因为include是靠组件名进行判断是否缓存
// 因此必修将 name 和 组件名保持一致。
{
    path: 'list1',
    name: 'list1',
    component: list1,
    meta: {
        pageName: '列表1'，
        isList: true
    }
},
{
    path: 'details1',
    name: 'details1',
    component: details1,
    meta: {
        pageName: '详情1'，
    }
},
{
    path: 'list2',
    name: 'list2',
    component: list2,
    meta: {
        pageName: '列表2'，
        isList: true
    }
},
```

```js
// router-view   所在的页面
<template>
        <keep-alive :include="keepAliveArr">
            <router-view></router-view>
        </keep-alive>
</template>
<script>
export default {
    computed: {
        keepAliveArr(){
            return this.$store.state.keepAliveArr
        }
    },
};
</script>
```

通过以上所述方法就能够成功的将同一模块下面的列表进行缓存了，因为是使用的是路由守卫进行的数据的添加和删除，**因此**，如果想要在**页面刷新后**任要能够进行缓存，可以再`vuex`上添加`sessionstorage`缓存数据，这里我就不做说明了，相信这难不到聪明的你，并且如果路由存在子级话，想要缓存路由还是需要在`router-view`上加上`keep-alive`。

如果上述有什么不对的地方，或者各位大佬们有什么更好的方法，可以在下方留言评论告知哦！

纯手打，请各位大佬给我点个赞!

http://img2.biaoqingjia.com/biaoqing/201808/5b61a1c571f142f5756d3535d37fa12e.gif
