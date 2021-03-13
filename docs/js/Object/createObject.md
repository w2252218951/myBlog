---
title: 创建对象
tags:
- js 
- 对象
categories:
- 笔记
date: 2021-03-08
---

可以根据`Object`构造函数或对象字面量很简单的创建对象，但是存在一定的缺点。

**缺点**：使用同一个接口**创造多个**对象，会产生大量的代码。

# 1、概述 p220

`ECMAScrpit5.1`并没有正式的支持面向对象的结构，比如**类和继承**，但是通过巧妙的运用**原型式继承**可以模仿同样的行为。

`ECMAScript6`开始正式的支持**类和继承**。但是，实际上 `ES6`的类仅仅是封装了`ES5.1`的**构造函数加原型继承**的语法糖。

::: tip

**！！！注意**：**面向对象编程模式**还是应该使用`ES6`的类。 ES6的类定义本身就相当于对原有结构的封装。

:::

# 2、 工厂模式   p221

广泛应用于软件工程领域，用于**抽象创建特定对象**的**过程**。

```js
function createPerson(name , age, job){
    let o = new Object();
    o.name = name;
    o.age = age;
    o.job = jor;
    o.sayName = function(){
        alert(this.name)
    }
    return o
}
let person1 = createPerson('hello',25, 'cxy')
let person2 = createPerson('sans', 22, 'ds')
```

工厂模式解决了多个相识对象问题，但没有解决对象的识别问题（即怎么知道一个对象的类型）

# 3 、构造函数模式     p221

用于创建**特定类型的对象**。

<mark>运行时能**直接在执行环境中使用**的都是原生的构造函数</mark>

```js
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        alert(this.name)
    }
}
// 作为构造函数要通过new 创建实例才能调用
let p1 = new Person('hello', 25, 'cxy')
let p2 = new Person('sans', 22, 'ds')
```

::: tip

构造模式和工厂模式的不同：

1. 没有显式的创建对象

2. 直接将属性和方法赋值给了 this

3. 没有进行return

为了进行区分构造函数始终是以 **大写** 字母开头；因为构造函数本身就是个函数，只不过可以用来创建对象，有助于**区分 构造函数和普通函数**。
:::

::: tip

要创建`Person`新实例，必须使用 **new** 操作符。**注意**：都是被赋值

1. 在内存中创建一个对象；

2. 这个新对象内部的`[[Prototype]]`特性**被**赋值为**构造函数**的`prototype`属性；

3. 构造函数内的`this`**被** 赋值为这个新对象（相当于 `this` 指向是新对象）；

4. 执行构造函数中的代码（为新对象添加属性）

5. 如果构造函数返回非空对象，返回该对象；否则，返回新对象； 

:::

p1和p2都有`constructor(构造函数)`属性，该属性都指向 `Person`

```js
alert(p1.construction == Person) // true
alert(p2.construction == Person) // true
```

对象的`constructor`属性最初是用来**标识对象类型**的。

一般认为使用`instanceof` 检测对象类型更为靠谱。

```js
alert(p1 instanceof Person)  // true
alert(p1 instanceof Object)  // true
alert(p2 instanceof Person)  // true
alert(p2 instanceof Object)  // true
// 可以看出p1 和 p2 既是Obeject的实例 也是 Person的实例
```

定义自定义构造函数能够确保 **实例** 被标识为 **特定类型** 。

赋值给**变量的函数表达式**也可以表示构造函数。

```js
// 函数表达式
let Person = function (name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function (){
        console.log(this.name);
    }
}
let person1 = new Person('sans',22, 'FE');
let person2 = new Person('hw',22, 'BOSS');
person1.sayName(); // sans
person2.sayName()  // hw
console.log(person1 instanceof Object); // true
console.log(person1 instanceof Person); // true
console.log(person2 instanceof Object); // true
console.log(person2 instanceof Person); // true
```

**！！！注意**：在实例化时，**不进行传参时**可以**省略**掉构造函数后面的括号。只要有**new操作符**，就能够**调用**相应的构造函数 

`let person1 = new Person`

### 3.1、构造函数也是函数 p223

<mark>构造函数也是函数</mark>，并没有把某个函数定义为构造函数的特殊语法。**任何函数**只要使用**new**操作符调用**就是构造函数**，而不使用**new**操作符调用的函数就是**普通函数**。<mark>（通过`new` 区分构造函数和普通函数）</mark>

