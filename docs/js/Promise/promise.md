---
title: 期约
tags:
- js
- promise
categories:
- 笔记
  date: 2021-05-31
---

## 期约 (promise)

p325

<mark>期约是对尚不存在的一个结果的替身。</mark>                                                                                                                                                                                                                                                                                                                                                                                                                                  

## 1、`Promise/A+`规范

早期的期约机制是在`jQuery`和`Dojo`中以`Deferred API`的形式出现的。

2010年`commonJS`项目实现的`Promise/A`规范才日益流行。

2012年`Promise/A+`组织分叉（`fork`）了`commonJS`的`Promise/A`建议，并制定了同名的`Promise/A+`规范，该规范成为了`ES6`规范实现的范本。

`ES6`新增了`Promise`类型，所有现代浏览器都支持`ES6`期约，很多浏览器的`API`（如`fetch()和Battery Status API`）也是以期约为基础

## 2、期约基础

`ES6`新增了引用类型`Promise`，通过`new`操作符进行实例化。创建新期约时需要传入一个执行器`（executor）`函数作为参数。并且其参数不能为空，

```js
let p = new Promise(() => {})
// Promise{<pending>}
setTimeout(console.log, 0, p);
// let p1 = new Promise();
// Promise resolver undefined is not a function
// setTimeout(console.log, 0, p1);
```

### 2.1、期约状态机

<mark>期约是一个有状态的对象，分为以下3种状态：</mark>

- 待定（`pending`）;

- 兑现（`fulfilled`，有时也被称为解决，`resolved`）；

- 拒绝（`rejected`）

**待定（ `pending` ）** 是期约的初始状态。在待定状态下，期约可以**落定**（`settled`）为代表成功的**兑现**（`fulfiled`）状态，或者代表失败的**拒绝**（`rejected`）状态。并且无论是哪种状态都是不可逆的。 

**为什么期约状态不能被`JS`检测到**

因为期约状态是私有的，并且其主要是为了**避免**根据**读取到的期约状态**，以**同步**的方式处理期约对象。并且期约的状态也不能够被外部`JS`代码修改。 **期约故意将异步行为封装起来，从而隔离外部的同步代码。**

### 2.2、解决值、拒绝理由及期约用例

p 236

**期约的两大用途：**

1. 抽象的表示一个异步操作：期约的状态表示期约是否完成。“待定”表示尚未开始或者正在执行中。“兑现”表示已经完成，“拒绝”表示没有成功。

2. 每个期约只要状态切换为**兑现**，就会有一个私有的内部**值**。同样的，当期约状态切换为**拒绝**,就会有一个私有的内部**理由**。无论是值还是理由，都包含原始值或对象不可修改的引用。二者是可选的，默认值都为`undefined`。在期约达到某个落定状态时执行的异步代码会始终收到这个值或理由。

某些情况下，**状态机**就是期约可以提供的最有用的信息。例如：通过期约向服务器发送`HTTP`请求，则可以根据返回的状态码将期约的状态，变为**兑现**或者**拒绝**

### 2.3、通过执行函数控制期约的状态

**为什么要通过执行函数控制期约的状态？**

以为期约的状态是**私有的**，所以只能在内部进行操作，而内部操作是在期约的执行函数中完成的。

执行函数的两项职责：

1. 初始化期约的异步行为；

2. 控制状态的最终转换；

控制期约的状态转换通常是通过两个函数参数实现的。通常命名为`resolve()`和`rejected()`。调用`resolved()`会将状态切换为**兑现**，调用`rejected()`会将状态切换为**拒绝**，并抛出错误。

```js
let p1 = new Promise((resolve, rejected) => resolve());
setTimeout(console.log, 0 , p1); // Promise {<fulfilled>: undefined}
let p2 = new Promise((resolve,rejected) => rejected());
setTimeout(console.log, 0 , p2);
//Uncaught (in promise) undefined
//Promise{<rejected>: undefined}
```

执行器函数时**同步**执行的。因为执行器函数是期约的初始化程序

**Promise 执行顺序**

```js
// 期约是同步执行的 可以观察到其执行顺序
new Promise(()=> setTimeout(console.log, 0, 'executor'));
setTimeout(console.log, 0 , 'promise');
// executor
// promise
```

