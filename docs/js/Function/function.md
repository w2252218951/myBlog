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

## 4、没有重载 p92

**什么是重载？**

重载就是一个函数可以有两个定义，只要签名（接受参数的类型和数量）不同就行。

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

## 6、参数扩展与收集 p295

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

通过**可迭代对象**的扩展操作符，可将**迭代对象**作为一个参数进行拆分，并将迭代返回的每个值单独传入。

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
console.log(getProduct(...[1, 2, 3, 4])); //6

console.log(getSum(...[0, 1]));; //1
console.log(getSum(...[0, 1, 2]));; // 3
console.log(getSum(...[0, 1, 2, 3]));; // 3
```

### 6.2、收集参数 p296

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

## 7、函数声明与函数表达式 p 297

**区别：**

- `JS`引擎在执行任何代码之前，会**先读取**函数声明，然后在执行上下文生成函数定义。这个过程被称为**函数声明提升**

- 函数表达式必须等到代码执行到那一行，才会在执行上下文中生成函数定义。

```js
// 这是没问题的
console.log(sum(10, 10));
function sum(num1, num2){
    return num1 + num2
}
```

如果将函数声明改为等价的函数表达式，就会在执行时报错

```js
console.log(sum(10, 10));  // sum is not defined
let sum = function(num1, num2){
    return num1 + num2
}

console.log(sum1 (10, 10));  // sum1 is not defined
var sum1 = function(num1, num2){
    return num1 + num2
}
```

上述报错是因为，函数声明只能等到代码执行到这一行时，才会在执行上下文中生成函数定义。并且这并不是因为`let`所导致的，`var`也会出现同样的情况。

:::tip

在使用函数表达式初始化变量时，也可以给函数一个名称，比如 let sum = 
function sum() {}

:::

## 8、函数作为值 p298

为什么函数能够作为值进行传参？

因为函数名在`ECMAScript`中就是变量，所以函数可以使用在任何使用变量的地方。

<mark>需要注意的是，在进行传参时，如果是要访问函数而不是调用函数，就必须不加括号。</mark>

怎样对一个数组对象进行排序？

通过`sort()`方法，该方法接受两个需要比较的值。

```js
// 通过 sort 方法进行数组对象中属性的排序
function createComparisonFunction(propertyName){
    // sort 会在function中传入两个参数
    return function(object1, object2){
        let value1 = object1[propertyName];
        let value2 = object2[propertyName]
        if(value1 < value2){
            return -1
        }else if(value1 > value2){
            return  1
        }else {
            return 0
        }
    }
}
let data = [
    {name: "Zachary", age: 28},
    {name: "Nicholas", age: 29}
]
data.sort(createComparisonFunction("name"));
```

## 9、函数内部 p299

<mark>在`ECMAScript5`中，函数内部有两个特殊的对象，`arguments`和`this`</mark>

<mark>`ECMAscript6`又新增了`new.target`属性</mark>

### 9.1、 arguments

`arguments`对象是什么？

它是一个类数组对象，包含调用函数时传入的所有参数，并且只以`function`关键词定义函数时（相对于构造函数）才会存在。

<mark>`arguments`对象有一个`callee`属性，是一个指向`arguments`对象所在函数的指针</mark>

下面举个例子：

```js
// 经典的阶乘函数
function factorial(num){
    if(num <=1){
        return 1
    }else {
        return  num * function(num - 1)
    }
}
```

上面这个列子必须保证函数名是`factorial`，从而导致紧密耦合。使用`arguments.callee`可以让函数逻辑和函数名解耦。

```js
// 使用 arguments.callee 进行解耦
function factorial(num){
    if( num <= 1){
        return 1
    }else {
       // arguments.callee 是指向arguments对象所在函数的指针
        console.log(arguments.callee);
        return  num * arguments.callee(num - 1);
    }
}
let trueFactorial = factorial;
factorial = function(){
    return 0
}
console.log(trueFactorial(5)); // 120
console.log(factorial(5)); // 0
```

`trueFactorial `变量被赋值为 `factorial`，实际上把同一个函数的指针又保存到了另一个位置。同时`callee`指向的是其`arguments`对象所在函数的指针，所以无论怎么改变都是最初的函数。

### 9.2、 this p300

<mark>`this`在**标准函数**和**箭头函数**中存在着差异。</mark>

- 标准函数中：
  
  `this`引用的是把函数当成方法调用的上下文对象。通常称其为`this`值（在全局上下文中调用函数时，`this`指向`window`）
  
  `this`引用哪个对象必须到函数被调用时才能确定，也可以理解为 
  
  <mark>谁调用了这个函数，`this`就指向谁。</mark>
  
  ```js
  window.color = 'red'; 
  let o = { 
   color: 'blue' 
  }; 
  function sayColor() { 
   console.log(this.color); 
  } 
  sayColor(); // 'red' 
  o.sayColor = sayColor;  
  // 此时将o 将 sayColor()函数当做方法调用 
  // 因此this引用的是 o
  o.sayColor(); // 'blue'
  ```

- 箭头函数中：
  
  `this`引用的是定义箭头函数的上下文。
  
  ```js
  window.color = 'red'; 
  let o = { 
   color: 'blue' 
  }; 
  let sayColor = () => console.log(this.color); 
  sayColor(); // 'red' 
  o.sayColor = sayColor; 
  o.sayColor(); // 'red' 
  ```

怎样在事件回调和定时回调是确保`this`的指向？

将回调函数写成箭头函数就行了。<mark>因为箭头函数中的`this`会保留定义该函数时的上下文</mark>

```js
function King(){
    this.royaltyName = 'Henry';
    // this 引用 King 的实例
    setTimeout(()=> {
        console.log(this.royaltyName);
    }, 1000)
}
function Queen(){
    this.royaltyNmae = 'Elizabeth';
    // this 引用 window 对象
    setTimeout(function() {
        console.log(this.royaltyNmae);
    },1000)
}
new King(); // Henry
new Queen() // undefined
```

### 9.3、caller p301

`ES5`中给函数定义的一个属性`caller`，<mark>该属性引用的是调用当前函数的函数</mark>如果是全局作用域中调用的就是`null`

```js
function outer(){
    inner()
}
function inner(){
    console.log(inner.caller);
}
outer() 
/*ƒ outer(){
    inner()
}*/
```

可以通过`arguments.callee.cller`降低耦合度

```js
function outer(){
    inner()
}
function inner(){
    console.log(arguments.callee.caller);
}
```

### 9.4、 new.target p301

`ES6`中新增了检测函数是否使用`new`关键词调用的`new.target`属性。如果正常使用就返回`undefined`;如果使用的是`new`关键词调用，则`new.target`将引用被调用的构造函数。

```js
// 通过 new.target 判断是否是构造函数
function King(){
    if(!new.target){
        throw 'King must be instantiated using "new"'
    }
    console.log('King instantiated using "new"');
}
new King(); // King instantiated using "new"
King(); // Uncaught King must be instantiated using "new"
```

## 10、属性和方法 p 302

`ECMA`中的函数**是对象**，因此有**属性和方法**。每个函数都有两个属性`length`和`arguments`,`es6`中新增了只读属性`name`

`length`：属性保存的是函数定义**命名参数的个数**

```js
function sayName(name){
    console.log(name);
}
function sum(num1 , num2){
    return num1 + num2
}
function sayHi(){
    console.log('h1');
}

