---
title: 异步函数(async/await)
tags:
- js
- promise
categories:
- 笔记 
date: 2021-06-28
---

异步函数，也被称为`async/await(语法关键词)`,是在`ES8`规范新增的。该特性从行为和语法上都增强了`JS`,**能够以同步方式书写，异步执行**

### `async/await`产生的原因？

传统的`Promise`,如果程序中的其他代码要在这个值可用是进行访问，则需要添加一个解决处理程序

```js
    // 当程序中的其他代码需要在这个值可用是进行访问，则需要设置解决处理程序
    let p = new Promise((resolve,reject)=> setTimeout(resolve,1000, 3))
    p.then((x)=> console.log(x)) // 3
```

虽然可以定义一个处理函数但是作用不大。

```js
function handler(x) { console.log(x); }
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
p.then(handler); // 3
```

## 1、异步函数

p 348

ES8的`async/await`旨在**解决利用异步结构组织代码的问题**

### 1.1、async

`async`关键词用于声明**异步函数**，可用在**函数表达式，函数声明、箭头函数和方法上**

```js
// async 关键词用法
async function  p1(){}
let p2 = async function(){}
let p3 = async ()=> {}
class p4  {
    async qux(){}
}
```

`async`关键词可以让函数有**异步特性**，但总体上其代码仍然是**同步**取值的。

<mark>在参数或者闭包方面，异步函数仍有普通`js`函数的正常行为</mark>

```js
// async 关键词可以让函数具有异步特性 但是其代码还是同步执行的
// 并且在参数和闭包方面任具有普通函数的正常行为
async function foo(){
    console.log(1);
}
foo()
console.log(2);
// 1
// 2
```

异步函数始终**返回期约对象**，如果使用`return`关键词（没有`return`则返回`undefined`） ，则会通过`Promise.resolve`包装成一个期约对象

```js
// 异步函数始终返回一个期约对象，如果是用return关键词则返回这个 promise.resolve 关键词包装的对象
// 没有return 则返回 undefined
async function foo(){
    console.log(1);
   // return 3
   // 也可以直接返回一个期约
    return Promise.resolve(3)
}
// 给返回的期约添加一个解决处理程序
foo().then(res=> console.log(res))
console.log(2);
// 1
// 2
// 3
```

异步函数的返回值期待（但实际上并不要求）一个实现 thenable 接口的对象，但常规的值也可以。如果返回的是实现 `thenable` 接口的对象，则这个对象可以由提供给 `then()`的处理程序“**解包**”。如果不是，则返回值就被当作已经解决的期约。

```js
// 返回一个原始值 
async function foo() {
    return 'foo';
}
foo().then(console.log);
// foo
// 返回一个没有实现 thenable 接口的对象
async function bar() {
    return ['bar'];
}
bar().then(console.log);
// ['bar']
// 返回一个实现了 thenable 接口的非期约对象
async function baz() {
    const thenable = {
    then(callback) { callback('baz'); }
};
return thenable;
}
baz().then(console.log);
// baz 
// 返回一个期约
async function qux(){
    return Promise.resolve('qux')
}
qux().then(console.log)
// qux
```

在异步函数中**抛出错误**同样会返回**拒绝的期约**

```js
async function foo(){
    console.log(1);
    throw 3;
}
foo().catch(console.log)
console.log(2)
// 1
// 2
// 3
```

但是**拒绝的期约的错误**不会被异步函数捕获，如果加个`await`就能被捕获

```js
async function foo(){
    console.log(1)
    Promise.reject(3)
}
// Attach a rejected handler to the returned promise 
foo.catch(console.log)
console.log(2)
// 1 
// 2 
// Uncaught (in promise): 3 
```

### 1.2、await

p 350

异步函数主要针对的是不会马上执行完成的任务，所以需要一种**暂停和恢复**完成的能力。

通过使用`await`关键词可以**暂停异步函数代码**的执行，等待期约解决

