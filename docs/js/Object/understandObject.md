---
title: 理解对象
tags:
- js
- 对象
categories:
- 笔记
date: 2021-02-26
---

创建自定义对象的通常的方法是`Object`的一个新实例，然后再给它添加属性和方法。

## 1、属性的类型 p207

规范通过两个 **中括号**将内部特性标识出来。例如: [[Enumerable]]

属性分为：**数据属性** 、**访问器属性**

### 1.1、数据属性

- [[Configurable]]：表示是否可以通过`delete`进行删除并重定义、是否可以修改他的默认属性，以及是否可以将它改变成访问器属性。默认情况下，直接定义在对象上的属性的这个特性为 `true`

- [[Enumerable]]：表示是否可以通过`for-in`进行循环返回。默认直接定义在对象上的属性，该特性都是为`true`

- [[Writable]]：表示属性的值是否可以被修改。默认同上都为`true`

- [[Value]]：表示属性实际的值。默认为`undefined`

**修改属性的默认特性—`Object.defineProperty()`**

接收三个参数：要添加属性的对象，属性的名称和描述对象（其属性和相关特性一一对应）

```js
let person = {};
Object.defineProperty(person, 'name', {
    writable: false,
    value: 'sans'
})
console.log(person.name); // sans
person.name = 'HW';
console.log(person.name); // sans
```

在非严格模式下上述修改操作会被忽略，在**严格模式**下修改只读属性的值会**报错**。

创建不可配置的属性：

```js
let person = {};
Object.defineProperty(person, 'name', {
    configurable: false,
    value: 'sans'
})
console.log(person.name); // sans
delete person.name
console.log(person.name); // sans
```

非严格模式下没有效果，**严格模式下**抛出错误。 同时： **一旦一个属性别被定义为不可配置后，就不能再变回可配置了。** 通过`Object.defineProperty()`修改任何非`writable`属性都会报错。

::: tip

！！！在调用`Object.defineProperty()`时，前三大特性都默认为 `false`。
:::

### 1.2、访问器属性

不包含数据值。包含一个获取`getter`函数和一个设置`setter`函数，都是非必须的。

访问器属性的四个特性：

- [[Configurable]]：表示是否可以通过`delete`进行删除并重定义、是否可以修改他的默认属性，以及是否可以将它改变成数据属性。默认情况下，直接定义在对象上的属性的这个特性为 `true`

- [[Enumerable]]：表示是否可以通过`for-in`进行循环返回。默认直接定义在对象上的属性，该特性都是为`true`。

- [[Get]]：获取函数，在读取属性时调用，默认为`undefined`

- [[Set]]：设置函数，在写入属性时调用，默认为`unfettered`

::: tip

！！！注意：访问器属性是不能够直接定义的，必须使用`Object.defineProperty()`

:::

<mark>**使用场景：** 通过设置一个属性值导致其他值发生变化。</mark>

```js
let book = {
    year_: 2020,
    editor: 1
};
Object.defineProperty(book, 'year', {
    set(val) {
        if (val > 2020) {
            this.year_ = val;
            this.editor += val - 2020;
        }
    },
    get() {
        // 此处 this 指向的是对象本身
        return this.year_
    }
})
book.year = 2021;
console.log(book);
```

![](C:\Users\14997\AppData\Roaming\marktext\images\2021-02-12-21-53-04-image.png)

::: tip

只定义获取函数意味着属性是**只读**的，设置属性会被忽略。在**严格模式下**会只定义获取函数会抛出错误。

:::

::: warning

不支持`Object.defineProperty()`的浏览器中没有办法修改[[Configurable]]和[[Enumeralbe]]。并且，在ECMA5以前通过`_defineGetter_()和_defineSetter_()`
创建访问器属性

:::

## 2、定义多个属性 p208

`Object.defineProperties()`能通过多个描述符一次性定义多个属性。

接收两个参数：添加或要修改属性的对象、描述对象（其属性要和添加或修改的属性一一对应）

```js
let book = {};
Object.defineProperties(book, {
    year_: {
        value: 2020
    },
    editor: {
        value: 1,
    },
    year: {
        set(val) {
            if (val > 2020) {
                this.year_ = val;
                this.editor += val - 2020;
            }
        },
        get() {
            return this.year_
        }
    }
})
book.year = 2022
console.log(book);
```