### 2.4、 Promise.resolve()

p 327

期约并不是一开始就是待定状态。是可以通过调用静态方法`Promise.resolve()`，可以实例化一个解决的期约。

```js
let p1 = new Promise((resolve, reject) => resolve())
let p2 = Promise.resolve();
```

解决的期约的值对应传`Promise.resolve()`的第一个参数。该方法可以将任何值转换为一个期约。

```js
// 通过 Promise.resolve() 将任何值转换为一个期约
setTimeout(console.log, 0, Promise.resolve());
// Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, Promise.resolve(3));
// Promise {<fulfilled>: 3}
// 多余的参数会被忽略
setTimeout(console.log, 0, Promise.resolve(4,5,6))
// Promise {<fulfilled>: 4}
```

<mark>如果传入的参数本身是个期约，其类似于一个空包装。可将`Promise.resolve`当做幂等方法</mark>

```js
// 使用 Promise.resolve时， 如果传入的是期约， 其就相当于一个空包装
let p = Promise.resolve(7);

setTimeout(console.log, 0, p === Promise.resolve(p));
// true
setTimeout(console.log, 0, p === Promise.resolve(Promise.resolve(p)));
// true
```

<mark>幂等性会保留传入期约的状态</mark>

```js
// 同时 幂等性会保留传入期约的状态  期约中需要传入执行器函数 应付解释器
let p = new Promise(()=> {});
setTimeout(console.log, 0 , p);
// Promise {<pending>}
setTimeout(console.log, 0, Promise.resolve(p));
// Promise {<pending>}
setTimeout(console.log, 0, p === Promise.resolve(p))
// true
```

`Promise.resolve()`能包装任何非期约值，包括**错误对象**，将其转换为解决的期约。因此可能会出现不和预期的行为。

```js
// 通过 Promise.resolve() 将错误对象 包装成已解决
let p = Promise.resolve(new Error('foo'));
setTimeout(console.log, 0, p);
// Promise {<fulfilled>: Error: foo
```

### 2.5、 Promise.reject();

p 328

`Promise.reject()`能实例化一个**拒绝的期约**并抛出**异步错误**（这个错误不能通过`try/catch` 捕获，只能够通过拒绝处理程序捕获。）

```js
// 两者相等
let p1 = new Promise((resolve, reject) => reject());
let p2 = Promise.reject();
console.log(p1 === p2);  // true
```

和`Promise.resolve()`一样，**拒绝的期约的理由**会传给`Promise.reject()`的第一个参数。并且会传给后续的拒绝处理程序。

```js
// 拒绝期约的理由作为 promise.reject的第一个参数
let p = Promise.reject(3);
setTimeout(console.log, 0, p);
// Promise {<rejected>: 3}
p.then(null,e => setTimeout(console.log, 0 , e))
// 3
```

同时`Promise.reject`并没有照搬`Promise.resolve()`的幂等逻辑。给它传入一个期约对象，<mark>这个期约会成为它返回的拒绝期约的理由</mark>

```js
setTimeout(console.log, 0, Promise.reject(Promise.resolve()));
// Promise {<rejected>: Promise}
```

### 2.6、同步/异步执行的二元性

p 329

<mark>`Promise`的**设计**很大程度会导致完全**不同于**`JS`的**计算模式**。</mark>

下面是两种抛出错误的情形；

```js
// js 中两种抛出错误的场景
try {
    throw new Error('sans')
}catch (e){
    console.log(e);
}
// Error: sans
try {
    Promise.reject(new Error('bar'))
}catch (e){
    console.log('e',e);
}
// Uncaught (in promise) Error: bar

try {
    Promise.reject('foo')
}catch (e){
    console.log('e',e);
}
// Uncaught (in promise) foo
```

第一个`try/catch`抛出并捕获了错误，第二个`try/catch`抛出错误却**没有**捕获到。

这个同步代码之所以没有抛出错误，是因为它没有通过**异步模式**捕获错误。

**什么是期约真正的异步特性？**

期约是同步对象（在同步执行模式中使用），但也是**异步执行**模式的媒介

