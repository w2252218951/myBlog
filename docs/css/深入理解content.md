---
title: 深入理解content
tags:
- CSS 
categories:
- CSS 
date: 2021-03-30
---

## 1、content与替换元素

什么是替换元素？

根据是否可替换内容，将元素分为<mark>替换元素</mark>和<mark>非替换元素</mark>

<mark>修改某个属性值呈现的内容就能被替换的元素，被称为**可替换元素**</mark>

**替换元素的特性**

1. 内容的外观不受页面上的`css`影响

2. 有自己的尺寸。大部分替换元素的默认尺寸为 300像素*150像素，如`video、iframe、canvas`,少部分为0，如`img`

3. 在很多`css`属性上有自己的表现规则。

！！**替换元素尺寸计算规则**

替换属性的尺寸从内而外分为三类：<mark>固有尺寸、HTML尺寸、CSS尺寸</mark>

1. 固有尺寸：固有尺寸是替换内容本身就具有的尺寸；

2. HTML尺寸：是一个抽象概念，只能通过`HTML`原生属性修改;
   
   ```html
   <img src=''  width='300' height='100'>
   ```

3. CSS尺寸：可以通过`CSS`的`width、height`进行修改的尺寸，对应盒尺寸中的`content-box`

作用优先级： `CSS`尺寸 > `HTML`尺寸 >  固有尺寸

<mark>异步加载图片策略</mark>

```html
<img >  <!-- 不要设置src 因为src即使 ="" 依然会请求当前页面数据 -->
<style>
img{
    visibility: hiden;
}
img[src] {
    visibility: visible
}
</style>
```

 当图片`src`属性缺省的时候，图片不会有任何请求，是最高效的实现方式。

<mark>`src`属性缺省兼容火狐浏览器</mark>

```css
img {
    display: inline-block; 
}
```

**替换元素的重要特性：**

无法改变替换元素内容的固有尺寸

**图片受宽高影响的原因：**

图片中的`content`替换内容默认的适配方式是**填充**`fill`。也就是尺寸变化的本质并不是改变固有尺寸，而是采用**填充**作为适配`HTML`尺寸和`CSS`尺寸的方式。

### 基于伪元素的图片内容生成技术

p52  4/1-2

原理：`FireFox`在没有替换内容并且`Chrome`在此基础上有不为空的`alt`属性值，那么替换元素就会被当做**内联标签**

想要该特性生效的技术点

1. 不能有`src`属性（关键点所在）

2. 不能使用`content`属性生成图片；（`chrome`）

3. 需要拥有`alt`属性并有值； （`chrome`）

4. `Firefox`下：`before`伪元素的`content`值会被无视，`after`无此问题。

核心代码

```css
img:after: {
    /*生成的alt信息*/
    content: attr(alt);
    /*尺寸和定位*/
    position: absolute; bottom:0;
    width: 100%;
    background-color:rgba(0,0,0,0.5);
    transform: translateY(100%);
    /* 动效*/
    transition: transform .2s
}
img:hover::after{
    transform,: translateY(100%)
}
```

<mark>可以通过修改`content`属性，将普通标签变成替换标签</mark>：

推荐使用`svg`，该方法能够增强`SEO`

### content与替换元素关系

将`content`属性生成的对象叫做：**匿名替换元素**

其生成内容与普通内容的区别：

1. `content`生成的文本是无法被**选中、复制**的，如果`user-select:none`，同时无法被设备读取`SEO`不友好，<mark>以此：`content`属性，用来生成一些无关紧要的内容</mark>

2. 不能左右`empt`伪类：通过`content`生成的属性不算内容，`empty`依旧会认为是无内容

3. `content`动态生成值无法获取。

### content内容生成技术

1. `content`辅助元素生成
   
   ```css
   .element:after{
       content:''
   }
    /* 清除浮动 */
   .clear:after: {
       content: '';
       clear: both;
       display: block
   }
   ```

2. `content`字符内容生成
   
   `content`中除了常规字符外，还可以插入`Unicode`字符

