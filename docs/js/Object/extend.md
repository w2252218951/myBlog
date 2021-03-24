---
title: 继承
tags:
- js 
- 对象 
categories:
- 笔记
date: 2021-03-13
---

面向对象语言都支持两种继承：<mark>接口继承</mark>（只继承方法签名）和<mark>实现继承</mark>（继承实际的方法）

因为在`ECMAScript`中的函数是**没有签名**的，所有**接口继承**是**不能实现**的。

<mark>实现继承</mark>是`ECMAScript`中**唯一支持**的继承方法，<mark>主要通过原型链实现。</mark>

## 1、原型链 p238

将一个原型**指向另一个**类型的**实例**。意味着这个**原型本身**会有一个**内部指针**，指向**另一个原型**，相应的**另一个原型**也会有**一个指针**指向**另一个构造函数**。

<mark>在实例和原型之间构造一条原型链，这就是原型链的基本思想</mark>

```js
function Person(){
    // 实例化时会调用本方法
    this.name = 'sans'
    console.log(this.name); // sans
}
let person = new Person();

// 将原型指向另一个类型的实例
function SuperType() {
    // 默认情况下 this 挂载在 window下
    // 在实例化时将this 指向了自身
    console.log(this) // SuperType
    this.property = true
}
SuperType.prototype.getSuperValue = function (){
    return this.property
}
function SubType() {
    this.subproperty = false
}
// 继承 SuperType
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function (){
    return this.subproperty
}
let instance = new SubType(); 
console.log(instance.getSuperValue()); // true
```

`instance`是`SubType`函数的实例，其有`__proto__`指针，指向`SubType函数的原型对象 SubType.prototype`，而`SubType的原型对象又是SuperType的实例`，通过`__proto__`指针一直向外查找。

上述 `SubType`**重写**了自己的**原型**，将其<mark>替换为 `SuperType`的实例</mark>，意味这`SubType`的**实例**可以**访问所有**在<mark>`SuperType`上可访问的属性和方法。</mark>

<img src="file:///C:/Users/14997/AppData/Roaming/marktext/images/2021-03-05-08-12-42-image.png" title="" alt="" data-align="center">

**原型链**能够**拓展原型搜索机制**。在读取实例的属性时，会在**实例**上**先进行搜索**。如果没有，就会**继续搜索实例**的原型，通过**原型链继承后**，**就会继承向上**，去**搜索原型的原型**。<mark>对属性和方法的搜索会一直持续到末端。</mark>

### 1.1、默认原型 p240

<mark>默认情况下，所有引用类型都继承自`Object`，这也是通过原型链实现的。</mark>

**每个实例**都有一个**内部指针**<mark>指向`Object.prototype`</mark>,因为**任何函数**的**默认原型**都<mark>是`Object`的实例</mark>

<img title="" src="file:///C:/Users/14997/AppData/Roaming/marktext/images/2021-03-08-22-15-24-image.png" alt="" data-align="center">

`instance`<mark>是`SubType`的实例</mark>，<mark>`SubType`继承`SuperType`,</mark>`SuperType`继承`Object`。在调用`instance.toString()`**实际上调用**的是保存在`Object.prototype`上的方法

### 1.2、原型与继承关系 p240

<mark>原型与实例的关系</mark>通过两种方法进行判断:<mark>`instanceof`,`isPrototype（）`</mark>

`instanceof`：如果实例的原型链中出现过相对应的构造函数就返回`true`

```js
// 通过 instanceof 判断实例的原型链中是否出现过相对应的构造函数。
console.log(instance instanceof Object); // true
console.log(instance instanceof SuperType); // true
console.log(instance instanceof SubType); // tru; // true
```

`isPrototypeOf()`：传入的参数的原型链中是否存在调用它方法的这个原型

```js
// 通过isPrototype()传入的参数判断传入参数的原型链中是否包含调用它的原型
console.log(Object.prototype.isPrototypeOf(instance)); // true
console.log(SuperType.prototype.isPrototypeOf(instance));; // true
console.log(SubType.prototype.isPrototypeOf(instance)); // true
```

### 1.3、关于方法 p241

```js
function SuperType() {
    this.property = true
}
SuperType.prototype.getSuperValue = function (){
    return this.property
}
function SubType() {
    this.subproperty = false
}
// 继承SuperType
SubType.prototype = new SuperType();
let test = new SuperType();
// 新方法
SubType.prototype.getSubValue = function (){
    return this.subproperty;
}
// 覆盖已有的方法
SubType.prototype.getSuperValue = function (){
    return false
}
// 任然调用最初的方法。
console.log(test.getSuperValue()); // true
let instance = new SubType();
console.log(instance.getSuperValue()); // false
```

