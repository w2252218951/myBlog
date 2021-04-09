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

**表面上**是**面向对象**编程，实际上仍使用的是**原型和构造函数**的概念；

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
 } 
 class Vegetable {  
     constructor() {  
         this.name = 'apple'
      }  
 }
  let a = new Animal();  
 let b = new Person();  
 // 使用new 操作符会调用该构造函数 person
 let c = new Vegetable();  
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
 } 
 let p1 = new Person  // 0 
 console.log(p1.name); // null  
 let p2 = new Person(); // 0  
 console.log(p2.name); // null  
 // 传入参数  
 let p3 = new Person("sans") // 1
 console.log(p3.name); // sans  
```

::: tip  
默认情况下，**类构造函数**在执行后会**返回**`this`对象。并且该对象会被**用作实例化**的对象，如果没有引用新创建的`this`对象，该对象会被销毁。  

如果返回的**不是**`this`对象，则该对象**不能通过**`instanceof`操作符**检测**出和**类**有**关联**，因为该**对象原型指针**并没被修改。  

:::  

```js
class Person {  
     constructor(flag){  
         this.foo = 'foo';
         if(flag){  
             return {  
             bar : 'bar' 
             }  
         } 
     }
}  
let p1 = new Person, 
    p2 = new Person(true);  
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
// TypeError: class constructor Animal cannot be invoked without 'new'    
```

 类构造函数实例化后，会成为普通的实例方法，但仍然要使用`new`调用。

因此。实例化之后可以在实例上引用它。

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

类本身具有普通构造函数一样的行为。在使用`new`调用时就会被当做构造函数。

<mark>类中定义的`constructor`方法并不会被当做构造函数</mark>，在对其使用`instanceOf`时会返回`false`。**但是**，在创建实例时直接将**构造函数**当成**普通函数**调用就会**反转**。

```js
class Person {}
let p1 = new Person();
console.log(p1.constructor === Person); // true 相当于 p.__proto__.constructor === Person
console.log(p1 instanceof Person);  // true
console.log(p1 instanceof Person.constructor);  // false 

// 直接实例化类的构造函数
let p2 = new Person.constructor();
console.log(p2);  // ƒ anonymous() {}
console.log(Person.constructor); // ƒ Function() { [native code] }
console.log(p2.constructor === Person); // false
console.log(p2 instanceof Person); // false
console.log(p2 instanceof Person.constructor); // true
```

<mark>类是`Javascript`中的一等公民，因此也能把类当作参数进行传递</mark>

<mark>类可以像表达式一样在任何地方定义，比如数组中</mark>

```js
// 在数组中定义类
let classList = [
    class {
        constructor(id) {
            this.id_ = id;
            console.log(`instance ${this.id_}`);
        }
    }
]
function createInstance(classDefinition, id){
 // 相当于  return new class(id) 返回 class的实例
    return new classDefinition(id) 
}
let foo = createInstance(classList[0],1024)  // instance 1024
```

<mark>与`IIFE`(立即调用函数表达式)相似，也能够直接实例化</mark>

```js
// 立即调用类表单时
let p = new class Foo{
    constructor(x) {
        console.log(x);
    }
}('bar'); // bar

/*
 // 相当于
class Foo {
    constructor(x) {
        console.log(x);
    }
}
let p = new Foo('bar') // bar
*/
```

## 3、实例、原型和类成员

:::tip
类的语法可以方便的定义存在实例上的成员，存在原型上的成员，以及存在本身的成员。

:::

### 3.1、实例成员

:::tip
每次通过`new` **调用类标识符**，都会**执行类构造函数**。在构造函数内部，会为该新创建的实例添加"自有"属性。

每个实例都对应一个唯一的实例成员，意味着所有成员在实实例上不能够共享。

:::

```js
// 实例成员唯一性
class Person {
    constructor() {
        // 使用对象包装类型定义字符串
        // 以此判断下方测试两个对象的相等性
        this.name = new String('Jack');
        this.sayName = () => {
            console.log(this.name);
        };
        this.nickName = ['Jake', 'J-Dog']
    }
}

let p1 = new Person(),
    p2 = new Person();