console.log(sayName.length); // 1
console.log(sum.length); // 2
console.log(sayHi.length); // 0
```

`prototype`：是保存所有引用类型实例方法的地方。

其特点：`toString()、valueOf()`实际上都保存在`prototype`上，进由所有实例方法**共享** 

                且`prototype`是不可被枚举的，因此`for-in`循环不会返回这个属性。

函数中还有两个方法`apply()`和`call()`。都以指定的`this`调用函数。

- 即设置调用函数时函数体内`this`的值。

- `apply`接收两个参数：函数内`this`值和一个参数数组。可以是`Array`实例，也可以是`arguments`对象

- `call` 作用与`apply()` 一样：但是从第一个参数后面的参数起，都要逐个传入调用。

```js
function sum(num1 , num2){
    return num1 + num2
}
function callSum1(num1, num2){
    return sum.apply(this, arguments) // 传入 arguments 对象
}
function callSum2(num1, num2){
    return sum.apply(this, [num1, num2]) // 传入数组
}
function handleSum(num1, num2){
    return sum(...arguments)
}

console.log(callSum1(10, 10));
console.log(callSum2(10, 10));
console.log(handleSum(10, 10));
```

在这个例子中，`callSum1()`会调用 `sum()`函数，将 this 作为函数体内的 this 值（这里等于window，因为是在全局作用域中调用的）传入，同时还传入了 `arguments `对`callSum2()`也会调用` sum()`函数，但会传入参数的数组。

::: tip
在严格模式下，调用函数时如果没有指定上下文对象，则 this 值不会指向 window。
除非使用 apply()或 call()把函数指定给一个对象，否则 this 的值会变成 undefined。

:::

`apply()和call()`主要作用**不是传参**，而是控制函数**调用上下文即函数体内`this`值**的能力。

```js
// 通过apply() 和 call() 控制函数上下文中 this 的值
window.color = 'red';
let o = {
    color : 'blue'
}
function sayColor(){
    console.log(this.color);
}
sayColor()  // red
sayColor.call(this)  // red    this => window
sayColor.call(window) // red
sayColor.call(o)  // blue // this => 将上下文切换到o
```

`ES5`中新增了`bind()`方法。该方法会创建一个新的实例函数。即`this`值会绑定到传给`bind()`的对象；

```js
// 将 this 的值绑定传给 bind 对象
window.color = 'red';
var o = {
    color: 'blue',
}
function sayColor(){
    console.log(this.color);
}
// 将this的值绑定传给 bind 对象
let objectSayColor = sayColor.bind(o);
objectSayColor(); // blue
```

:::tip

对函数而言，继承的方法` toLocaleString()和 toString()`始终返回**函数的代码**。返回代码的具体格式因浏览器而异。有的返回源代码，包含注释，而有的只返回代码的内部形式，会删除注释，甚至代码可能被解释器修改过。由于这些差异，因此不能在重要功能中依赖这些方法返回的值，而只应在调试中使用它们。

<mark>继承的方法 valueOf()返回函数本身</mark>

:::

## 11、函数表达式 p304

定义函数有两种方式：

- 函数声明：
  
  ```js
  function(arg0, num1, num2){
      // 函数体
  }
  ```
  
  <mark>函数声明的关键就是`函数声明提升`。</mark>这种情况下，`js`引擎会先读取函数声明，然后执行代码。

- 函数表达式
  
  ```js
  let functionName = function(arg0, arg1, arg2) { 
   // 函数体 
  };
  ```
  
  **匿名函数**： `function`后面没有接标识符。（**匿名函数也被称为兰姆达函数**）。未赋值给其他变量的匿名函数的`name`属性是空字符串。

<mark>理解函数声明和函数表达式之前的区别，关键是理解声明提升</mark>

## 12、递归

**p307**

**递归函数** 通常是一个函数通过名称调用自己。

```js
function factorial(num){
    if(num <=1){
        return 1
    }else {
        return  num * factorial(num-1)
    }
}
```

<mark>通过`arguments.callee`可以确保通过什么变量都能调用这个函数不出问题</mark>

<mark>编写递归函数时`arguments.callee`是引用当前函数的首选。</mark>

<mark>需要注意的是在严格模式下，是不能访问该方法的。可以使用**命名函数表达式**</mark>

```js
// 命名函数表达式  相当于给函数添加一个标识符
// 只能在函数作用域中使用
const factorial = (function f(num){
    if(num <= 1){
        return 1
    }else {
        return num * f(num - 1)
    }
})
```

这里创建了一个命名函数表达式 f()，然后将它赋值给了变量 factorial。即使把函数赋值给另
一个变量，函数表达式的名称 f 也不变，因此递归调用不会有问题。这个模式在严格模式和非严格模式下都可以使用

## 13、尾调用优化

什么是尾调用？

答：<mark>外部函数的返回值是一个内部函数的返回值</mark>

```js
// 外部函数的返回值是内部函数的返回值即尾调用
function outerFunction(){
    return innerFunction(); // 尾调用
}
```

在`ES6`新增了一套内存管理优化机制，让`JS`引擎在满足条件时可以重用栈帧

| **优化之前**                                                   | **优化之后**                                                     |
|:---------------------------------------------------------- | ------------------------------------------------------------ |
| 执行到`outerFUnction`函数体、第一个栈帧被推到栈上                           | 执行到`outerFunction`函数体、第一个栈帧被推到栈上                             |
| 执行`outerFunction`函数体、到`return`语句，计算返回值必须先计算`innerFunction` | 执行`outerFunction`函数体，到达`return`语句。计算返回值必须先求知`innerFunction`。 |
| 执行到`innerFunction`函数体，第二个栈帧被推倒栈上。                          | 引擎发现可将第一个栈帧弹出，因为`innerFunction`的返回值也是`outerFunction`的返回值。    |
| 执行`innerFunction`函数体，计算其返回值                                | 弹出`outerFunction`栈帧。                                         |
| 将返回值传回`outerFunction`,然后`outerFuncion`再返回值                 | 执行到`innerFunction`函数体,栈帧被推到栈上。                               |
| 将栈帧弹出栈外                                                    | 执行`innerFuncion`函数体，计算其返回值。                                  |
|                                                            | 将`innerFunction`的栈帧弹出栈外。                                     |

区别：

- 优化之前：每多一调用一次嵌套函数，就会多增加一个栈帧。

- 优化之后：无论调用多少次嵌套函数，都只有一个栈帧。这也是`ES6`尾调用优化的关键。

### 13.1、尾调用优化的条件

**p307**

尾调用优化的条件？

答：确定外部帧真的没有必要存在了，具体条件如下：

- 代码在严格模式下执行；

- 外部函数的返回值是对尾调用函数的调用；

- 尾调用函数返回后不需要执行额外的逻辑；

- 尾调用函数不是引用外部函数作用域中自有变量的闭包；

```js
// 尾调用函数
function innerFunction(){
    return 1111
}
// 无优化： 尾调没有返回
function outerFunction1(){
    innerFunction()
}
// 无优化： 尾调没有直接返回
function outerFunction2(){
    let innerFunctionResult = innerFunction();
    return innerFunctionResult;
}
// 无优化： 尾调用返回后被转换为字符串
function outerFunction3(){
    return innerFunction().toString()
}
// 无优化： 尾调用是一个闭包
function outerFunction4(){
    let foo = 'bar';
    function innerFunction1(){ return foo}
    return innerFunction1()
}
```

<mark>符合尾调用条件的例子</mark>

```js
// 符合尾调用函数优化的例子
"use strict"
function innerFunction(c){
    return c;
}
// 有优化：栈帧销毁前执行参数计算
function outerFunction1(a, b){
    return innerFunction(a + b)
}
// 有优化： 初始返回值不设计栈帧
function outerFunction2(a,b){
    if(a > b){
        return b
    }
    return  innerFunction(a + b);
}
// 有优化：两个内部函数都在尾部
function outerFunction3(condition){
    return condition ? innerFunction() : innerFunction()
}