`SuperType`的`getSuperValue`在原型链上**被`SupType`上**的**新方法遮蔽**，但是`SuperType`**的实例**，**任然会调用最初的方法**

<mark>以对象字面量创建原型方法会破坏之前的原型链，相当于重写了原型链</mark>

```js
function SuperType() {
    this.property = true
}

SuperType.prototype.getSuperValue = function () {
    return this.property
}

function SubType() {
    this.subproperty = false
}

// 继承SuperType
SubType.prototype = new SuperType();
// 通过对象字面量添加新方法，会导致上一行无效
SubType.prototype = {
    getSubValue() {
        return this.subproperty;
    },
    someOtherMethod() {
        return false;
    }
}
let instance = new SubType();
console.log(instance.getSuperValue()); // Uncaught TypeError
```

子类的原型**被赋值**为`SuperType`的**实例**后，又**被一个对象覆盖**了。覆盖后**的原型**是一**个`Object`实例**，而不**是`SuperType`的**实例。<mark>原型链在这时断了。</mark>

### 1.4、原型的问题 p242

<mark>原型链是实现**继承**的强大工具，但也存在着一定的问题</mark>

<mark>1、主要问题出现在原型中包含引用值得时候。</mark>

原型中所有包含的**引用值**都是可以在**实例间共享**的，这也就是为什么属性通常会在构造函数中定义而不是在原型上的定义的原因。

<mark>在原型链实现继承时，原型实际上变成了另一个类型的实例。</mark>

<mark>2、子类型在实例化时不能给父类型的构造函数传参</mark>，事实上我们无法在不影响所有对象实例的情况下把参数传进父类的构造函数。

## 2、盗用构造函数 p243

<mark>"盗用构造函数"</mark>（constructor stealing ，也叫 "对象伪装"，"经典继承"，用于解决原型包含引用值导致的继承问题）

**思路：** <mark>在子类构造函数中调用父类的构造函数</mark>，<mark>通过`call` 和` apply`以</mark>**新创建**的对象为**上下文**执行构造函数

```js
// 在子类构造函数中调用父类构造函数
// 通过call 和 apply以新创建的对象为上下文执行构造函数
function SuperType(){
    this.colors = ['red','blue','pink']
}
function SubType(){
    SuperType.call(this)
}
let instance1 = new SubType();
instance1.colors.push('yellow');
console.log(instance1.colors);
// ['red','blue','pink','pink'] 

let instance2 = new SubType();
console.log(instance2.colors);
// ['red','blue','pink']
```

### 2.1、优点：传递参数 p243

<mark>**优点：** 可以在子类构造函数中父类构造函数传参</mark>

```js
//在子类构造函数中向父类构造函数传参
function SuperType(name){
    this.name = name;
}
function SubType(){
    // 继承 SuperType 并传参
    SuperType.call(this,'sans');
    this.age = 22;
}
let instance = new SubType();
console.log(instance.name); // 'sans'
console.log(instance.age); // 22
```

### 2.2、问题

使用构造函数模式自定义类型的问题：<mark>必须在构造函数中定义方法，函数不能重用</mark>

<mark>子类也不能访问父类原型上定义的方法，因此所有类型只能使用构造函数模式</mark>

## 3、组合继承 p244

<mark>综合了原型链和盗用构造函数，结合了两种</mark>

<mark>**思路：** 使用原型链继承原型上的属性和方法，在通过构造函数继承实例属性</mark>

```js
// 组合继承
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function () {
    console.log(this.name);
}

function SubType(name, age) {
    // 继承属性
    SuperType.call(this, name);
    this.age = age;
}

// 继承方法
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function () {
    console.log(this.age);
}
let instance1 = new SubType('sans', 22);
instance1.colors.push('yellow');
console.log(instance1.colors); // "red,blue,green,black"
instance1.sayAge(); // 22
instance1.sayName(); // 'sans

let instance2 = new SubType('hw',23);
console.log(instance2.colors); // "red,blue,green"
instance2.sayAge();  // 23
instance2.sayName(); // 'hw'
```

<mark>`JavaScript`中使用最多的继承模式</mark>，同时也保留了`instanceof`操作符合`isPrototype（）`方法

## 4、原型式继承 p245