```js
let p = new Promise.resolve((resolve,reject)=> 
setTimeout(console.log,1000, 3))
p.then((x)=> console.log(x)) // 3
```

使用`async/await`可以写成

```js
// 通过 async/await 可以写成
async function foo(){
    let p = new Promise((resolve,reject)=> {
        setTimeout(resolve,1000,3)
    })
    // 暂停异步函数 等待期约解决
    console.log(await p)
}
foo() // 3s后 3
```

`await`关键词同样是尝试“解包”对象的值，然后这个值传给表达式，再异步恢复异步函数的执行。

`await`可以单独使用，也可以在表达式中使用

```js
// await 使用场景
async function foo(){
    console.log(await Promise.resolve('foo'))
}
foo() // foo


async function bar(){
    // 此时相当于 返回的是 Promise.resolve('bar')
    return await Promise.resolve('bar')
}
bar().then(console.log) // bar

async function baz(){
    // 暂停异步代码的执行，等到期约解决后再执行
    await new Promise((resolve,reject)=> setTimeout(resolve,1000))
    console.log('baz')
}
baz() // baz（1000 毫秒后
```

`await` 关键字期待（但实际上并不要求）一个实现` thenable `接口的对象，但常规的值也可以。如果是实现` thenable` 接口的对象，则这个对象可**以由` await `来“解包”**。如果不是，则**这个值就被当作已经解决的期约**。

```js
// 如果是实现thenable接口的对象，则这个对象可以由await解包，如果不是就返回已解决的期约
// 等待一个原始值
async function foo() {
    console.log(await 'foo');
}
foo();
// foo
// 等待一个没有实现 thenable 接口的对象
async function bar() {
    console.log(await ['bar']);
}
bar()
// ['bar']

// 等待一个实现了 thenable 接口的非期约对象
async function baz() {
const thenable = {
    then(callback) { callback('baz'); }
    };
    console.log(await thenable);
}
baz();
// baz
// 等待一个期约
async function qux() {
console.log(await Promise.resolve('qux'));
}
qux();
// qux
```

等待抛出错误的同步操作，会返回拒绝的期约

```js
// 等待会抛出错误的同步操作，会返回拒绝的期约
async function foo(){
    console.log(1);
    await (()=> {throw  3})()
}
// 给返回的期约添加一个拒绝处理程序
foo().catch(err => console.log(err))
console.log(2);
// 1
// 2
// 3
```

单独的`Promise.reject()`不会被异步函数捕获，而会抛出错误。对拒绝的期约使用`await`则会释放（**unwrap**）错误值（将拒绝期约返回）

```js
async function foo(){
    console.log(1);
    Promise.reject(3)
    console.log(4);
}
foo().catch(console.log)
console.log(2);
// 1
// 4
// 2
// Uncaught (in promise) 3
```

```js
async function foo(){
    console.log(1);
    await Promise.reject(3)
    console.log(4);
}
foo().catch(console.log)
console.log(2);
// 1
// 2
// 3
```

### 1.3、`await`的限制

:::

    `await`关键词必须在**异步函数中**使用，不能在**顶级上下文**如`<script>`标签和模块中使用，但是能通过`IIFE`调用是没问题的。

:::

```js
// await 关键词必须在异步函数中使用 ，不能在顶级上下文中使用，但是能通过IIFE使用
async function foo(){
    console.log(await Promise.resolve(3))
}
foo()
// 3
// 相当于  立即调用的异步函数表达式
    (async function(){
        console.log(await Promise.resolve(3))

    })()
// 3
```

`await`关键词只能直接出现在异步函数的定义中，不会扩展到嵌套函数。

在同步函数内部使用`await`会进行报错

