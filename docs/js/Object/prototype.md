---
title: 理解原型链
tags:
- js
- 原型链
- 对象
categories:
- 笔记
date: 2021-02-26
---

::: tip

**每个函数创建**时，都会按照**特定的规则：**

1. 创建**一个`prototype`属性**（指向原型对象）；

2. 默认情况下，**所有原型对象**会自动获得**一个 `constructor属性`**，指向与之关联的构造函数；

3. 自定义构造函数时**，**原型对象**会默认获得`constructor`属性，其他所有方法都继承自`Object`；

4. 每次调用构造函数创建新实例，实例内部的`[[Prototype]]`指针就会被赋值为**构造函数的原型对象**，脚本中没有访问该特性的方法，但在Safari、Chrome、Firefox中会在每个对象上暴露`__proto__`属性，能通过这个属性访问**对象的原型**；

:::

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
