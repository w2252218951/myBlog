---
title: 实现从列表到详情，跳转返回列表仍然是跳转之前的数据。
tags:
- 路由相关
- Vue
categories:
- 心得
date: 2021-04-21
---

问题：我目前正在负责一个后台管理项目，管理系统最多的无外乎就是这张表，那张表。而这个问题就是出现在表上，基本上表上的每个数据都要有一个详情，而且由于表的中的数据量一般都很大，都会用到分页或者查询搜索。而这个问题就出现在表页面与详情页面或者编辑页面跳转时，不能很好的缓存列表页在跳转至其他页面再进行返回时的场景。

好的扯了这么多，那么我是如何解决的呢?

因为在`Vue`中，每个页面都可以被认为是一个组件，这个时候，可以考虑将该页面进行缓存，然后我在`Vue`官网找到了`keep-alive`,其具体内容如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e1460088d774c84862971a70d6aa991~tplv-k3u1fbpfcp-watermark.image)

以上可以知道，通过`keep-alive`是可以缓存不活动的组件实例的，并且在`keep-alive`中是会有`activated`和`deactivated`两个生命周期钩子函数。

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

但是实际情况好像并没有什么乱用，因为根据我自己的实验，从列表进入其他页面后，该页面的并没有被缓存在`keep-alive`中，而是直接展示的。然后返回列表时，之前的分页或查询条件并没有被缓存。我个人觉得是因为详情页并没有将`keepAlive`设置为`true`,而`keep-alive`需要