p1.sayName() // String {"Jack"}
p2.sayName() // String {"Jack"}
console.log(p1.name === p2.name); // false
console.log(p1.sayName === p2.sayName); // false
console.log(p1.nicknames === p2.nicknames); // false
p1.name = p1.nicknames[0];
p2.name = p2.nicknames[1];
p1.sayName(); // Jake
p2.sayName(); // J-Dog 
```

### 3.2、原型方法与访问器

<mark>为了在实例间共享方法，类定义语法把类块中定义的方法作为原型方法</mark>

```js
// 将类块中的方法定义为原型方法
class Person {
    constructor(){
        // 添加到this的所有内容，都会存在于不同实例
        this.locate = () => {
            console.log('instance');
        }
    }
    locate() {
        console.log('prototype');
    }
}
let p = new Person();
p.locate() // instance
p.prototype.locate() // prototype
```

:::tip

可以将方法定义在类的构造函数或类块中，但不能在类块中给原型添加原始值或者对象作为成员数据。

:::

```js
class Person  {
    name: 'sans'
}
// Uncaught SyntaxError: Unexpected identifier
```

类也支持获取和设置访问器。语法与行为和普通对象一样。

```js
// 类 获取或设置访问器
class Person {
    set name(newName){
        this.name_ = newName;
    }
    get name(){
        return this.name_;
    }
}
let p = new Person();
p.name = 'sans';
console.log(p.name); // sans
```

### 3.3、静态类方法

该方法常用来执行不特定于实例的操作，也不要求存在类的实例。每个类只有一个。

使用`static`前缀作为关键词，在静态成员中，`this`引用类本身。

```js
class  Person {
    // 定义的this存在于不同的实力上
    constructor() {
        this.locate = ()=> {
            console.log('instance', this);
        }
    }
    // 定义在类的原型上
    locate(){
        console.log('prototype', this);
    }
    // 定义在类本身
    static locate(){
        console.log('class', this);
    }
}
let p = new Person();
p.locate();  // instance, Person {}
Person.prototype.locate(); // prototype {constructor: ...}
Person.locate(); // class class Person{}
```

静态方法非常适合作为实例工厂

### 3.4、非函数成员和类成员 p256

<mark>类定义不支持显示的在原型或类上添加成员数据，但可以再外部添加</mark>

```js
// 在类外部添加成员数据
class Person {
    sayName(){
        console.log(`${Person.greeting} ${this.name}`);
    }
}
//在类上定义成员数据
Person.greeting = 'My name is';
// 在类原型上定义成员数据
Person.prototype.name = 'sans';
let p =  new Person();
console.log(p);
p.sayName(); // My name is sans
```

:::tip
类之所以没有显示的支持添加数据成员，是因为在共享目标（原型和类）上添加可修改数据成员是一种反模式。一般而言，对象实例应独自拥有通过`this`引用的数据

:::

### 3.5、迭代器和生成器方法 p257

```js
// 在类的原型和本身上定义生成器
class Person{
    // 在类原型上定义生成器方法
    *createNicknameIterator(){
        yield 'Jack';
        yield 'Jake';
        yield 'J-Dog'
    }
    // 在类上定义生成器方法
    static *createNicknameIterator(){
        yield 'Butcher';
        yield 'Baker';
        yield 'Sans';
    }
}
let jobIter = Person.createNicknameIterator();
console.log(jobIter.next().value); // Butcher
console.log(jobIter.next().value); // Baker
console.log(jobIter.next().value); // Sans

let p = new Person();
let nicknameIter = p.createNicknameIterator();
console.log(nicknameIter.next().value); // Jack
console.log(nicknameIter.next().value); // Jake 
console.log(nicknameIter.next().value); // J-Dog
```

可以通过添加默认迭代器，将类实例变成可迭代对象

```js
// 将类变成可迭代对象
class Person {
    constructor() {
        this.nicknames = ['Sans','Jack','Ben']
    }
    *[Symbol.iterator](){
        yield  *this.nicknames.entries();
    }
}
let p = new Person();
for(let [idx, nickname] of p){
    console.log(nickname);
}
// Jack
// Jake
// J-Dog 
```

也可只返回迭代器实例

```js
class Person { 
 constructor() { 
 this.nicknames = ['Jack', 'Jake', 'J-Dog']; 
 } 
 [Symbol.iterator]() { 
 return this.nicknames.entries(); 
 } 
} 
let p = new Person(); 
for (let [idx, nickname] of p) { 
 console.log(nickname); 
} 
// Jack 
// Jake 
// J-Dog
```

## 4、继承 p258

:::tip
ECMAScript6 新增了最出色的一项就是**原生支持类继承机制**。虽然类继承使用的是新语法，但是背后的原理依然是原型链。

:::

### 4.1、继承基础 `extends` p258

`ES6`类支持**单继承** 。通过使用`extends`关键词，继承任何拥有[[Constructor]]和原型的对象。同时也能继承**普通**的构造函数

```js
// 类的继承
class Vehicle{};
// 继承类
class Bus extends Vehicle{};
let b = new Bus();
console.log(b instanceof Bus); // true
console.log(b instanceof Vehicle); // true