拒绝期约的**错误**并**没有**抛到**执行同步代码**的**线程**中，而是通过**浏览器异步消息队列**来处理的。代码一旦开始**异步模式执行**，与之**交互**的**唯一方法**就是使用**异步结构**，更具体来说就是-**期约的方法**

## 3、期约的实例方法

期约的实例方法是**连接外部同步代码**和**内部异步代码**之间的桥梁。

这些方法可以**访问**异步操作**返回**的**数据、处理期约成功和失败的结果，连续对期约求值，或者添加只有期约进入终止状态时才会执行的代码。**

### 3.1、实现`Thenable` 接口

在`ES`暴露的任何**异步结构**中，任何代码都有`then()`方法。这个方法实现了`Thenable`接口。

实现该接口最简单的类：

```js
class MyThenable{
    then(){
    }
}
```

### 3.2、 `Promise.prototype.then()`

`Promise.prototype.then()`是为**期约实例**添加**处理程序**的**主要方法**；

`then()`接受两个参数：`onResolved`处理程序和`onRejected`处理程序，并且这两个参数时可选的 。提供的话，期约会分别进入“兑现”和“拒绝”状态时执行。

```js
// Promise.prototype.then() 传入两个参数  onResolved  和 onRejected
function onResolved(id){
    setTimeout(console.log, 0, id, 'resolved')
};
function onRejected(id){
    setTimeout(console.log, 0 , id, 'rejected')
}
let p1 = new Promise((resolve, reject)=> {
    setTimeout(resolve, 3000)
})
let p2 = new Promise(((resolve, reject) => {
    setTimeout(reject, 30000)
}))

p1.then(()=> { onResolved('p1')},
        ()=> { onRejected('p1')}
)
p1.then(()=> { onResolved('p2')},
        ()=> { onRejected('p2')}
)

// p1 resolved
// p2 rejected
```

期约的只能最终转换状态一次，所以这两个操作一定是互斥的。

<mark>传给`then()`的任何非函数类型的参数都会被忽略掉</mark>

<mark>如果只提供`onRejected`参数，就要在`onRevolved`参数位置上传入`undefined`</mark>

这样做能避免在内存中创建多余的对象。

```js
// 只给onRejected进行传参
function onResolved(id){
    setTimeout(console.log, 0, id, 'resolved')
};
function onRejected(id){
    setTimeout(console.log, 0 , id, 'rejected')
}
let p1 = new Promise((resolve, reject)=> {
    setTimeout(resolve, 3000)
})
let p2 = new Promise(((resolve, reject) => {
    setTimeout(reject, 3000)
}))
// 非函数处理程序会被忽略掉 // 不推荐
p1.then('sans')

// ！！！！ 不传 onResolved 处理程序的规范写法
p2.then(null, ()=> onRejected('p2'))
// p2 rejected  3秒后
```

`Promise.prototype.then()`方法会返回一个新的期约实例。

```js
// Promise.prototype.then() 会返回一个新的期约实例
let p1 = new Promise(()=>{});
let p2 = p1.then();
setTimeout(console.log, 0, p1);  // Promise {<pending>}
setTimeout(console.log, 0, p2);  // Promise {<pending>}
setTimeout(console.log, 0, p1 === p2);  // false
```

该处理程序的返回值会通过`Promise.resolve()`包装来生成新期约。如果没有提供处理程序，则`Promise.resovle()`就会包装上一个期约解决后的值。如果没有显示的返回语句，则`Promise.resovl()`会包装默认的返回值`undefined`。

<mark>如果`then()`中没有处理程序，`Promise.resolve`就会返回上一个期约的解决值。</mark>

```js
// 若调用then() 时不传处理程序， 则原样后传 => 相当于返回上一个期约的解决值
let p1 = Promise.resolve('sans');
let p2 = p1.then();
setTimeout(console.log, 0, p2);
// Promise{<fulfilled>: "sans"}
let p3 = p1.then(()=> {}),
    p4 = p1.then(() => undefined),
    p5 = p1.then(() => Promise.resolve()),
    p6 = p1.then(() => Promise.reject()),
    p7 = p1.then(null)
setTimeout(console.log, 0, 'p3',p3); //  p3 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p4',p4); //  p4 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p5',p5); //  p5 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p6',p6); //  p6 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p7',p7); //  p7 Promise {<fulfilled>: "sans"}
```

