---
title: 面试
tags:
- js
categories:
- 面试
- 日常
date: 2021-03-13
---

1. 严格模式`（use strict）`下开发，有什么好处？
   
   1. 消除`JS`语法的不合理，不严谨，减少一些怪异行为的产生；
   
   2. 消除代码运行的一些不安全之处，报错代码运行的安全；
   
   3. 提高编译器效率，增加运行速度；
   
   4. 为新版的`JS`做好铺垫；

2. 如何准确的判断一个值得类型？
   
   ```js
   Object.prototype.toString.call(yourObject).
   Object.prototype.toString.call(new String("i am a string"));
   // "[object String]"
   ```

### 设计一个HTML模板占位替换函数，将HTML中`：`开头的属性和文本内`{{}}`的占位符替换为键值对中对应的值？

```js

```

### 怎样优化用户首屏体验？

答：

### Vue原理是什么？

### VueRouter原理是什么？

**两种模式：hash模式、history模式**

**区别：**

**hash模式：**

- `URL`锚点`#` 后面的内容为路径地址

- 监听`hashchange`事件

- 根据当前的地址找到相对应的组件进行渲染

**history模式：**

- 调用的是`H5`新增的`history API`

- 通过`pushState、replaceState`改变当前的地址

- 监听`popstate`事件

- 根据当前的地址找到相对应的组件进行渲染

使用`back,forward,go`在用户历史记录中向前或向后跳转

### 输入框样式兼容

### 判断类型的几种方法？

```js
let arr = [];
// 通过原型链判断
arr.__proto__ === Array.prototype // true
// 通过instanceof  判断原型链上是否存在该对象
arr instanceof Array 
// 通过isPrototype 传入当前函数的参数存在于调用函数的原型链上
Array.prototype.isPrototypeOf(arr)
// 通过 数组方法 Array.isArray
Array.isArray(arr)
// 通过Object.prototype.toString.call()
Object.prototype.toString.call(arr) // [object Array]
Object.prototype.toString.call(arr).slice(8, -1) // Array
```

## 什么是事件委托？

**事件委托**，又叫**事件代理**，就是利用**事件冒泡**，可以使用一个事件处理程序管理一种类型的**事件**

举个栗子：

```html
<ul id='ul-wrap'>
     <li></li>
     <li></li>
     <li></li>
</ul>

<script>
  let ul = document.getElementId('ul-wrap');
/*
* 通过在 ul上的事件监听统一管理 li 上面的点击事件
*/
 ul.addEventListener('click', (e)=> {
    let target = e.target
})
</script>
```

其优点：

- `document`对象随时可用，任何时候都可以给它添加**事件处理程序**，这意味着只要页面渲染出来可以点击的元素，就可以无延迟的进行使用。

- 节省在设置页面处理程序上的事件，指定一个处理程序可以减少对`DOM`的引用，也可以节省时间

- 减少整个页面所需的内存，提高性能

## 从输入 URL 到展示页面发生了什么？

1. 浏览器查找当前`url`是否出现缓存，并比较缓存是否过期

2. 通过`DNS`解析`URL`对应的`IP`地址

3. 根据`IP`建立`TCP`连接（三次握手）

4. `HTTP`发起请求。

5. 服务器处理请求，浏览器接受`HTTP`响应

6. 渲染页面，构建`DOM`树

7. 关闭`TCP`连接（四次挥手）

## 浏览器缓存

## 浏览器存储

## HTTP模型

| 应用层 |     |
| --- | --- |
| 表示层 |     |
| 会话层 |     |
| 传输层 |     |
| 网络层 |     |
| 链路层 |     |
| 物理层 |     |
|     |     |
