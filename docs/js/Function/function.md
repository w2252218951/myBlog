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

:::tip

`ECMAScript`中所有**参数的传递**都是**按值传递**的，**不能**按**引用**传递参数。如果将对象作为参数传递，那么传递的就是这个参数的引用。

:::

## 4、没有重载

**什么是重载？**

一个函数可以有两个定义，只要签名（接受参数的类型和数量）不同就行。

`ECMAScript`中是**没有重载**这个概念的，因为**参数**是**由零个或多个值**得**数组**表示的。**没有函数签名**，自然没有重载。

:::tip

1. 如果在`ECMAScript`中定义两个同名的函数，则后定义的会覆盖先定义的；

2. 可以通过**检查参数的类型和数量**，然后分别**执行不同的逻辑**来**模拟**函数重载；

3. 将函数名当做指针有助于理解为什么`ECMAScript`没有函数重载，因为其会被后定义的覆盖

:::

## 5、默认参数值

在`ECMAScript5.1`以前，怎样实现默认参数的？

答：通过检查某个参数是否等于`undefined`,如果是则意味着没有传递参数。

```js
// ECMA5.1之前设置默认参数
function making(name){
    name = (typeof name !== 'undefined') ? name : 'Henry'
    return `King ${name} VIII`
}
console.log(making());   //  King Henry VIII
console.log(making('Louis')); // King Louis VIII
```

在`ES6`中，只要在函数定义中的参数后面用 `=`就可以为参数赋一个默认值

```js
// 使用 =  设置默认参数
function making(name = 'Henry') {
    return `King ${name} VIII`
}
console.log(making('Louis'));   //  King Louis VIII
console.log(making()); //  King Henry VIII
```

在使用默认参数时，`arguments`对象的值始终以传入的值为准。

<mark>默认参数值并不限于原始值或对象类型，也可以使用调用函数返回的值</mark>

```js
//将函数设置成默认参数
let romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
let ordinality = 0;

function getNumerals(){
    // 每次调用后递增
    return romanNumerals[ordinality++]
}

function making(name = 'Henry', numerals = getNumerals()){
    return `King ${name} ${numerals}`
}

console.log(making());   // 'King Henry I'
console.log(making('Louis', 'XVI')); // 'King Louis XVI'
console.log(making());  // 'King Henry II'
console.log(making());  // 'King Henry III''King Henry III'
```

### 默认参数和作用域和暂时性死区

<mark>参数初始化顺序遵循“暂时性死区”规则。前面定义的参数不能引用后面定义的，会抛错</mark>

```js
    // 调用时不传第一个参数汇报材料
    function making(name = numerals, numerals = 'VIII'){
        return `King ${name} ${numerals}`
    }
    making()  //  Cannot access 'numerals' before initialization
```

```js
function making(name = 'Henry', numerals = defaultNumeral) {
    let defaultNumeral = 'VII'
    return `King ${name} ${numerals}`;
}
```

## 6、参数扩展与收集

`ECMAScript6`中新增了扩展操作符。其最有用的作用场景就是**函数定义中的参数列表**

扩展操作符既可以用于**调用函数时传参**，也可以用于**定义函数参数**。

### 6.1、扩展参数

```js
let values = [1, 2, 3, 4];
function getSum() {
    console.log(arguments);
    let sum = 0;
    for (let i = 0; i < arguments.length; ++i) {
        sum += arguments[i];
    }
    return sum;
}
console.log(getSum(values)); // 01,2,3,4
// arguments [[1,2,3,4]]
console.log(getSum.apply(null, values)); // 10
// arguments [1,2,3,4]


```

通过可迭代对象的扩展操作符，可将迭代对象作为一个参数进行拆分，并将迭代返回的每个值单独传入。

```js
console.log(getSum(...values)); // 10 
console.log(getSum(-1, ...values)); // 9 
console.log(getSum(...values, 5)); // 15 
console.log(getSum(-1, ...values, 5)); // 14 
console.log(getSum(...values, ...[5,6,7])); // 28 
```

在普通函数和箭头函数中也可将扩展操作符用于命名参数，同时也能使用命名参数。

```js
// 在普通函数和箭头函数中使用扩展操作符命令参数，同时可以设置默认参数
function getProduct(a, b, c = 1) {        
  return a * b * c;
}

let getSum = (a, b, c = 0) => {
  return a + b + c;
};
console.log(getProduct(...[1, 2])); // 2
console.log(getProduct(...[1, 2, 3])); // 6
console.log(getProduct(...[1, 2, 3, 4])); /6

console.log(getSum(...[0, 1]));; //1
console.log(getSum(...[0, 1, 2]));; // 3
console.log(getSum(...[0, 1, 2, 3]));; // 3
```

### 6.2、收集参数

扩展操作符能将**不同长度**的**独立参数**组合为**同一个数组**。有点类似`arguments`对象，但得到是一个`Array`实例

```js
// 通过扩展操作符将独立的参数整合为一个数组。
function getSum(...values){
    console.log(values); // [1, 2, 3]
    return values.reduce((total, pre)=> total + pre, 0)
}

console.log(getSum(1, 2, 3)); // 6
```

收集参数的前面如果还有命令参数，则只会收集其余的参数；如果没有则会得到空数组。

<mark>因为收集参数是可变的，所以要将他作为作为最后一个参数</mark>

```js
// 因为收集参数是可变的，所以将他作为最后一个参数
// 不行
function getProduct(...values, lastValue){}

// 可行
function ignoreFirst(firstValue,...values){
    console.log(values);
}
ignoreFirst(); // []
ignoreFirst(1); // []
ignoreFirst(1,2); // [2]
ignoreFirst(1,2, 3); // [2, 3]
```

<mark>可以通过箭头函数实现与`arguments`一样的逻辑</mark>

```js
// 通过收集参数实现与arguments相同的逻辑
let getSum = (...values) => {
    return values.reduce((total, pre) => total + pre, 0);
};
console.log(getSum(1, 2, 3)); // 6
```

收集参数并不会影响到`arguments`对象，因为其仍然传入的是调用时传入的参数

```js
function getSum(...values){
    console.log(arguments.length)  // 3
    console.log(arguments) // [1,2,3]
    console.log(values);   // [1,2,3]
}
console.log(getSum(1,2,3)); 
```