```js
// 原型式继承
// 本质上是 在object函数中创建一个临时构造函数
// 将传入的对象赋值给临时构造函数的原型
// 然后返回这个临时类型的一个实例
// 本质上进行了一次浅复制
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};
let anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");
// 该anotherPerson其实是 F()的实例
console.log(anotherPerson);  // F {name : 'sans', __proto__}
let yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");
console.log(person.friends); // "Shelby,Court,Van,Rob,Barbie"
```

<mark>实际上就是新对象的原型对象被赋值为父对象的实例</mark>

在`ES5`中 通过`Object.create()`方法，将**原型式继**承概念**规范**化了。

接收两个参数：

1. 作为新对象的原型对象

2. 给新对象定义额外属性的对象（可选）

只有一个参数时，`Object.create()`与上述`object()`方法效果相同，第二个参数与`Object.defineProperties()`的第二个参数一样：将每个新增属性都根据各自的描述符进行描述。**会遮蔽原型对象上的同名属性**

```js
let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};
let anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");
console.log(anotherPerson);  //  {name : 'sans', __proto__}

let yetAnotherPerson = Object.create(person, {
    name: {
         value: 'sass'
    }
})
console.log(yetAnotherPerson.name);
```

::: tip

原型式继承不需要单独创建构造函数，但仍需要共享对象信息的场合。属性中包含的引用值始终都是在相关对象间共享的，这个和原型模式是一样的

:::

## 5、寄生式继承 p246

与原型式继承类似，思路类似于寄生构造函数和工厂模式

::: tip

思路：创建一个实现继承的函数，以某种方法增强对象，然后返回这个对象。

::: 

```js
// 寄生式继承
function createAnother(og){
    let clone = Object.create(og); // 创建一个新对象
    clone.say = function (){   // 增强该该对象
        console.log("hi");
    }
    return clone  // 返回该对象
}
let person = {
    name: 'sans',
    friends:  ["Shelby", "Court", "Van"]
}
let anotherPerson = createAnother(person);
anotherPerson.say()  // hi
```

基于`person`对象返回了一个新对象。新对象具有`person`的所有属性和方法。

寄生式继承**适合只关注主要对象**，而**不在乎类型**和**构造函数**的场景。`object`函数不是寄生式继承必需的，任意返回新对象的函数都可以使用。

::: warning

通过寄生式继承给对象添加函数会导致函数难以重用，与构造函数模式类似。

:::

## 6、寄生式组合继承

组合式继承存在效率问题：父类构造函数始终会被调用两次：

1. 创建子原型式调用；

2. 在子类构造函数中调用；

本质上，**子类原型**最终要包含**超类（父类）对象**的**所有**实例**属性**，子类构造函数只要在执行时重写自己的原型就行了。

```js
// 寄生式组合继承
function SuperType(name){
    this.name = name;
    this.colors = ['red','green','blue']
}
SuperType.prototype.sayName = function (){
    console.log(this.name);
}

// 子类
function SubType(name, age){
    SuperType.call(this,name); // 第二次调用SuperType()
    this.age = age;
}
SuperType.prototype = new SuperType() // 第一次调用SuperType()
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
    console.log(this.age);
};
var instance1 = new SubType('666');
```

![](http://54sans.top:5000/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202021-03-16%20151600.jpg);
![](http://54sans.top:5000/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202021-03-16%20151830.jpg);

::: tip

寄生式组合继承通过：盗用构造函数继承属性，使用混合式原型链继承方法。

**思路：** **不通过**调用**父类构造函**数给**子原型赋值**，取得父类型的**副本**。本质上就是通过寄生式继承来**继承父类**原型，然后将返回的新对象**赋值给子类**原型。

:::

```js
/**
 * 寄生式组合继承模式
 * @param subType 子类
 * @param superType 父类
 */
function inheritPrototype(subType,superType){
    let prototype = Object.create(superType.prototype) // 创建对象
    prototype.constructor = subType;  // 增强对象
    subType.prototype = prototype;  // 赋值对象
}

function SuperType(name){
    this.name = name;
    this.colors = ['red','green','blue']
}
SuperType.prototype.sayName = function (){
    console.log(this.name);
}

// 子类
function SubType(name, age){
    SuperType.call(this,name);
    this.age = age;
}

// 只是复制了 父类构造函数 并没有去调用
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function () {
    alert(this.age);
}
let instance = new SubType("sans");
console.log(instance.name)
//指向SubType 如果没有修正原型的构造函数，则会指向父类构造函数
console.log(instance.constructor) 
```
