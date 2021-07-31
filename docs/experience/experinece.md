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
