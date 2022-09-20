---
title: 异步编程
tags:
- js
- promise
categories:
- 笔记
date: 2021-05-19
---

`ES6`新增了正式的`Promise(期约)`引用类型，支持优雅的定义和组织异步逻辑。

接下来几个版本使用了`async、await`关键字定义异步函数的机制。

## 异步编程

p322

同步行为和异步行为在计算机科学中是一种对立统一的概念。

在`JS`这种**单线程事件循环**中，**同步和异步**操作是代码**依赖**的**核心**机制。

<mark>**异步操作**是为了优化**计算量大**而**时间长**的操作，并且不想等待某个异步操作阻塞线程执行，也可以使用</mark>

### 1、同步和异步

**同步行为**：对应内存中顺序执行的处理器指令：**每条**指令都会严格**按顺序**执行，每条指令执**行后**也能**立即获得存储**在本地（寄存器和系统内存）的信息

```js
let x  = 3;
x = x + 4;
```

操作系统在**栈内存**上分配了一个**存储浮点数值**的**空间**，然后针对这个值做一次**数学计算**，再把计算的结果**返回**之前**分配的内存**中。

**异步行为：** 类似于系统中断，即当前**进程外部**的**实体**可以**触发代码**执行。

为什么异步操作是必要的？

因为强制进程等待一个长时间的操作是不可行的（同步操作必须要等）。如果代码要访问一些高延迟的资源。例如远程服务器发送请求并等待响应，就会出现长时间的等待。

```js
let x = 3;
setTimeout(()=> x = x + 4, 1000);
```

执行线程不知道`x`值何时会被改变，因为这取决于回调何时从消息队列出列并执行。

第二个指令块（加操作和赋值操作）是有系统计时器触发的，会生成入队执行的中断，何时中断对`JS`运行时来说就是一个黑盒，因此实际上无法预知（可以保证发生在当前线程的同步代码执行之后，否则回调都没有机会出列被执行）。基本没有办法知道在判定回调后系统状态何时变化。

## 2 、以往的异步编程模式

p 323

异步行为是`js`的**基础**。早期的`js`中，只支持定义**回调函数**来表明异步操作。串联了多个异步操作的问题需要通过**深度嵌套的回调函数**(俗称“回调地狱”)解决。

```js
function double(value){
    setTimeout(()=> setTimeout(console.log, 0, value * 2), 1000)
}
double(3)  // 6
```

`setTimeout`可以定义一个在**指定时间**之后被**调度执行**的回调函数。

对于这个例子而言，1000毫秒后，`js`运行时会将**回调函数**推倒自己的**消息队列**上去等待执行。推倒队列后，回调什么时候出列被执行对`js`代码而言完全不可见了。并且`double()`在`setTimeout`成功调度异步操作后会立即退出。

### 2.1、异步返回值

```js
function double(value, callback){
    setTimeout(()=> callback(value * 2), 1000)
}
double(3, (x)=> console.log(x))
// 6 (1000毫秒后)
```

`setTimeout`告诉`JS`**运行时**在1000毫秒后把一个函数推倒**消息队列**中。这个函数会在运行时负责**异步调度**执行，位于**函数闭包**中的回调及其参数在异步执行时仍然可用。

### 2.2、失败处理

成功回调和失败回调

```js
// 异步失败处理
function double(value,success, failed){
    setTimeout(()=> {
        try {
            if(typeof  value !== 'number'){
                throw 'Must provide number as first arg'
            }
            success(2 * value)
        }catch (e){
            failed(e)
        }
    }, 1000)
}

const successCallback = (x) => console.log(`Success:${x}`);
const failedCallback = (x) => console.log(`Failed:${x}`);
double(3, successCallback, failedCallback);
double('a',successCallback, failedCallback)
// Success:6   1000 毫秒后
// Failed:Must provide number as first arg      1000 毫秒后
```

但是上述模式是不可取的，因为必须在初始化异步操作时定义回调。异步函数的返回值只能够在短时间内存在，只有预备好将这个短时间内存在的值作为参数的回调才能接受到它。

### 2.3、嵌套异步操作

如果异步返回值又依赖于另一个依赖，那么就会出现如下的情况。

```js
// 嵌套异步操作
function double(val, success, failed){
    setTimeout(()=> {
        try {
            if(typeof val !== 'number'){
                throw 'Must provide number as first arg'
            }
            success(2 * val)
        }catch (e){
            failed(e)
        }
    }, 1000)
}
const successCallback = (x) => {
    double(x, (y)=> console.log(`Success:${y}`))
}
const failedCallback = (e) => console.log(`Failed:${e}`)
double(3, successCallback, failedCallback)
// Success:12
```

显然，随着代码越来越复杂，回调策略是不具有扩展性的。“回调地狱”这个称呼可谓名至实归。
嵌套回调的代码维护起来就是噩梦。
