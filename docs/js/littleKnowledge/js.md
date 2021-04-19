---
title: 小知识
tags:
- js
  categories:
- 数组
- 日常
  date: 2021-04-19
---

## 1、JS中`Array.apply(null,Array(3))`与`Array(3)`的区别是什么？

思考：Array.apply(null,Array(3)) , 为何不直接使用new Array(3)？

```js
let a = new Array(3);
// 此处单纯是是一个长度为3的数组，其内在并没有被赋值
console.log(a); // [empty x 3]

let a1 = a.map(i => {
    return 'sans';
})
console.log(a1); // [empty x 3]
```

上述`a1`返回的仍然是`[empty x 3]`,这涉及到` Array.prototype.map()`的特性

:::tip

`map`方法会给原数组中的每个元素按顺序调用以此`callback`函数。`callback`每次执行后的返回值（包括`undefined`）组合起来一个新数组。`callback`函数**只会**在**有值的索引**上被调用；<mark>从来**没有被赋值**或者**使用`delete`删除的索引**则**不会被调用**</mark>

:::

```js
let b = Array.apply(null, Array(3));
console.log(b);  // [undefined, undefined, undefined]
let c = Array.apply(null, [undefined, undefined, undefined]);
console.log(c);  // [undefined, undefined, undefined]
let d = Array(undefined,undefined,undefined);
console.log(d);  // [undefined, undefined, undefined]
```

使用`Array.apply(null, Array(3))`实际上相当于`Array.apply(null,[undefined,undefined,undefined])`，也就是`Array(undefined,undefined,undefined)`

在Vue官方文档中有一段关于`Array.apply(null, {length： 20})`的`{length: 20}`实际上是一个可迭代的对象，是个类数组对象。

```js
let a = Array.apply(null, {length: 20});
console.log(a); // [undefined * 20];

let b = Array({length: 20});
// 此处是在索引为0的位置传入了一个 长度为20的空数组
console.log(b); // [[empty * 20] ]
```

在`ES6`中新增了扩展操作符，对可迭代对象使用该操作符，可将其作为参数传入，将可迭代对象进行拆分，将迭代返回的每个值单独传入。

```js
let a = Array.apply(null, Array(3));
console.log(a); //   [undefined, undefined, undefined
let b = Array(...Array(3));
console.log(b); //   [undefined, undefined, undefined
```
