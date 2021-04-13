---
title: 函数相关
tags:
- js
- 函数
categories:
- 笔记 
date: 2021-04-12
---

## 1、箭头函数 p288

如果只有一个参数，可以不用括号。没有参数或多个参数才需要使用括号：

```js
// 以下两种方法都有效
let double = (x)=> {return 2 * x};
let triple = x => {return 3 * x};

// 没有参数时需要括号
let getRandom = ()=> { return Math.random();}

// 多个参数需要括号
let sum = (a, b) => { return a + b};

// 无效的写法
let mutiply = a,b => { return a * b};
```

箭头函数的大括号说明包含**函数体** ，可以在一**个函数中包含多条语句**。如果不使用大括号，箭头后面的就只能**是一行代码**，比如一个**赋值操作**或者**表达式**。而且省略大括号会**隐式的返回**这行代码。

```js
// 以下两种方式都有效而且会返回相应的值
let double = x => {return x * 2};
// 箭头函数省略大括号会隐式的返回值
let triple = x => x * 3;
// 进行赋值
let value = {};
let setName = (x) => x.name = 'Sans';
setName(value);
console.log(value.name); // Sans
//无效的写法
let mutiply = (a,b) => return a * b
```

:::tip

箭头函数不能使用`arguments`，`super`和`new.target`,也不能用作构造函数。此外箭头函数也没有`prototype`属性。

:::

## 2、函数名

<mark>函数名就是指向函数的指针</mark>

`ECMAScript6`的**所有函数对象都会暴露**一个只读`name`属性，保存的是函数标识符

即使函数没有名称也会显示成空字符串，如果使用`Function`构造函数，则会标识成“anonymous”

```js
// 函数标识符 name
function foo(){};
let bar = function (){};
let baz = ()=> {};

console.log(foo.name);  // foo
console.log(bar.name);  // bar
console.log(baz.name);  // baz
console.log((() => {}).name); // ''
console.log(new Function().name); // anonymous
```
