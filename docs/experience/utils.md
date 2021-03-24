---
title: 工具
tags: 
- utils
categories:
- 工具
date: 2021-03-13
---

## 保证浮点数计算的正确性

**先升幂后降幂**

```js
function add(num1, num2){
    let r1, r2, m;
    // 将传入的数值先转换成字符串 然后通过 . 分割成数组去小数后位数的长度 做幂
    r1 = ('' + num1).split('.').length;
    r2 = ('' + num2).split('.').length;
    //取幂  Math.pow 返回次幂 
    m = Math.pow(10, Math.max(r1, r2));
    return (num1 * m + num2 * m) / m
}
console.log(add(0.1, 0.2)); // 0.3
```