```html
<div>正在加载<dot>...</dot></div>
<style>
/*首先设定好高度和限制只在第一行显示*/
.dot{
    display: inline-block;
    height: 1em;
    line-height: 1;
    text-align: left;
    overflow: hidden;
    vertical-aligin: -.25em    
}
/*通过content 替换元素替换原有的内容 并且 通过pre解析字符*/
.dot::before{
    content: '...\A..\A.';
    whtie-space: pre;
    animation: dot 3s infinite step-strat both;
    display: inline-block;
}
@keyframes dot{
    33% {transform : translateY(-2em)};
    66% {transform : translateY(-1em)}
}
</style>
```

3. `content`图片内容生成
   
   直接用`url`功能符显示图片。 图片地址可以是常见的`png\jpg格式，还可以是icon图片、svg文件以及base64URL地址`。<mark>不支持`C3`渐变背景图</mark>
   
   通过`content:url`生成的图片使用场景并不多，因为设置的宽高无法改变图片的固有尺寸。更多的是使用`background-image`

4. `content开启闭合符号生成` `open-quote`和`close-quote`

5. `content` `attr`属性值内容生成
   
   通过在`content`中使用`attr()`获取`HTML`的属性
   
   ```css
   img{
       content: attr(alt);
   }
   .icon {
       content: attr(data-title)
   }
   ```

6. 深入理解`content`计数器
   
   三个关键点：两个属性（`counter-reset和counter-increment`）和一个方法（`counter() counters`）
   
   ```html
   <p class='counter'></p>
   <style>
   .counter{
     counter-reset: sans  /*默认为0*/
     counter-increment: sans /*值为reset的一个或多个关键字 默认为1*/  
   }
   .counter:before{
       content: counter(sans);
       /*counter-increment: sans  可以直接设置在伪元素上*/
   }
   </style>
   ```
   
   1. `counter-reset`:**计数器-重置**，只要作用是给计数器命名。默认是0 不是1。在`chrome`中，小数点向下取整。可以设置为**负数**，也可以设置为`none`(取消重置)
      
      和`inherit`（继承重置）；
   
   2. `counter-increment`:**计数器递增**，值为`counter-reset`的1个或多个关键词，后面跟随的数字表示每次计数的变化值。默认为1
      
      计数规则—普照规则：普照源`counter-reset`唯一，每普照`counter-increment`一次，普照源增加一次**计数值**；
      
      当**父元素**和**子元素**都被普照的时候，就是普照两次，在普照源上增加两次计算值。
      
      计数器数值的变化遵循`HTML`渲染机制，遇到一个`increment`计数器就会变化。可以通过空格区分
      
      ```css
      .xxx{
          counter-reset: sans 1 hw 3;
          counter-increment: sans hw;
      }
      ```
   
   3. `counter()/cunters()`:这是**方法**，不是属性。用于显示计数。
      
      
      
      
      ```html
      <!-name counter-reset的名称 style 支持的是list-style-type的值-->     
      counter(name, style)
      ```
      
      一个`content`属性值可以有多个`counter`方法
      
      ```css
      .counter:before{
          content: couter(sans) '\A' counter(hw);
          white-space: pre; /*content生成字符串然后通过 pre 解析换行*/
      }
      ```
      
      `counters()`基本用法：`counters(name,string)`
      
      `string`参数为字符串**需要引号包围的，是必需参数**。表示子序号的连接字符串。例如：1.1的`string`就是`.`。
      
      
      要想实现嵌套，必需让每一个列表容器拥有一个普照源，通过子辈对父辈的`counter-reset`重置，配合`counters`方法实现嵌套
      
      <mark>一个容器里的普照源是唯一的</mark>

7. `content`内容生成的混合特性
   
   将`content`内容生成语法混合在一起使用
   
   ```css
   a:after{
       content: "("  attr(href) ")"
   }
   q:before{
       content: open-quote url(1.jpg)
   }
   .counter{
       content: counters(sans, '-') '.'
   }
   ```
