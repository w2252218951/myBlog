**本篇文章中的防抖和节流方法均已添加进[Jsutl](http://jsutil.gykeji.com/)，该库为一个功能性的函数库，欢迎大家引入和Star。**

### 防抖及节流的个人理解

**函数防抖**和**函数节流**在面试中都是老生常谈的问题，那么今天就让我来说说自己对这两个概念的理解吧。

#### 函数防抖的概念和例子

##### **函数防抖（debounce）**

> **所谓的防抖，实际上就是在触发事件n秒后，才执行回调函数，如果在这n秒内又重新触发了事件，则重新计时**

举个栗子：

```js
// 模拟接口请求
const request = (val) => {
    setTimeout(() => {
        console.log('request:', val);
    }, 100)
}

let $normalInput = document.getElementById("normalInput")

$normalInput.addEventListener("input", (e) => {
    request(e.target.value)
})
```

![](C:\Users\14997\Pictures\normal-input.gif)

上面展示的是我们正常情况下在`input`框内输入内容后请求接口的行为，可以看到每当我们输入一个内容就会请求一次接口。这样无疑照成了资源的浪费，加大了服务器的压力。

这个时候我们是不是可以考虑，在用户输入一个完整的内容后，再请求服务器资源呢？

**答案是：当然可以！防抖（debounce）可以完美的解决这一痛点**

上案例：

```js
// 模拟接口请求
const request = (val) => {
    setTimeout(() => {
        console.log('request:', val);
    }, 100)
}

const debounceFn = function (fn, delay, immediate) {
    let timer;
    return (args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
             fn(args);
        }, delay);
    };
};
let $debounceInput = document.getElementById("debounceInput")
let debounceInput = debounceFn(request, 1000)
$debounceInput.addEventListener("input", (e) => {
    debounceInput(e.target.value)
}) 
```

该函数为**非立即执行版本**，可以看到具体效果如下：

<img src="file:///C:/Users/14997/Pictures/noImmediateDebounce.gif" title="" alt="" width="563">

可以看到当我们频繁输入的时候，并没有发送请求，直到停止输入后，等待我们设置的间隔时间后再执行函数。

既然有**非立即执行版本**，那么也就意味着有**立即执行版本**，代码如下：

```js
let num = 0
// 模拟接口请求
const request = () => {
    num++
    console.log(num);
}
// 立即执行版本
const debounceFn = function (fn, delay) {
    let timer;
    return (args) => {
        // 每次执行防抖函数都清除定时器
        if (timer) clearTimeout(timer);
         // 判断防抖函数中的定时器是否在等待执行的时间间隔内
        const callNow = !timer
        timer = setTimeout(function () {
          // 等待间隔时间后将定时器id置为null
          timer = null
        }, delay);  
        // 如果没有设置定时器就立即执行
        if(callNow) {
           fn(args)
        }
    };
};
let $debounceButton = document.getElementById('debounceButton')
let debounceButtonFn = debounceFn(request, 1500)
$debounceButton.addEventListener('click', (e) =>{
    debounceButtonFn()
})

```

![](C:\Users\14997\Pictures\debounceButton.gif)

此方法适用于按钮点击时，可以看到只有我们第一次点击按钮时才触发了打印事件，当我们在间隔时间内反复的触发事件时，是不会触发打印事件的。

试着将**非立即执行和立即执行版本合并**

**该防抖函数存放在[Jsutil](http://jsutil.gykeji.com/),欢迎访问使用。**

```js

/**
 * @desc 函数防抖
 * @param fn 执行函数
 * @param delay 延迟执行的毫秒数
 * @param immediate 是否立即执行
 */
const _Debounce = (fn, delay, immediate) => {
    let timer;
    return (args) => {
        if (timer)
            clearTimeout(timer);
        // 立即执行
        if (immediate) {
            const callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            if (callNow) {
                fn(args);
            }
        }
        else {
            timer = setTimeout(() => {
                fn(args);
            }, delay);
        }
    };
};

```

> **个人理解： 函数的防抖就好比游戏中的技能施法读条，等到读条结束后就释放技能，但在读条的过程中重复释放技能的话，又会重新进行读条。**

---

#### 函数节流的概念和例子

##### 函数节流（throttle）
