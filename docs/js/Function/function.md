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

函数如果是一个获取函数、设置函数、或者使用`bind()`实例化，那么标识符就会加上前缀

```js
// 函数前缀 给设置函数 获取函数或者通过 bind实例化的函数会带有前缀
function foo(){};
console.log(foo.bind(null).name); //  bound foo 
let dog = {
    years : 1,
    get age(){
        return this.years
    },
    set age(newAge){
        this.years = newAge
    }
}
let propertyDescriptor = Object.getOwnPropertyDescriptor(dog,'age');
// 相当于直接遍历调用上述方法
let propertyDescriptors = Object.getOwnPropertyDescriptors(dog);
console.log(propertyDescriptor);
console.log(propertyDescriptors);

console.log(propertyDescriptor.get.name);  // get age
console.log(propertyDescriptor.set.name);  // set age
```

## 3、理解参数 p 290

在使用`function`关键词定义(**非箭头函数**)函数时，能够通过访问函数内的`arguments`对象，从中取得每个传入的参数。

**`arguments`对象是一个类数组对象（并不是`Array`的实例）**。可以通过`arguments.length`判断传入多少个参数。

```js
function howManyArgs() { 
 console.log(arguments.length); 
} 
howManyArgs("string", 45); // 2 
howManyArgs(); // 0 
howManyArgs(12); // 1 
```

<mark>`arguments`可以跟命名参数一起使用</mark>

```js
function doAdd(num1, num2) { 
 if (arguments.length === 1) { 
 console.log(num1 + 10); 
 } else if (arguments.length === 2) { 
 console.log(arguments[0] + num2); 
 } 
} 
```

<mark>在`arguments`中，它的值始终会与对应的命名参数同步</mark>

```js
// arguments的值始终与对应的命名参数同步
function add(num1, num2){
    arguments[1] = 30;
    console.log(arguments[0] + num2);
}
add(10,20) // 40 
```

`arguments`的值会**自动同步**到对应的**命令参数**，但是其**内存地址**是分开的，仅仅只是**保持同步**了而已。

:::tip

`arguments`对象的长度是根据传入的参数的个数，而不是定义函数时给出的命令参数的个数决定的。

:::

::: warning

在严格模式下，将`arguments[1]`赋值不会影响`num2`的值。其次，在函数中重写`arguments`对象也会导致语法错误

:::

### 箭头函数中的参数

<mark>在箭头函数中只能够通过命名参数进行访问，不能使用`arguments`关键词</mark>

<mark>在箭头函数中没有`arguments`对象，但是可以将其包装在函数中，提供给箭头函数</mark>

```js
// 将arguments对象包装在函数中然后传递给箭头函数
function foo(){
   let bar = ()=> {
       console.log(arguments[0]);
   }
   bar();
};
foo(5) // 5
```
