---
title: 函数
tags:
- js
- 对象 
- 函数
categories:
- 笔记 
date: 2021-04-12
---

:::tip

函数实际上是对象，每个函数都是`Function`类型的实例，而`Function`也有属性和方法，跟其他引用类型一样。因为函数时对象，所以**函数名**就是**指向函数对象**的**指针**，不一定与函数本身紧密绑定。

:::

函数的定义方式：

1. 函数声明：
   
   ```js
   function sum(num1, num2){
       return num1 + num2
   }
   ```

2. 函数表达式:
   
   ```js
   let sum = funtion(num1, num2){
       return num1 + num2;
   }
   ```

3. 箭头函数：
   
   ```js
   let sum = (num1, num2)=> {
       return num1 + num2
   }
   ```

4.    使用`Funtion` 构造函数 ：
   
   最后一个参数会被当做函数体，其他参数为函数新函数的参数。
   
   ```js
   let sum = new Funtion('num1','num2', 'return num1 + num2')
   // 不推荐
   ```

  不推荐的原因：会被解释两次，第一次当做常规的`ECMAScript`代码，第二次是解释传给构造函数的字符串，会影响性能。
