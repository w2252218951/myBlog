---
title: 理解原型链
tags:
- js
categories:
- 笔记
- 原型链
- 对象
date: 2021-02-26
---

![](https://user-gold-cdn.xitu.io/2018/5/13/1635882f458a9fb2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 构造函数<mark>`Foo()`</mark> 
   
   构造函数`Foo`其原型属性`prototype`指向其原型对象`Foo.prototype`。原型对象`Foo.prototype`的默认属性`constructor`指向原函数`Foo`。
   
   构造函数`Foo`的实例`f1,f2`，其`__proto__`属性指向其构造函数的原型对象`Foo.prototype`，所以实例能共享原型对象上的属性和方法。
   
   构造函数`Foo`是`Funciton`函数创建的实例，所以其`__proto__`属性指向的是`Function`函数的原型对象`Function.prototype`。
   
   构造函数`Foo`的原型对象`Foo.prototype`（本质上是一个对象），是`Object`创建的一个实例，因此其`__proto__`属性指向`Object`的原型对象`Object.prototype`。

2. `Function`函数
   
   <mark>所有的函数其实都是`Function`函数的实例</mark>，所以所有的函数的`__protot__`属性都指向`Function.prototype`。
   
   因为`Function`函数实例化了它本身，所以`Function.__protot__`就等于`Function.prototype`。
   
   `Function`函数的原型对象是`Object`函数创建的实例，因此`Function.prototype.__proto__`，指向的是`Object`的原型对象`Object.prototype`

3. `Object`函数
   
   `Object`函数实际上是`Function`函数创建的实例，其`__proto__`属性指向的就是`Function`函数的原型对象`Function.prototype`。
   
   需要注意的是`Object`的`——proto——`终止与`null`