上述`year_和editor`的`[[writable]]`特性**都为false**， 因此不能够进行修改。

![](C:\Users\14997\AppData\Roaming\marktext\images\2021-02-12-22-17-06-image.png)

## 3、 读取属性的特性 p209

通过`Object.getOwnPropertyDescriptor()`可获得指定属性的属性描述符。

接收两个参数：属性所在的对象和要取得描述符的属性名，返回一个对象。

```js
let descriptorYear = Object.getOwnPropertyDescriptor(book, 'year')
console.log(descriptorYear);
```

![](C:\Users\14997\AppData\Roaming\marktext\images\2021-02-13-10-00-58-image.png)

```js
let descriptorYear_ = Object.getOwnPropertyDescriptor(book, 'year_')
console.log(descriptorYear_);
```

![](C:\Users\14997\AppData\Roaming\marktext\images\2021-02-13-10-01-28-image.png)

在`ECMAScript2017`新增了`Object.getOwnPropertyDescriptors()`静态方法。实际上是在每个自由属性上调用了`Object.getOwnPropertyDescriptor()`并在新对象中返回。

```js
let book = {};
Object.defineProperties(book, {
    year_: {
        value: 2017
    },
    edition: {
        value: 1
    },
    year: {
        get: function () {
            return this.year_;
        },
        set: function (newValue) {
            if (newValue > 2017) {
                this.year_ = newValue;
                this.edition += newValue - 2017;
            }
        }
    }
});
console.log(Object.getOwnPropertyDescriptors(book));
// {
// edition: {
// configurable: false,
// enumerable: false,
// value: 1,
// writable: false
// },
// year: {
// configurable: false,
// enumerable: false,
// get: f(),
// set: f(newValue),
// },
// year_: {
// configurable: false,
// enumerable: false,
// value: 2017,
// writable: false
// }
// } 
```

## 4、合并对象

`ECMAScript6`提供了`Object.assign()`作为对象的合并方法。这个方法接收一个目标对象和多个源对象作为参数。

只能将源对象中可枚举`Object.propertyIsEnumerable()返回为true`和自有`Object.hasOwnproperty()返回true`的属性复制到目标对象。

过程：复制以**字符串**和**符号**为键的属性。通过源对象上的`[[Get]]`取得属性的值，然后使用目标对象上的`[[Set]]`设置属性的值。

```js
/**
 * 获取函数和设置函数
 */
dest = {
    // 一一对应时就会通过这个属性操作方法
    // 因为这的设置函数是并未执行赋值操作
    // 所以没发生改变
    set a(val) {
        console.log(`Invoked dest setter with param ${val}`);
        return val
    },
}
src = {
    get a() {
        console.log('Invoked src getter');
        return 'foo';
    }
}
// 在获取时调用src中的get方法  赋值是调用 dest中的 set 方法
Object.assign(dest, src);
console.log(dest);
```

`Object.assign()`对源对象执行的是浅复制。

不能够在两个对象间**转移获取函数和设置函数**

```js
let dest, src, result;
/**
 * 覆盖属性
 */
dest = {id: 'dest'};
result = Object.assign(dest, {id: 'src1', a: 'foo'}, {id: 'src2', b: 'bar'});
// Object.assign 会覆盖重复的属性
console.log(result); // { id: src2, a: foo, b: bar }
// 可以通过目标对象上的设置函数观察到覆盖的过程：
dest = {
    set id(x) {
        console.log(x);
    }
};
Object.assign(dest, {id: 'first'}, {id: 'second'}, {id: 'third'});
// first
// second
// third
/**
 * 对象引用
 */
dest = {};
src = {a: {}};
Object.assign(dest, src);
// 浅复制意味着只会复制对象的引用
console.log(dest); // { a :{} }
console.log(dest.a === src.a); // true 
```

在赋值出现错误的时候，会中止并退出。`Object.assign()`并没有回滚功能，只能尽力而为，只会完成报错前的赋值。

```js
let dest, src, result;
/**
 * 错误处理
 */
dest = {};
src = {
    a: 'foo',
    get b() {
        // Object.assign()在调用这个获取函数时会抛出错误
        throw new Error();
    },
    c: 'bar'
};
try {
    Object.assign(dest, src);
} catch (e) {
}
// Object.assign()没办法回滚已经完成的修改
// 因此在抛出错误之前，目标对象上已经完成的修改会继续存在：
console.log(dest); // { a: foo }
```