```js
// 区分构造函数
// 通过new操作符实例化的构造函数
let person = new Person('sans', 22, "FE");
person.sayName();  //sans

// 作为函数调用
Person('hw',22,'BOSS');  // 挂在到window下
window.sayName();  // hw

// 在另一个对象的作用域中调用
let o = new Object();
Person.call(o, 'lsn', 23, 'PM');
o.sayName()  // lsn
```

在调用一个函数而**没有明确设置**`this`的情况下（即没有作为对象的方法调用，或者没有使用`call()`/`apply()`调用）,`this`始终指向`Global`对象（浏览器中为`window`对象）

通过`call()和apply()`调用函数，**能够将特定对象指定为作用域**。

### 3.2、构造函数的问题 p223

**问题：** <mark>定义在构造函数上的方法会在每个实例上都创建一遍。</mark>

在`ECMAScript`中的函数就是对象，因此每次定义函数时，都会初始化一个对象。

<mark>`console.log(Function instanceof Object); // true`</mark>

```js
function Person(age,name,job){
    this.name = name;
    this.age = age;
    this.job = job;
    // 逻辑等价
    this.sayName = new Funciton("console.log(this.name)")
}
```

每个实例都有自己的`Function`实例用于显示`name`属性。

以这种方式创建函数会**带来不同的作用域链和标识符解析**，但创建新`Function`实例的机制是一样的。所以不同实例下的函数虽然**同名但是不相等。**

`conslog.log(person1.sayName == person2.sayName) // false`

因为`this`对象可以将**函数与对象的绑定推迟**到运行时，所以可以将函数定义**转移到构造函数外部**。

```js
// 解决每次创建实例时都重新创建一个对象上的方法
function Person(name,age,job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}
function sayName(){
    console.log(this.name);
}
let person1 = new Person('sans',22, 'FE');
let person2 = new Person('hw',22, 'BOSS');
person1.sayName(); // sans
person2.sayName()  // hw
```

此处的构造函数内部的`sayName`属性等于全局的`sayName()`函数。这样虽然**解决了相同逻辑的函数重复定义**的问题，但是全局作用域也以此被搞乱了，因为那个函数实际上只能在一个对象上调用。如果这个对象需要多个方法，那么就要在全局上定义多个函数。这个新的问题可以通过原型模式来解决。

# 4、原型模式 p224

每个函数都会创建一个`prototype`属性(对象)，包含应由特定引用类型实例共享的属性和方法。

**使用原型对象的好处:** 可以在对象实例上共享属性和方法。原来在构造函数中直接<mark>赋值给对象实例</mark>的值，可以<mark>直接赋值给他们的原型。</mark>

```js
function Person(){};
Person.prototype.name = 'sans';
Person.prototype.age = 22;
Person.prototype.sayName = function (){
    console.log(this.name);
}
let person1 = new Person()
console.log(person1); // Person
person1.sayName(); // sans
let person2 = new Person();
person2.sayName() // sans
console.log(person1.sayName === person2.sayName); // true
```

也可以使用函数表达式

```js
let Person = function(){};
Person.prototype.name = 'sans';
Person.prototype.age = 22;
Person.prototype.sayName = function (){
    console.log(this.name);
}
let person1 = new Person()
console.log(person1); // Person
person1.sayName(); // sans
let person2 = new Person();
person2.sayName() // sans
console.log(person1.sayName === person2.sayName); // true
```

<mark>使用原型模式定义的属性和方法都是由所有实例共享的</mark>

## 4.1、理解原型 p225

1、**每个函数创建**时，都会按照**特定的规则：**

<mark>创建**一个`prototype`属性**（指向原型对象）</mark>

2、默认情况下，**所有原型对象**会自动：

<mark>获得**一个 `constructor属性`**，指向与之关联的构造函数</mark>

3、对上述列子而言相当于 `Person.prototype.constructor指向 Person`

4、**自定义构造函数时**，**原型对象**会默认获得`constructor`属性，其他所有方法都继承自`Object`

5、每次调用构造函数创建新实例，实例内部的`[[Prototype]]`指针就会被赋值为**构造函数的原型对象**，脚本中没有访问该特性的方法，但在Safari、Chrome、Firefox中会在每个对象上暴露`__proto__`属性，能通过这个属性访问**对象的原型**

<mark>构造函数本质上就是一个函数</mark>