如果没有显示返回语句，则`Promise.resolve()`会包装默认返回的值`undefined`

```js
// 若调用then() 时不传处理程序， 则原样后传 => 相当于返回上一个期约的解决值
let p1 = Promise.resolve('sans');
let p3 = p1.then(()=> {}),
    p4 = p1.then(() => undefined),
    p5 = p1.then(() => Promise.resolve()),
    p6 = p1.then(() => Promise.reject()),
    p7 = p1.then(null)
setTimeout(console.log, 0, 'p3',p3); //  p3 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p4',p4); //  p4 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p5',p5); //  p5 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p6',p6); //  p6 Promise {<fulfilled>: undefined}
setTimeout(console.log, 0, 'p7',p7); //  p7 Promise {<fulfilled>: "sans"}
```

<mark>如果有显示的返回值，则`Promise.revolve()会包装这个值。`</mark>

```js
// 如果有显示的返回值 则Promise.resolve 会包装这个值
let p1 = Promise.resolve('sans');
let p2 = p1.then(()=> 'bar'),
    p3 = p1.then(() => Promise.resolve('bar'));
setTimeout(console.log, 0, p2) // Promise {<fulfilled>: "bar"}
setTimeout(console.log, 0, p3) // Promise {<fulfilled>: "bar"}
```

<mark>`Promise.resolve()`会保留返回的期约</mark>

```js
// Promise.resolve 会保留返回的期约
let p1 = Promise.resolve('sans');
let p4 = p1.then(()=> new Promise(()=> {})),
    p5 = p1.then(()=> Promise.reject());
setTimeout(console.log, 0, p4) // Promise {<pending>}
setTimeout(console.log, 0, p5) // Promise {<rejected>: undefined}
```

<mark>抛出异常会返回拒绝的期约</mark>

```js
// 抛出异常会返回拒绝的期约
let p1 = Promise.resolve('sans');
let p2 = p1.then(() => { throw 'baz'; });
//  Uncaught (in promise) baz
setTimeout(console.log, 0, p2) // Promise {<rejected>: "baz"}
```

返回错误的值**不会触发**上面的**拒绝行为**，而是把**错误对象**包装在一个**解决的期约中**：

```js
// 返回错误值不会触发拒绝行为，而是将错误对象包装在解决的期约中
let p1 = Promise.resolve('sans');
let p2 = p1.then(() => Error('qux'));
setTimeout(console.log, 0 , p2)
// Promise {<fulfilled>: Error: qux
```

`onRejected`处理程序的返回值也会被`Promise.resolve()`包装。

因为`onRejected`处理程序的任务本身就是**捕获异步错误**，所以拒绝处理程序在捕获**异步错误**后不抛出异常是符合期约的行为，应该返回一个**解决期约**

`Promise.reject` 代替`Promise.resovle`

```js
/**
 * 使用 Promise.reject 代替 Promise.resolve
 */
let p1 = Promise.reject('sans');
// 如果then() 中不写入处理程序 会原样后传 实际上就是返回上一个期约的解决值
let p2 = p1.then();
setTimeout(console.log, 0, p2);
// Uncaught (in promise) sans
// Promise {<rejected>: "sans"}
// 因为是获取 onRejected的会结果 需要在 onResolved 参数传入一个 null
// 如果没有显示的返回值，就会取默认返回值undefined
let p3 = p1.then(null,() => {}),
    p4 = p1.then(null,() => undefined),
    p5 = p1.then(null,() => Promise.resolve());
setTimeout(console.log, 0, p3);
setTimeout(console.log, 0, p4);
setTimeout(console.log, 0, p5);
// Promise {<fulfilled>: undefined}
// Promise {<fulfilled>: undefined}
// Promise {<fulfilled>: undefined}

// 有显示的返回值就包装这个值
let p6 = p1.then(null, ()=> 'bar'),
    p7 = p1.then(null, ()=> Promise.resolve('sans'))
setTimeout(console.log, 0, p6);
setTimeout(console.log, 0, p7);
// // Promise {<fulfilled>: "bar"}
// // Promise {<fulfilled>: "sans"}

// Promise.reject 保留返回的期约
let p8 = p1.then(null, ()=> new Promise(()=> {})),
    p9 = p1.then(null, ()=> Promise.resolve())
    p10 = p1.then(null, ()=> Promise.reject())
setTimeout(console.log, 0, p8);
setTimeout(console.log, 0, p9);
setTimeout(console.log, 0, p10);
// Promise {<pending>}
// Promise {<fulfilled>: undefined}
// Promise {<rejected>: undefined}

// 抛出异常会返回拒绝的期约
let p11 = p1.then(null, ()=> {throw 'sans'});
// Uncaught (in promise) baz
setTimeout(console.log, 0, p11);
// Promise {<rejected>: "sans"}

// 抛出错误不会触发拒绝行为， 而是将错误对象包装到一个解决的期约中
let p12 = p1.then(null, ()=> Error('sans'))
setTimeout(console.log, 0, p12);
// Promise {<fulfilled>: Error: sans
```

