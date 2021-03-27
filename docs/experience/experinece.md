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


