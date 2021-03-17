---
title: 类
tags:
- js
- 类
- 对象 
categories:
- 笔记 
date: 2021-03-16
---

::: tip
为解决**实现继承**的代码**冗长**和**混乱**的问题，在`ES6`中引入了`class`关键词，定义类；

类（class）是`ECMAScript`中新的**基础性语法糖** ；

**表面上**时**面向对象**编程，实际上仍使用的是**原型和构造函数**的概念；

:::

# 1、类定义： p249

两种定义方式：

1. 类声明：`class Person {}`

2. 类表达式： `const Animal = new class {}`

与函数表达式相似。求值前不能被引用，但是**函数声明可以提升，类声明不能**

```js
// 函数变量提升
console.log(FunctionExp);  // undefined
var FunctionExp = function () {
};
console.log(FunctionExp); // function (){}

console.log(FunctionDec); // FunctionDec (){}
function FunctionDec() {
}

console.log(FunctionDec); // FunctionDec () {}

console.log(classExp);  // undefined
var classExp = class {
}
console.log(classExp); // class {}

console.log(classDec);  
// ReferenceError: ClassDeclaration is not defined
class classDec {
};
console.log(classDec); // class {}
```

<mark>函数受函数作用域的影响，类受块级作用域的影响</mark>

```js
// 函数只受函数作用域限制 类受块级作用域限制
{
    function functionExp() {}
    // 受块级作用域限制
    class classExp {}
}
console.log(functionExp);// functionExp() {}
console.log(classExp); //  Uncaught ReferenceError: classExp is not defined
```

## 类的构成 p 250

<mark>类可以包含构造函数、实例方法、获取函数、获取函数和静态方法，也可以为空。</mark>

<mark>类定义在严格模式下执行</mark>

<mark>类名首字母要大小，却别类的实例</mark>

```js
// 类的构成
// 空类定义 有效
class c1 {
}

// 有构造函数的类 有效
class c2 {
    constructor() {
    }
}

// 有获取方法的类 有效
class c3 {
    get name() {

    }
}

// 有设置函数的类 有效
class c4 {
    set name(val) {

    }
}
// 有静态方法的类 有效
class c5 {
    static myTest() {
    }
}
```