### 3.3、`Promise.prototype.catch()`

p 332

`Promise.prototype.catch()`方法用于给期约添加**拒绝处理程序**。只接受`onRejected`处理程序。

本质上，该方法是一个**语法糖**，调用它相当于调用`Promise.prototype.then((null,onRejected))`

```js
let p = Promise.reject();
let onRejected = function(e){
    setTimeout(console.log, 0 , 'rejected')
}
// 这两种添加拒绝处理程序的方式是一样的
p.then(null,onRejected);  // rejected
p.catch(onRejected)   // rejected
```

`Promise.prototype.catch()`返回的是一个**新的期约实例**

```js
let p1 = new Promise(()=> {}),
    p2 = p1.catch();
setTimeout(console.log, 0 , p1) // Promise {<pending>}
setTimeout(console.log, 0 , p2) // Promise {<pending>}
setTimeout(console.log, 0 , p1 === p2) // false
```

在返回新期约实例方面`Promise.prototype.catch()`行为与`Promise.prototype.then()`的`onRejected`处理程序是一样的。

### 3.4、`Promise.prototype.finally()`

p 333

`Promise.prototype.finally()`用于给期约添加`onFinally`处理程序。这个程序在期约转换为解决或拒绝状态时都会执行。能够避免`onResolved`和`onRejected`出现冗余的代码。

该方法不知道期约的状态，因此主要是用来清理代码。

```js
// Promise.prototype.finally() 用于清理冗余代码
let p1 = Promise.resolve();
let p2 = Promise.reject();
let onFinally = function() {
    setTimeout(console.log, 0, 'Finally!');
};
p1.finally(onFinally); // finally
p2.finally(onFinally); // finally
```

和其他几个实例方法一样，`Promise.prototype.finally`返回一个新的期约实例。

```js
let p1 = new Promise(() => {});
let p2 = p1.finally();
setTimeout(console.log, 0 , p1) // Promise {<pending>}
setTimeout(console.log, 0 , p2) // Promise {<pending>}
setTimeout(console.log, 0 , p1 === p2) // false*/
```

`onFinally`被设计为一个与状态无关的方法，因此大多数情况下都表示为**父期约的传递**

可以理解为不管传递什么期约，返回去的实例是该期约

```js
// 该期约返回的实例，大多数情况下都表示父期约的传递
let p1 = Promise.resolve('sans');
// 都是原样后传
let p2 = p1.finally();
let p3 = p1.finally(() => undefined);
let p4 = p1.finally(() => {});
let p5 = p1.finally(() => Promise.resolve());
let p6 = p1.finally(() => 'bar');
let p7 = p1.finally(() => Promise.resolve('bar'));
let p8 = p1.finally(() => Error('qux'));

setTimeout(console.log, 0, p2); // Promise <resolved>: sans
setTimeout(console.log, 0, p3); // Promise <resolved>: sans
setTimeout(console.log, 0, p4); // Promise <resolved>: sans
setTimeout(console.log, 0, p5); // Promise <resolved>: sans
setTimeout(console.log, 0, p6); // Promise <resolved>: sans
setTimeout(console.log, 0, p7); // Promise <resolved>: sans
setTimeout(console.log, 0, p8); // Promise <resolved>: sans
```

如果返回一个**待定**的期约，或者`onFinally`处理程序出现了错误（显示的抛出或返回一个拒绝期约），则会返回相应的期约。