// 继承普通构造函数
function Person(){}
class Engineer extends Person {};
let e = new Engineer();
console.log(e instanceof Engineer); // true
console.log(e instanceof Person); // true
```

派生类可以通过**原型链**访问到**类和原型**上定义的方法。

```js
// 派生类同时原型链访问实例和方法
class Vehicle{
    identifyPrototype(id){
        console.log(id, this);
    }
    static identifyPrototype(id){
        console.log(id, 'static', this);
    }
}
class Bus extends Vehicle{}

let v = new Vehicle();
let b = new Bus();
b.identifyPrototype('bus'); // bus Bus{}
v.identifyPrototype('vehicle'); // vehicle Vehicle{}

Bus.identifyPrototype('bus');  // bus static Class Bus {}
Vehicle.identifyPrototype('vehicle'); // vehicle static Class Vehicle
```

:::tip
`extends`也可以在类表达式中使用。`let Bar = class extends Foo()`

:::

### 4.2、构造函数、HomeObject和Super() p259

派生类的方法可以通过`super`关键词引用他们的原型。改关键词只在派生类中有效，而且仅限于类构造函数、实例方法和静态方法内部。

在类构造函数内部使用`super`可以调用父类构造函数

```js
// super 调用类的原型
class Vehicle{
    constructor() {
        this.hasEngine = true
    }
}
class Bus extends Vehicle{
    constructor() {
        // 不要在super()之前引用this 否则会抛出 ReferenceError
        super();
        console.log(this instanceof Vehicle); // true
        console.log(this) // Bus {hasEngine: true}
    }
};
new Bus();
```

可以通过`super`调用继承的类上定义的静态方法。

```js
// super 调用继承类上的静态方法
class Vehicle{
    static identify(){
        console.log('vehicle');
    }
}
class Bus extends Vehicle{
    // 如果子类含有静态方法 会覆盖掉继承的父类静态方法
    static identify(){
        super.identify();
    }
}
Bus.identify(); // vehicle
```

:::tip
`ES6`中给**类构造函数**和**类静态方法**添加了**内部特性**`[[HomeObject]]`,该特性是一个**指针**，指向**定义该方法**的**对象**。这个指针是自动赋值的。只能在`JS`引擎中访问。`super`**始终**会定义为`[[HomeObject]]`的原型

:::

使用`super`时要注意的几个问题：

1. `super`只能在派生类构造函数和静态方法中使用。
   
   ```js
   class Vehicle {
       constructor() {
           super();
           //  SyntaxError: 'super' keyword unexpected here
       }
   }
   ```

2. 不能单独引用`super`，要么调用构造函数，要么调用静态方法；
   
   ```js
   class Vehicle{}
   class Bus extends Vehicle{
       constructor() {
           console.log(super);
           //  SyntaxError: 'super' keyword unexpected here
       }
   }
   ```

3. 调用`super()`会调用父类构造函数，并将返回的实例赋值给`this`
   
   ```js
   class Vehicle{}
   class Bus extends Vehicle{
       constructor() { 
           // 此时会将父类返回的值赋值给 this
           super();
           console.log(this); // Bus {}
           console.log(this instanceof Vehicle); // true
       }
   }
   new Bus();
   ```

4. `super()`的行为如同调用构造函数，可以通过手动的方式给父类构造函数传参。
   
   ```js
   // 可以通过super以手动的方式给父类构造函数传参
   class Vehicle{
       constructor(name) {
           this.name = name
       }
   }
   class Bus extends Vehicle{
       constructor(name) {
           super(name);
       }
   }
   
   console.log(new Bus('BMW')); // Bus {name : 'BMW'}
   ```

5. 如果没有定义类构造函数，实例化派生类时会调用`super()`，会传入所有传给派生类的参数。

6. 
