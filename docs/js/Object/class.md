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

## 1、类定义： p249

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

### 类的构成 p 250

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

## 2、类构造函数 p250

`constructor`用于在**类定义块中**创建类的**构造函数**，该方法会告诉**解释器**在使用`new`操作符创建类的**新实例**时，应该调用这个函数。  

<mark>构造函数的定义不是必须的，不定义构造函数相当于将构造函数定义为空函数。</mark>  

### 2.1、实例化

<mark>`new`操作符实例化`Person`等于使用`new`调用其构造函数</mark>  

<mark>`new`和类意味着使用`constructor`函数进行实例化</mark>  

使用`new`操作符调用类的构造函数会执行如下操作：  

1. 在内存中创建一个对象；  

2. 将构造函数的`prototype`属性赋值给新对象内部的`[[Prototype]]`指针；  

3. 将构造函数内部的`this`赋值给新对象（指向新对象）；  

4. 执行构造函数内部的代码（给构造函数添加属性）；  

5. 如果构造函数返回非空对象，就返回该对象，反之，返回新对象；  

```js
 // 实例化 类  
 class Animal {}  

 class Person {  
 constructor(){  
 console.log('person');  
 }  
 } class Vegetable {  
 constructor() {  
 this.name = 'apple' }  
 } let a = new Animal();  
 let b = new Person();  
 // 使用new 操作符会调用该构造函数 person let c = new Vegetable();  
 console.log(c.name); // apple  
```

<mark>类实例化时传入的参数会用作构造函数的参数。如不传参，类名后面的括号可不写</mark>  

```js
 // 实例化类时传参  
 class Person {  
 constructor(name) {  
 console.log(arguments.length);  
 this.name = name || null  
 }  
 } let p1 = new Person  // 0 console.log(p1.name); // null  

 let p2 = new Person(); // 0  
 console.log(p2.name); // null  
// 传入参数  
 let p3 = new Person("sans") // 1 console.log(p3.name); // sans  
```

::: tip  
默认情况下，**类构造函数**在执行后会**返回**`this`对象。并且该对象会被**用作实例化**的对象，如果没有引用新创建的`this`对象，该对象会被销毁。  

如果返回的**不是**`this`对象，则该对象**不能通过**`instanceof`操作符**检测**出和**类**有**关联**，因为该**对象原型指针**并没被修改。  

:::  

```js
class Person {  
 constructor(flag){  
 this.foo = 'foo'; if(flag){  
 return {  
 bar : 'bar' }  
 } }}  
let p1 = new Person, p2 = new Person(true);  
console.log(p1); // Person {foo: "foo"}  
console.log(p1 instanceof Person); // true  
// 返回对象原型指针没有被修改  
console.log(p2); // {bar : 'bar'}  
console.log(p2 instanceof Person); // false  
```

### 类构造函数与构造函数的区别：

<mark>调用类构造函数必须使用`new`操作符。</mark>普通的构造函数如果不使用`new`操作符调用，就会**以全局**的`this`作为内部对象。<mark>调用类构造函数不使用`new`就会报错</mark>  

```js
// 类构造函数和构造函数的区别  
function Person () {}  
class Animal {}  

// this指向window 挂载到window上  
let p = Person();  
let a = Animal();  
// TypeError: class constructor Animal cannot be invoked without 'new' ```  

<mark>类构造函数实例化后，会成为普通的实例方法，但仍然要使用`new`调用</mark>  

<mark>因此。实例化之后可以在实力上引用它</mark>  

```js  
// 类构造函数实例化  
class Person {}  
let p1 = new Person();  
p1.constructor();  
// Class constructor Person cannot be invoked without 'new'  

// 使用构造函数的引用创建一个新实例  
let p2 = new p1.constructor();  
```

### 2.2、把类当成特殊函数 p252

`ECMAScript`中并没有正式的类这个类型，但是声明一个类后，通过`typeof`操作符检查类标识符，表明他是个函数。  

```js
// 判断类的类型  
class Person {}  
console.log(Person); // class Person {}  
console.log(typeof Person); // function  
```

<mark>类标识符有`prototype`属性，其原型也有一个`constructor`属性指向类本身。</mark>  

```js
class Person {}  
function fn(){};  
console.log(Person.prototype); // {constructor : f()}  
console.log(fn.prototype); // {constructor : f()}  
console.log(Person.prototype.constructor === Person); // true  
```

通过`instanceof`判断构造函数是否出现在实例的原型链上  

```js
class Person {};  
let p = new Person();  
console.log(p instanceof Person); // true  
```