```js
// 如果返回一个待定的期约 或者显示的抛出或者返回一个错误期约
// 会返回待定和拒绝的状态
let p1 = Promise.resolve('sans');
let p2 = p1.finally(()=> new Promise(()=> {}))
let p3 = p1.finally(()=> Promise.reject('rejected'))
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p2); //
setTimeout(console.log, 0, p3); //
// Promise {<pending>}
// Promise {<rejected>: "rejected"}
let p4 = p1.finally(() => { throw 'baz'; });
// Uncaught (in promise) baz
setTimeout(console.log, 0, p4); // Promise <rejected>: baz
```

**返回待定期约**的情形并不常见，因为只要期约一解决，新期约仍然会原样后传初始期约。

```js
let p1 = Promise.resolve('sans')
let p2 = p1.finally(()=> {
    return new Promise((resolve,reject)=> {
        setTimeout(()=> resolve('bar'), 100)
    })
})
// 该期约还未被解决
setTimeout(console.log, 0, p2);  // Promise {<pending>}
// 该期约已被解决 返回初始化期约
setTimeout(()=> setTimeout(console.log, 0, p2), 200);
// 200ms 后  Promise <resolved> : 'sans'
```

### 3.5、非重入期约方法

p334

当期约进入落定状态时，与期约状态相关的**处理程序**只会被排期，而非立即执行。**跟在**添加这个处理代码之后的**同步代码**，一定会在**处理程序前**执行。即使期约一开始就与附加处理程序关联的状态，执行顺序也是这样。

<mark>改特性由`JS`运行时保证，被称为**非重入**特性</mark>

```js
// 非重入特性
let p = Promise.resolve();
p.then(()=> console.log('sans'))
console.log('then() return');

// then() return
// sans
```

先添加处理程序后解决期约也是一样的。如果添加处理程序后，同步代码才改变期约状态，那么处理程序仍然会基于该状态变化表现出非重入特性。

下面例子展示即使先添加`onResolved`处理程序，再同步调用`resolve()`，处理程序也不会进入同步线程。

```js
let syncResolve;
// 创建一个期约并将解决函数保存到一个局部变量中
let p = new Promise((resolve => {
    syncResolve = function() {
        console.log('1: invoking resolve()');
        resolve();
        console.log('2: resolve() returns');
    }
}))
// 此处 then 调用的实际上是 resolve 回调
p.then(()=> console.log('4:  then() handler executes'))
syncResolve();
console.log('3: syncResolve() returns')
```

```js
let syncResolve;
let p = new Promise((resolve => {
    resolve();
}))
// 此处 then 调用的实际上是 resolve 回调
p.then(()=> console.log('4:  then() handler executes'))
// syncResolve();
console.log('3: syncResolve() returns')

//  4:  then() handler executes
//  3: syncResolve() returns
```

即使期约状态变化发生在添加期约处理程序后，处理程序也会等到运行的消息队列让他出列时才执行。

非重入适用于 onResolved/onRejected 处理程序、catch()处理程序和 finally()处理程序。
下面的例子演示了这些处理程序都只能异步执行：

```js
let p1 = Promise.resolve(); 
p1.then(() => console.log('p1.then() onResolved')); 
console.log('p1.then() returns'); 
let p2 = Promise.reject(); 
p2.then(null, () => console.log('p2.then() onRejected')); 
console.log('p2.then() returns'); 
let p3 = Promise.reject(); 
p3.catch(() => console.log('p3.catch() onRejected')); 
console.log('p3.catch() returns'); 
let p4 = Promise.resolve(); 
p4.finally(() => console.log('p4.finally() onFinally')); 
console.log('p4.finally() returns'); 
// p1.then() returns 
// p2.then() returns 
// p3.catch() returns 
// p4.finally() returns 
// p1.then() onResolved 
// p2.then() onRejected 
// p3.catch() onRejected 
// p4.finally() onFinally 
```

### 3.6、临近处理程序的执行顺序

当期约状态变化时，相关处理程序会按照添加他们的顺序依次执行。