```js
// 原型
/**
 *构造函数可以是函数表达式或函数声明
 * function Person(){}
 * let Person = function(){}
 */
let Person = function () {
}
/**
 * 构造函数创建后就会有一个与之关联的 prototype属性
 * 指向原型（Object）
 */
console.log(typeof Person.prototype); // Object
console.log(Person.prototype);
// {
//     constructor: ƒ Person()
//     __proto__: Object
// }
/**
 * 该原型对象也有一个constructor 属性，
 * 指向该对象的构造函数
 * 两者循环引用
 */
console.log(Person.prototype.constructor === Person); // true

/**
 * 正常的原型链最终都会终止与 Object的原型对象
 * Object原型的原型是null
 */
/**
 * Person.prototype ===> Person的原型对象
 * 其 __proto__ 属性指向该对象构造函数的原型对象
 * 又因为其实 Object函数创建的实例对象
 * 所以这里是指向 Object的原型对象的
 */
console.log(Person.prototype.__proto__ === Object.prototype); // true
/**
 * Object的原型对象的constructor属性指向的是他的构造函数
 * 因此 这里 指向的就是 Object
 */
console.log(Person.prototype.__proto__.constructor === Object); // true

/**
 * Object原型对象的原型链指向的是 null 都终止与null
 */
console.log(Person.prototype.__proto__.__proto__ === null); // true
console.log(Person.prototype.__proto__);
// {
// constructor: f Object(),
// toString: ...
// hasOwnProperty: ...
// isPrototypeOf: ...
// ...
// }

let person1 = new Person(),
    person2 = new Person();
/**
 * 构造函数、原型对象和实例
 * 是 3 个完全不同的对象：
 */
console.log(person1 !== Person); // true
console.log(person1 !== Person.prototype); // true
console.log(Person.prototype !== Person); // tru

/**
 * 实例能通过 __proto__链接到原型对象
 * 实际上指向的是隐藏特性 [[Prototype]]
 *
 * 构造函数能通过prototype属性直接链接原型对象
 * 所以实例与构造函数并没有直接联系，与原型对象有直接联系
 * */
// person1的__proto__指向其构造函数的原型对象
console.log(person1.__proto__ === Person.prototype); // true
// 其构造函数的原型对象的构造函数就是 Person
console.log(person1.__proto__.constructor === Person); // ture

/**
 * 通过同一个构造函数创建的两个实例
 * 共享一个原型对象
 */
console.log(person1.__proto__ === person2.__proto__); // true

/**
 * 通过 instanceof检测实例是否在 原型链上
 */
console.log(person1 instanceof Person);
console.log(person1 instanceof Object);
// Object函数是 Function函数的实例
console.log(Object instanceof Function);
console.log(Function instanceof Object);
```

![](C:\Users\14997\AppData\Roaming\marktext\images\2021-02-25-17-22-12-image.png)

`isPrototypeOf()`会在传入参数的`[[Prototype]]`指向调用它的对象是返回`true`

```js
// person1的 __proto__ 指向的是 Person的原型对象
console.log(Person.prototype.isPrototypeOf(person1)); // true
console.log(Person.prototype.isPrototypeOf(person2)); // true
```

通过`Object.getPrototypeOf()`,可以返回实例的内部特性`[[Prototype]]`的值

`Object.getPrototypeOf`返回的对象是传入参数的原型对象。用来**获取对象**的**原型对象**

```js
// 通过Object.getPrototypeOf() 获取对象的原型对象
console.log(Object.getPrototypeOf(person1) === Person.prototype); // true;
// 返回的是原型对象上的 属性
console.log(Object.getPrototypeOf(person1).name);
```

通过`Object.setPrototypeOf()`方法，向**实例的私有特性**`[[Prototype]]`，写入一个新值。<mark>可以重写对象的原型继承关系。</mark>

```js
// 通过Object.setPrototypeOf()向实例的私有特性[[Prototype]]传值
// 重写一个对象的原型继承关系
let biped = {
    num: 2
};
let person = {
    name: 'sans'
}
Object.setPrototypeOf(person, biped)
console.log(person.name); // sans
console.log(person.num);  // 2
console.log(Object.getPrototypeOf(person)); // Object
console.log(Object.getPrototypeOf(person) === biped); // true
```

**注意！！！** `Object.setPrototypeOf()`方法<mark>严重影响性能</mark>。并且**Mozilla文档**介绍：在浏览器和JS引擎中，**修改继承关系**的**影响**都是**很微妙且深远的**。这种情况并不是执行了`Object.setPrototypeOf()`语句那么简单，而是会涉及所有访问了那些修改过[[Prototype]]的对象的代码。