## 5、对象标识及相等判定

`console.log({} === {}) // false`

```js
// 在不同的JS引擎中表现不同，但被认为是相等的
console.log(+0 === -0);    // true
console.log(+0 === 0);    // true
console.log(-0 === 0);    // true

//因为 NaN 实际上是不等于 NaN的 所以要确定其是否相等，需要使用isNaN()
console.log(NaN === NaN);  // false
console.log(isNaN(NaN));   // true
```

在`ECMAScript6` 中新增了 `Object.is()`,这个方法与 === 相似，这个方法必须接受两个参数；

```js
// Object.is()
console.log(Object.is(true, 1));  // false
console.log(Object.is({}, {}));   // false
console.log(Object.is('2', 2));   // false

// 正确的判断 0、 -0、 +0是否相等
console.log(Object.is(+0, -0));  // false
console.log(Object.is(+0, 0));   // true
console.log(Object.is(-0, 0));   // false

// 唯一能判断NaN 与 NaN 相等的方法
console.log(Object.is(NaN, NaN));  // true

// 要检查超过两个值，通过递归利用相等性传递
function checkEqual(x, ...rest) {
    console.log(x); // 1
    console.log(rest);  // [2, 3, 4, 5]
    console.log(...rest);  // 2 3 4 5
}

let arr = [1, 2, 3, 4, 5];
checkEqual(...arr);

function recursivelyCheckEqual(x, ...rest) {
    return Object.is(x, rest[0]) &&
        (rest.length < 0 || recursivelyCheckEqual(...rest))
}
```

## 6、增强的对象语法

### 6.1、属性值的简写

```js
let name = 'sans';
let person = {
    name: name
}
console.log(person)  // { name : 'sans'}
```

简写属性，只要使用变量名就能够自动被解释为**同名的属性键**， 如果没有找到同名的变量就会直接抛出`ReferenceError`

和上面代码等价：

```js
let name = 'sans';
let person = {
    name
}
consloe.log(person)  // {name : 'sans'}
```

代码会在不同作用域间保留属性名，以防止找不到引用。

```js
function makePerson(name) {
    return {
        name
    }
}

let person = makePerson(name);
console.log(person.name)  // sans 
```

### 6.2、可计算属性

引入可计算属性之前，不能够直接在对象字面量中直接动态命名参数。

```js
// 引入可计算属性之前
const nameKey = 'name';
let person = {};
person[nameKey] = 'sans';
console.log(person); // {name : 'sans'}   

// 引入可计算属性之后; 
// const nameKey = 'name';
let person1 = {
    [nameKey]: 'sans'
}
console.log(person1); // {name : 'sans'}
```

计算属性本身可以是复杂的表达式，所以可以在实例化时再求值

```js
const nameKey = 'name';
const ageKey = 'age';
let uniqueToken = 0;

function getUniqueKey(key) {
    return `${key}_${uniqueToken++}`
}

let person = {
    [getUniqueKey(nameKey)]: 'sans',
    [getUniqueKey(ageKey)]: 22
}
console.log(person);  // {name_0 : 'sans', age_1: 22}
```

计算属性任何抛出错误都会中断对象的创建，并且不能够进行回滚。

### 6.3、简写方法名

```js
let person = {
    function sayName(name)
{
    console.log(name)
}
}
person.sayName('sans') // sans
// 可以简写为
let person = {
    sayName(name) {
        console.log(name)
    }
};
person.sayName('sans1') // sans1
```

简写方法同样适用于 **设置函数** 和 **获取函数**

```js
// 简写获取函数 和 设置函数
let person = {
    name_: '',
    get name() {
        return this.name_
    },
    set name(name) {
        console.log(1111);
        this.name_ = name;
    },
    sayName() {
        console.log(this.name_);
    }
}
person.name = 'sans'
person.sayName(); // sans
```

简写方法名也可与计算属性键兼容

```js
const methodKey = 'sayName';
let person = {
    [methodKey](name) {
        console.log(name);
    }
}
person.sayName('sans'); // sans
```

### 6.4、对象解构 p216