```js
// 期约发生变化时，相关处理程序会按照添加顺序依次执行
let p1 = Promise.resolve(),
    p2 = Promise.reject();
p1.then(()=> setTimeout(console.log, 0 , 1))
p1.then(()=> setTimeout(console.log, 0 , 2))
// 1
// 2
p2.then(null, ()=> setTimeout(console.log, 0 , 3));
p2.then(null, ()=> setTimeout(console.log, 0 , 4));
// 3
// 4
p2.catch(()=> setTimeout(console.log, 0, 5))
p2.catch(()=> setTimeout(console.log, 0, 6))
// 5
// 6
p1.finally(()=> setTimeout(console.log, 0, 7))
p1.finally(()=> setTimeout(console.log, 0, 8))
// 7
// 8
```

### 3.7、传递解决值和拒绝期约

期约状态落定后，会提供解决值或拒绝理由给相关的处理程序。

在执行函数中，**解决的值**和**拒绝的理由**分别作为`resolve`和`reject`的第一个参数往后传递。再将这些值传给他们各自的处理程序。

```js
// 传递解决值和拒绝的理由
let p1 = new Promise((resolve,reject)=> resolve('sans'));
p1.then((value)=> console.log(value));  // sans
let p2 = new Promise((resovle, reject) => reject('hw'))
p2.catch((reason)=> console.log(reason) ) // hw
```

`Promise.resolve()`和`Promise.reject()`在调用时就会接受解决值和拒绝理由。同样的他们返回的期约会像执行器一样传递给相应的处理程序

```js
// 通过 promise.resolve 和 promise.reject 传递解决值或拒绝理由
let p1 = Promise.resolve('sans')
p1.then(value => console.log(value))
// sans
let p2 = Promise.reject('hw')
p2.catch(reason => console.log(reason))
// hw
```

### 3.8、拒绝期约与拒绝报错处理

拒绝期约类似于`throw()`表达式，都表示一种**程序状态**，即需要中断或者特殊处理。

在期约的执行函数或者处理程序中**抛出错误**会导致拒绝，对应的错误对象会成为拒绝的理由。

```js
// 在执行函数或处理程序中抛出错误会导致拒绝，对应的对象会成为拒绝的理由
let p1 = new Promise((resolve, reject) => {
    reject(Error('sans'))
});
let p2 = new Promise((resolve,reject)=> {throw Error('sans')})
let p3 = Promise.resolve().then(()=> { throw Error('sans')})
let p4 = Promise.reject(Error('sans'));
// 错误导致拒绝
let p5 = Promise.resolve().then(()=> {  Error('sans')})

setTimeout(console.log, 0, p1); // Promise <rejected>: Error: sans
setTimeout(console.log, 0, p2); // Promise <rejected>: Error: sans
setTimeout(console.log, 0, p3); // Promise <rejected>: Error: sans
setTimeout(console.log, 0, p4); // Promise <rejected>: Error: sans
setTimeout(console.log, 0, p5); // Promise {<fulfilled>: undefined}
```

同时也抛出了4个错误的**栈追踪对象**

```js
Uncaught (in promise) Error: foo 
 at Promise (test.html:5) 
 at new Promise (<anonymous>) 
 at test.html:5 
Uncaught (in promise) Error: foo 
 at Promise (test.html:6) 
 at new Promise (<anonymous>) 
 at test.html:6 
Uncaught (in promise) Error: foo 
 at test.html:8 
Uncaught (in promise) Error: foo 
 at Promise.resolve.then (test.html:7) 
```

所有错误都是**异步抛出**且未处理的，通过错误对象捕获的**栈追踪**信息展示了错误发生的路径。

其中`Promise.resovle.then()`的错误最后才出现，因为其需要在**运行时消息队列**中**添加**处理程序；也就是说，在最终**抛出未捕获错误**之前还会创建另一个期约

<mark>异步错误的副作用</mark>

正常情况下，通过`throw()`关键字抛出错误时，`JS`运行时的**错误处理机制**会**停止**执行抛出错误之后的任何命令。

```js
// 异步错误的副作用 通过throw()关键字抛出的错误，通常情况下
// JS运行时的错误处理机制不会执行抛出错误后的任何指令
throw Error('sans');
console.log('foo');  // 不会执行这一行
// Uncaught Error: sans
```

但在期约中抛出错误时，错误实际上是在**消息队列**中异步抛出的，所以并不会**阻止**运行时继续执行**同步命令**