```

<mark>无论是**递归尾调**还是**非递归尾调**，**都可优化**。引擎**不会区分调用的**是**自身函数**还是**其他函数**</mark>

**为什么要在严格模式下使用栈帧？**

答：因为在非严格模式下函数调用是允许使用`f.arguments`和`f.caller`,而他们引用的都是外部函数的栈帧。这就意味着不能优化了。因此尾调用函数优化必须在严格模式下，就是为了防止使用这些属性

### 13.2、尾调用优化代码

p309

将简单的递归函数转换为待优化的代码以此加深理解

```js
// 普通的斐波那契数列函数 fib(n)的栈
// 帧数的内存复杂度是 O(2n)
)。
function fib(n){
    if(n < 2){
        return n
    }
    return  fib(n -1 ) + fib(n - 2)
}

console.log(fib(6)); // 8
```

```js
// 进行尾调优化
'use strict'
// 基础框架
function fib(n){
    return fibImpl(0, 1, n)
}
// 执行递归
function fibImpl(a, b, n){
    if(n === 0){
        return n
    }
    return  fib(b, a+b ,n -1)
}
```

## 14、闭包

p309

**什么是闭包？**

匿名函数经常被人**误认为**是**闭包**。

<mark>但是闭包指的是引用了另一个函数作用域中变量的函数，通常在嵌套函数中实现。</mark>

```js
function createComparisonFunction(propertyName) {
    return function(object1, object2) {
        let value1 = object1[propertyName]; // 引用外部函数变量
        let value2 = object2[propertyName]; // 引用外部函数变量
        if (value1 < value2) { 
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}} 
 }; 
} 
```

:::tip
在调用一个函数时，会为这个函数调用创建一个执行上下文，并创建一个作用域链。然后用`arguments`和其他命名参数来初始化这个函数的活动对象。外部函数的活动对象是内部函数作用域上的第二个对象，这个作用域链一直向外串起了所有包含函数的活动对象，直到指向全局上下文才结束。

:::

```js
function compare(value1, value2) {
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}
let result = compare(5, 10); 
```

`compare`是在全局上下文中调用的，第一次调用时会为`compare`创建一个包含`arguments、value1、value2`的活动对象，这个对象是其作用域链上的第一个对象。而全局上下文中的变量对象`compare、this、result`，则是其作用域链上的第二个对象。

**什么是变量对象？以及什么是活动对象？**

每个执行上下文中都**包含**一个其中**变量**的**对象**。

<mark>**全局上下文中**的叫**全局变量**，**它会始终在代码执行期间存在**。</mark>

<mark>局部上下文中的叫做**活动变量**，只在代码执行期间存在。</mark>

在定义`compare()`函数时，会为它创建一个作用域链，预装载全局变量对象，并保存在`[[Scope]]`中。在调用这个函数时，会创建相应的执行上下文，然后通过复制函数的`[[Scope]]`来创建作用域。接着将创建函数的活动对象（用作变量对象）并将其推入作用域链的前端。这个例子中意味着`conpare()`函数执行上下文的作用域链中有两个变量对象：局部的变量对象和全局的变量对象。

**作用域链**其实是一个包含指针的列表，每个指针都指向一个变量对象，但物理上并不包含相应的对象。