使用`Object.create()`可以避免`Object.setPrototypeOf()`造成的性能下降。该方法能创建**一个新对象**，并且指定**其原型。**

```js
// Object.create() 创建一个新对象，并指定原型
let biped = {
    num: 2
}
let person = Object.create(biped);
person.name = 'sans';
console.log(person.name); // sans
console.log(person.num);  // 2  
console.log(person);
// {
//     name: 'sans';
//     __proto__: {
//         num : 2
//     }
// }
// 此时 biped相当于 person的原型对象
console.log(Object.getPrototypeOf(person)); // { num : 2 }
console.log(Object.getPrototypeOf(person) === biped); // true
```

## 4.2、原型层级 p228

对象访问属性时，**首先会在实例**上查找是否存在该属性，如果存在就返回对应的值，如果不存在，就沿着指针**进入原型对象**，然后在原型对象上返回相对应的值。

这就是原型用于在多个实例对象间共享属性和方法的原理。

<mark>`constructor`属性只存在于原型对象，因此实例对象也可以访问。</mark>

只要给实例对象添加一个属性，这个属性就会 **遮蔽** 原型对象上的同名属性，虽然不会修改它，但是会屏蔽对它的访问。

```js
// 属性的遮蔽
function Person() {
};
Person.prototype.name = 'sans';
Person.prototype.age = 22;
Person.prototype.asyName = function () {
    console.log(this.name);
};
let person1 = new Person();
let person2 = new Person();
person1.name = null;
// 原型对象上的属性被实例属性遮蔽
console.log(person1.name); // null
// 实力上没有改属性值，通过指针向上访问到 原型对象
console.log(person2.name); // sans
```

通过`delete`操作符**删除实例对象**上的属性，可以让**标识符解析过程**能够**继续**搜索原型对象。

`hasOwnProperty()`用于确定某个属性是在对象上还是在实例上。该方法继承自`Object`,会在属性存在于调用它的**对象实例**上返回`true`.

```js
// 判断属性是否存在于 实例对象上
function Person() {
};
Person.prototype.name = 'sans';
Person.prototype.age = 22;
Person.prototype.asyName = function () {
    console.log(this.name);
};
let person1 = new Person();
let person2 = new Person();
console.log(person1.hasOwnProperty('name')); // false

person1.name = 'hw';
console.log(person1.name); // hw  来自实例
console.log(person1.hasOwnProperty('name')); // true

console.log(person2.name); // sans 来自原型
console.log(person2.hasOwnProperty('name')); // false

delete person1.name
console.log(person1.name); // sans  来自原型
console.log(person1.hasOwnProperty('name')); // false
```

![](C:\Users\14997\AppData\Roaming\marktext\images\2021-03-01-20-31-39-image.png)

`ECMAScript的 Object.getOwnPropertyDescriptor()`**只对实例属性**有效，要取得原型属性的描述符，就**必须**在**原型对象**上调用`Object.getOwnPropertyDescriptor()`

## 4.3、原型和in方法 p231

在对象中有**两种方式**使用操作符：单独使用和在`for-in`中循环使用。                                         

单独使用`in`会在通过对象访问其指定属性时返回`true`,无论是在实例对象还是在原型对象上。

```js
// 通过in操作符判断属性是否在对象上
function Person() {
};
Person.prototype.name = 'sans';
Person.prototype.age = 22;
Person.prototype.asyName = function () {
    console.log(this.name);
};
let person1 = new Person();
let person2 = new Person();

console.log(person1.hasOwnProperty('name')); // false
console.log('name' in person1);  // true

person1.name = 'hw';
console.log(person1.name); // hw  来自实例
console.log(person1.hasOwnProperty('name')); // true
console.log('name' in person1);  // true

console.log(person2.name); // sans 来自原型
console.log(person2.hasOwnProperty('name')); // false
console.log('name' in person1);  // true

delete person1.name
console.log(person1.name); // sans  来自原型
console.log(person1.hasOwnProperty('name')); // false
console.log('name' in person1);  // true
```

<mark>判断属性是否存在原型上，可以通过`Object.hasOwnProperty()和in操作符`</mark>

```js
// 判断对象是否在原型上
function hasPrototypeProperty(Object, name)
{          // 判断属性是否在实例对象上
    return !Object.hasOwnProperty(name) && (name in Object)
}
function Person() {
};
Person.prototype.name = 'sans';
Person.prototype.age = 22;
Person.prototype.asyName = function () {
    console.log(this.name);
};
let person = new Person();
console.log(hasPrototypeProperty(person, 'name')); // true

person.name = 'hw';
console.log(hasPrototypeProperty(person, 'name')); // false
```