`ECMAScript`**新增**了对象解构语法。简单来说就是使用与**对象匹配的结构**来实行对象属性赋值。

```js
// 使用对象结构前
let person = {
    name: 'sans',
    age: 22
}
// let personName = person.name,
//     personAge = person.age;
// console.log(personName);  // sans
// console.log(personAge);   // 22

// 使用对象解构
let {name: personName, age: personAge} = person
console.log(personName);
console.log(personAge);
```

在使用结构时，可以使用简写

```js
let person = {
    name: 'sans',
    age: 22
}
// 结构赋值时定义默认值
// 适用于引用的属性不存在源对象
let {name, age, level = 'NB'} = person;
console.log(name);  // sans
// 如果赋值的时候引用的属性不在，则该变量值为undefined
console.log(job);   // undefined
console.log(level); // 'NB'
```

::: tip

在使用解构时，其实使用`ToObject() 该方法不能在运行时环境直接访问`把源数据转换为对象。
也就意味着，`null`和`undefined`**不能够被结构**，会抛出错误。

:::

```js
let {length} = 'sans'
// 相当于 { length: length} = 'sans' 将字符串的长度进行赋值
console.log(length); // 4
// 数字的构造函数是 Number()
let {constructor: c} = 4,
    num = 4;
console.log(num.constructor); // Number()
console.log(c); // Number()
console.log(c === Number); // true

// let { _ } = null;   // TypeError
// let { _ } = undefined;  // TypeError
let {length: _} = 'sans';
console.log(_); // 4
```

<mark>如果要给事先声明的变量进行赋值，则赋值表达式必须包含在一对括号中。</mark>

```js
let personName, personAge;
let person = {
    name: 'sans',
    age: 22
};
({name: personName, age: personAge} = person);
console.log(personName, personAge); // sans 22
```

#### 6.4.1、嵌套解构

```js
// 嵌套解构
let person = {
    name: 'sans',
    age: 22,
    job: {
        title: 'FE'
    }
}
let personCopy = {};
({
    name: personCopy.name,
    age: personCopy.age,
    job: personCopy.job
} = person)
// 因为是将对象引用赋值给 personCopy
// 所以修改person.job也会改变 personCopy的值
person.job.title = 'Hacker';
person.name = 'HW'
console.log(person);
// { name: 'HW', age: 22, job: { title: 'Hacker' } }
console.log(personCopy);
// { name: 'sans', age: 22, job: { title: 'Hacker' } }
```

可以使用嵌套解构用以匹配嵌套的属性 **（嵌套解构赋值）**：

```js
// 嵌套解构赋值
let person = {
    name: 'sans',
    age: 22,
    job: {
        title: 'FE'
    }
}
let {job: {title}} = person
// 相当于将 job.title 直接赋值给了 title
console.log(title); // FE
```

在外层属性没有定义的情况下是不能使用嵌套解构的，无论是源对象还是目标对象都是一样的。

```js
// 不能执行嵌套解构的情况
let person = {
    job: {
        title: 'FE'
    }
}
let personCopy = {
    job: {}
};
// foo 在源对象上时 undefined
/*({
    foo: {
        bar: personCopy.bar
    }
} = person);*/
// Uncaught TypeError: Cannot read property 'bar' of undefined

// job在目标对象上是 undefined
({
    job: {
        title: personCopy.job.title
    }
} = person);
// 不存在时 TypeError: Cannot set property 'title' of undefined
// 当 job 存在目标对象上
console.log(personCopy);
// {job: {title: 'FE'}}
```

#### 6.4.2、部分解构

涉及多个属性解构时，开始的赋值成功而后面的错误，则整个解构赋值只会完成一部分。

#### 6.4.3、参数上下文匹配

函数列表中的对参数的结构赋值不会影响`arguments`对象，但可以在函数签名中声明在函数体内使用局部变量。

```js
let person = {
    name: 'sans',
    age: 22
}

function printPerson(foo, {name, age}, bar) {
    console.log(arguments);
    console.log(name, age);
}

function printPerson2(foo, {name: personName, age: personAge}, bar) {
    console.log(arguments);
    console.log(personName, personAge);
}

printPerson('1st', person, '2nd');
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27
printPerson2('1st', person, '2nd');
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27
```
