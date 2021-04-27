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

```js
functon Foo(){}
let f1 = new foo();
let f2 = new foo();
```

![](https://user-gold-cdn.xitu.io/2018/5/13/1635882f458a9fb2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 构造函数<mark>`Foo()`</mark> 
   
   构造函数`Foo`其原型属性`prototype`指向其原型对象`Foo.prototype`。原型对象`Foo.prototype`的默认属性`constructor`指向原函数`Foo`。
   
   ```js
   console.log(Foo.prototype)
   ```
   
   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13590ee4110844bdba3ce9aeadcda6db~tplv-k3u1fbpfcp-watermark.image)
   
   
   
   构造函数`Foo`的实例`f1,f2`，其`__proto__`属性指向其构造函数的原型对象`Foo.prototype`，所以实例能共享原型对象上的属性和方法。
   
   ```js
   console.log(f1.__proto__, 'f1.__proto__');
   console.log(Foo.prototype, 'Foo.prototype');
   console.log(f1.__proto__ === Foo.prototype); // true
   ```
   
   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27ac90581ce94f4fb082a53b41de400e~tplv-k3u1fbpfcp-watermark.image)
   
   
   
   构造函数`Foo`是`Funciton`函数创建的实例，所以其`__proto__`属性指向的是`Function`函数的原型对象`Function.prototype`。
   
   ```js
   console.log(Foo.__proto__, 'Foo.__proto__');
   console.log(Function.prototype, 'Function.prototype');
   console.log(Foo.__proto__ === Function.prototype); // true
   ```
   
   ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f02cfe83ece489db25e22be2269395e~tplv-k3u1fbpfcp-watermark.image)
   
   
   
   构造函数`Foo`的原型对象`Foo.prototype`（本质上是一个对象），是`Object`创建的一个实例，因此其`__proto__`属性指向`Object`的原型对象`Object.prototype`。
   
   ```js
   console.log(Foo.prototype.__proto__, 'Foo.prototype.__proto__');
   console.log(Object.prototype,'Object.prototype');
   console.log(Foo.prototype.__proto__ === Object.prototype) // true
   ```
   
   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ad2f26ad034c8f8f0f68c665d39c2c~tplv-k3u1fbpfcp-watermark.image)

2. `Function`函数
   
   <mark>所有的函数其实都是`Function`函数的实例</mark>，所以所有的函数的`__protot__`属性都指向`Function.prototype`。
   
   因为`Function`函数实例化了它本身，所以`Function.__protot__`就等于`Function.prototype`。
   
   ```js
   console.log(Function.__proto__, 'Function.__proto__');
   console.log(Function.prototype, 'Function.prototype');
   console.log(Function.__proto__ === Function.prototype) // true
   ```
   
   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb0da376c9fa466cb8274637b8b86128~tplv-k3u1fbpfcp-watermark.image)
   
   `Function`函数的原型对象是`Object`函数创建的实例，因此`Function.prototype.__proto__`，指向的是`Object`的原型对象`Object.prototype`
   
   ```js
   console.log(Function.prototype.__proto__, 'Function.prototype.__proto__');
   console.log(Object.prototype, 'Object.prototype');
   console.log(Function.prototype.__proto__ === Object.prototype) // true
   ```
   
   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ae1fd0e025f4d2f90f66cbc21a0f931~tplv-k3u1fbpfcp-watermark.image)

3. `Object`函数
   
   `Object`函数实际上是`Function`函数创建的实例，其`__proto__`属性指向的就是`Function`函数的原型对象`Function.prototype`。
   
   <mark>需要注意的是`Object.prototype`的`__proto__`终止于`null`</mark>
   
   ```js
   console.log(Object.prototype.__proto__, 'Object.prototype.__proto__');
   ```

        ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/108e9af19028411196bb7a90b9f057ee~tplv-k3u1fbpfcp-watermark.image)

如果上述有什么不对的地方，可以在下方留言评论告知哦！  

纯手打，请各位大佬给我点个赞！感谢！  

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06c252dad9fa4d07ae0713f1654daaaf~tplv-k3u1fbpfcp-zoom-1.image)