在`for-in循环中使用in操作符`，可以**通过对象**访**问被枚举**的属性。包括**实例属性**和**原型属性**

因为**默认情况**下开发者定义的属性都是**可枚举的**，因此遮蔽原型中不可枚举的（`[Enumerable]特性被设置为false`）属性的实例属性也会被返回。

通过`Object.keys()` 可以获得所有**可枚举**的**实例属性**。返回传入对象的**所有可枚举属性**的**字符串数组。**

```js
// 枚举属性
function Person() {
};
Person.prototype.name = 'sans';
Person.prototype.age = 22;
Person.prototype.asyName = function () {
    console.log(this.name);
};
for (let i in Person.prototype) {
    console.log(i);
}

// let keys = Object.keys(Person);
// console.log(keys); // []

let keys = Object.keys(Person.prototype);
console.log(keys);  // ['name', 'age', 'asyName']

let p1 = new Person();
p1.name = 'sans';
p1.age = 22;

let p1keys = Object.keys(p1);
console.log(p1keys); //["name", "age"]
```

通过`Object.getOwnPropertyName()` 方法，同时获取**不可枚举**的**实例属性**。

```js
//同时获取不可枚举的实例属性通过 Object.getOwnPropertyNames()
let key1s = Object.getOwnPropertyNames(Person.prototype);
console.log(key1s); // ["constructor", "name", "age", "asyName"]
```

以**符号为键**的属性名是**没有名称的概念**的，因此在`ES6`中**新增**了`Object.getOwnPropertySymbols()`方法，此方法**只针对符号**。

```js
// 获取符号键名 Object.getOwnPropertySymbols()
let k1 = Symbol('k1'),
    k2 = Symbol('k2');
let o = {
    [k1]: 'k1',
    [k2]: 'k2',
}
console.log(Object.getOwnPropertySymbols(o));  //[Symbol(k1), Symbol(k2)]
```

## 4.4、属性枚举顺序

`for-in循环和Object.keys()`的**枚举顺序**是**不确定**的，**取决于JS引擎**，因浏览器而异

`Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()和Object.assign()`的枚举顺序都是**确定性**的。先以**升序枚举数值键**，然后以**插入顺序**枚举字符创和符号键。

```js
// 属性枚举顺序
let k1 = Symbol('k1'),
    k2 = Symbol('k2')
let o = {
    1:1,
    first: 'first',
    [k1]: 'sym2',
    second: 'second',
    0: 0
}

o[k2] = 'sym2';
o[3] = 3;
o.third = 'third';
o[2] = 2;
console.log(Object.getOwnPropertyNames(o));
// 按顺序排列 ["0", "1", "2", "3", "first", "second", "third"]
console.log(Object.getOwnPropertySymbols(o));
// 按顺序排列 [Symbol(k1), Symbol(k2)]
```

### 5、对象迭代 p233

`ECMAScript2017`新增了两个方法将**对象**内容**转换**为**序列化**-**可迭代**的格式

<mark>`Object.values()`返回对象值得数组。</mark>

<mark>`Object.entries()`返回对象的键/值对的数组</mark>

```js
const o = {
    foo: 'bar',
    baz: 1,
    qux: {}
}
console.log(Object.values(o));
// ["bar" , 1, {}]
console.log(Object.entries(o));
// 0: (2) ["foo", "bar"]
// 1: (2) ["baz", 1]
// 2: (2) ["qux", {…}]
```

非字符串属性会被转换成字符串进行输出。这两个方式是执行对象的浅复制。

```js
const o = {
    qux: {},
    1: 23123
}
// 枚举顺序不确定
console.log(Object.values(o));
// [ 23123  {} ]
console.log(Object.values(o)[1] === o.qux);  // true
// 将属性也就是键 转换为字符串
console.log(Object.entries(o));
// [ ['1', 23123], ['qux' : {}]
```

<mark>符号属性会被忽略</mark>

```js
const sym = Symbol();
const 0 = {
    [sym]: 'foo'
}
console.log(Object.values(0))
// []
console.log(Object.entries((0));
// []
```

## 5.1、其他原型方法 p234

为**减少**代码**冗余**，可以通过**对象字面量**来**重写原型**

一般在创建函数时，会创建`prototype`对象，同时会自动给这个原型的`constructor`属性赋值。但是**原型对象字面量**，会重写默认的`prototype`对象，其`constructor`属性也会指向**新对象**（`Object构造函数`），不再指向原来的构造函数。   