```js
// 期约抛出错误时，是在消息队列中异步抛出的 并不会阻止运行时继续执行同步代码
Promise.reject(Error('sans'))
console.log('bar'); // bar
// Uncaught Error: sans
```

<mark>异步错误只能够通过**异步**的`onReject`处理程序捕获</mark>

```js
// 正确
Promise.reject(Error('foo')).catch(e => {})
// 错误
try{
    Promise.reject(Error('foo'))    
}catch(e){

}
```

<mark>执行函数中的错误，在解决或拒绝期约之前，仍然可以使用`try/catch`捕获</mark>

```js
//执行器函数中的错误 在期约解决或拒绝之前，仍然可以使用 try/catch 进行错误捕获
let p = new Promise((resolve, reject)=> {
    try {
        throw Error('foo')
    }catch (e){
    console.log(e); // Error: foo
    }
    resolve('sans')
})
setTimeout(console.log, 0, p)  // Promise {<fulfilled>: "sans"}
```

`then()`和`catch()`的`onReject`处理程序在语义上相当于`try/catch`。都是捕获错误之后他将其隔离，不影响正常逻辑的执行。

因此，`onReject`处理程序的任务是在捕获异步错误之后返回一个**解决**的期约。

```js
// then() 和 catch()在语义上类似于 try/catch 都是捕获错误然后进行隔离，且不影响正常逻辑
// 因此 onReject 处理程序的任务是捕获异步错误之后返回一个解决的期约
console.log('begin sync execution');
try{
    throw Error('sans')
}catch (e){
    console.log('caught error', e);
}
console.log('continue sync execution');
// begin sync execution
// caught error Error: sans
// continue sync execution

new Promise((resolve,reject)=> {
    console.log('begin sync execution');
    reject(Error('sans'))
}).catch(e => {
    console.log('caught error', e);
}).then(()=> {
    console.log('continue asynchronous execution');
})
// begin sync execution
// caught error Error: sans
// continue sync execution
```

## 4、期约连锁和期约合成

p338

**怎样将多个期约组合在一起？**

期约组合有两种方式实现：**期约连锁**和**期约合成**。

- 期约连锁：期约一个接一个进行拼接；

- 期约合成：将多个期约组合为一个期约；

### 4.1、期约连锁

**什么是期约连锁？**

将每个期约串联起来的编程方式，并且每个**期约实例**方法（`then()、catch()和finally()`）都会返回一个**新的**期约对象。而该新期约又有自己的**实例方法**。这种连缀方法调用就可以构成所谓的**期约连锁**

```js
let p = new Promise((resolve, reject)=> {
    console.log('first');
    resolve()
})
p.then(() => console.log('second'))
.then(() => console.log('third'))
.then(() => console.log('fourth'));
// first
// second
// third
// fourth
```

这个实现最终执行了一连串**同步**任务

真正执行**异步**任务，需要每个执行器都返回一个期约实例。

```js
let p1 = new Promise((resolve, reject)=> {
    console.log('p1 executor');
    setTimeout(resolve,1000)
})
p1.then(()=>
    new Promise((resolve,reject)=> {
    console.log('p2 executor');
    setTimeout(resolve, 1000)
    })
).then(()=>
    new Promise((resolve ,reject)=> {
    console.log('p3 executor');
    setTimeout(resolve, 1000)
    })
).then(()=>
    new Promise((resolve,reject)=> {
    console.log('p4 executor');
    setTimeout(resolve, 1000)
    })
)
// p1 executor（1 秒后）
// p2 executor（2 秒后）
// p3 executor（3 秒后）
// p4 executor（4 秒后）
```

通过工厂函数生成

```js
// 将期约生成的代码提取到工厂函数中
function delayedResolve(str){
    return new Promise((resolve,reject)=> {
    console.log(str);
    setTimeout(resolve,1000)
    })
}
delayedResolve('p1 executor')
    .then(()=> delayedResolve('p2 executor'))
    .then(()=> delayedResolve('p3 executor'))
    .then(()=> delayedResolve('p4 executor'))
// p1 executor（1 秒后）
// p2 executor（2 秒后）
// p3 executor（3 秒后）
// p4 executor（4 秒后）
```