```js
// 异步函数的特性是不会扩展到嵌套函数，同时await也只能直接在异步函数中定义
// 不允许 await 出现在 箭头函数中
function foo(){
    const syncFn = ()=> {
        return await Promise.resolve('foo')
    }
console.log(syncFn());
    //Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules
}
// 不允许await 出现在同步函数声明中
function bar(){
    function syncFn(){
        return await Promise.resolve('bar')
    }
    console.log(syncFn());

}
// 不允许await出现在同步函数表达式中
function bar(){
    const syncFn = function(){
        return await Promise.resolve(3)
    }
    console.log(syncFn());
}
// 不允许： IIFE使用同步函数表达式或者箭头函数
function qux(){
    (function() {console.log(await Promise.resolve('qux'))})()
    (()=> console.log(await Promise.resolve('qux')))()
}
```

## 2、停止和恢复执行

p353

```js
async function foo() {
    console.log(await Promise.resolve('foo'));
}
async function bar() {
    console.log(await 'bar');
}
async function baz() {
    console.log('baz');
}
foo();
bar();
baz();
// baz
// bar
// foo
```

`async/await`中真正起作用的就是`await`。<mark>`async`仅仅只是个标识符</mark>，因为异步函数如果不包含`await`关键词，其执行上跟普通函数没什么区别。

```js
// async 仅仅是个表示符 如果异步函数没有await，则执行上和普通函数没什么区别
async function foo(){
    console.log(2);
}
console.log(1);
foo()
console.log(3);
// 1
// 2
// 3
```

`JS`运行时在碰到`await`关键字时，会记录是在哪里**暂停执行**。等到`await`右边的值可用了，`JS`运行时会向消息队列推送一个任务，这个任务会恢复异步函数的执行。

即使`await`后面跟着一个立即可用的值，函数的其余部分也会被**异步**求值。

```js
// js运行时在遇到await关键字时，会记录在哪儿暂停执行，等到await右边的求值完，
// 再向消息队列推送一个任务，用以恢复异步函数的执行。
async function foo() {
    console.log(2);
    await null;
    console.log(4);
}
console.log(1);
foo();
console.log(3);
// 1
// 2
// 3
// 4
```

运行过程：

1. 打印1

2. 调用异步函数`foo()`

3. 在异步函数`foo()`中打印 2；

4. （在`foo()`中）`await`关键词暂停执行，为立即可用的值`null`向消息队列添加一个任务

5. `foo()`中退出

6. 打印 3

7. 同步线程中的代码执行完毕

8. `JS`运行时从**消息队列**中取出任务，恢复**异步函数**的执行。

9. （在`foo`中）恢复执行，`await`取得`null`值。

10. （在`foo`中）打印4

11. `foo()` 返回

如果`await`后面跟上一个期约，为了执行异步函数，实际上会有**两个**任务被添加到**消息队列中**吗，并被异步求值。

:::

C39 对 `await `后面是期约的情况如何处理做过一次修改。修改后，本例中的 `Promise.resolve(8)`只会生成一个异步任务。因此在新版浏览器中，这个示例的输出结果为 123458967。实际开发中，对于并行的异步操作我们通常更关注结果，而不依赖执行顺序。

:::

```js
async function foo(){
    console.log(2);
    console.log(await Promise.resolve(8))
    console.log(9)
}
async function bar(){
    console.log(4);
    console.log(await 6);
    console.log(7)
}

console.log(1);
foo();
console.log(3);
bar();
console.log(5);
// 123458967
```

## 3、异步函数策略

p356

### 3.1、通过异步函数实现`sleep()`

得益于`await`能暂停异步函数的特性

```js
// 通过异步韩式实现 sleep()方法
function sleep(delay){
    return new Promise((resolve,reject)=> setTimeout(resolve, delay))
}
async function foo(){
    const t0 = Date.now();
    // 通过await 等待期约的解决 然后在恢复异步函数的执行
    await sleep(1500);
    console.log(Date.now() - t0)
    // 1501
}
foo()
```

### 3.2利用平行执行