要想**解决上述问题**可以通过**手动**给**设置**一个`constructor`属性**指向**到相应对象，但是该方法会创建一个`[[Enumerable]]`为`true`的特性。而原生的`constructor`默认是不可以进行枚举的。因此在兼容`ECMAscript`的`JS`引擎中可以通过`Object.defineProperty()`来定义`constructor`属性。

```js
// 通过给constructor属性赋值达到恢复其指向相对应对象的功能
function Person() {
}

Person.prototype = {
    name: 'sans',
    age: 22,
    job: 'FE',
    sayName() {
        console.log(this.name);
    }
}
// 恢复constructor属性
Object.defineProperty(Person.prototype, 'constructor', {
    enumerable: false,
    value: Person
})
```

## 5.2、原型的动态性  p236

因为在原型上搜索值的过程是**动态**的，所以即使实例在**原型修改之前**已经存在，**任何时候**对原型对象的**更改**也能**在实例上**反映出来。

实例与原型的关系是**松散的**，并且实例和原型的**链接**是**简单的指针**，而**不是**保存的**副本**。因此，当要查找的属性**不存在**于**自身**时，就会通过指针在原型上查找。

```js
// 该方法并没有将原型重写
let friend = new Person();
Person.prototype.sayHi = function (){
    console.log('hi');
}
friend.sayHi() // hi
```

实例的`[[Prototype]]`指针在**调用构造函数**时会**自动赋值**，这个指针即使把**原型**修改为**不同的**对象也**不会变**（指向最初的原型）。

<mark>重写整个原型会**切断原型**与**构造函数**之间**的联系**，但实例引用的还是**最初**的原型。</mark>

<mark>实例只有指向原型的指针，没有指向构造函数的指针。</mark>

```js
function Person() {}
let friend = new Person();
Person.prototype = {
    constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    sayName() {
        console.log(this.name);
    }
};
friend.sayName()  // 错误

console.log(Object.getOwnPropertyDescriptor(Person.prototype, 'constructor'));
// configurable: true
// enumerable: true
// value: ƒ Person()
// writable: true
Object.defineProperty(Person.prototype,'constructor',{
    enumerable: false,
    value: Person
})
// 指向的是最初的原型
friend.sayName()  // 错误
```

<img title="" src="file:///C:/Users/14997/AppData/Roaming/marktext/images/2021-03-13-17-00-13-image.png" alt="" data-align="center">

**重写构造函数**上的**原型** **之后**创建的**实例**会**引用新的**原型。而**之前**创建的实例会**引用最初**的原型。

## 5.3、原生对象原型 p237

原型的重要性，不仅体现在其**自定义类型**上，<mark> 而且它还是实现所有**原生引用类型**的模式。</mark>

<mark>所有**原生引用类型**的**构造函数** （`String,Array,Object等`）都在原型上定义了实例方法</mark>

```js
// 原生引用类型构造函数的原型方法
console.log(typeof Array.prototype.sort);  // 'function'
console.log(typeof String.prototype.toString); // 'function'
```

可以像修改自定义对象原型一样修改原生对象原型。

```js
String.prototype.startsWith = function (text){
    return this.indexOf(text) === 0;
}
let msg = "Hello world!";
console.log(msg.startsWith('Hello')); // true
```

::: tip

**!!!注意** **不推荐**在**产品环境中**修改原生对象原型。可能会应发命名冲突。另外可能意外重写原生的方法。推荐： 创建一个自定义的类，**继承原生类型**。

:::

## 5.4、原型存在的问题 p237

原型**弱化**了向构造函数**传递参数**的能力，会导致所有**实例**默认获得**相同**的值。

<mark>最主要问题来自共享特性</mark>,可以再实例添加同名属性**遮蔽**原型上的属性

```js
// 原型存在的问题
function Person (){
}
Person.prototype = {
    // 指定构造函数
    constructor: Person,
    name: 'sans',
    age: 22,
    job: 'FE',
    friends: ['Jack','Lily']
}
let person1 = new Person();
let person2 = new Person();
// 这里的friends是存在于 Person的原型对象上的
person1.friends.push('Sam')
console.log(person1.friends); // ['Jack','Lily', 'Sam]
console.log(person2.friends); // ['Jack','Lily', 'Sam]
console.log(person1.friends === person2.friends); // true
```

一般来说，不同实例应该有属于自己的属性副本。这就是开发中不使用原型模式的原因。
