---
title: CSS常见技巧
tags:
- css
- 技巧
categories:
- 笔记
date: 2021-03-23
---

## outline属性的妙用技巧

```html
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
</ul>
```

```css
 * {
        padding: 0;
        margin: 0;
    }
    ul{
        padding: 0;
        margin: auto;
        list-style: none;
        width: 400px;
    }
    li{
        padding: 10px;
        border: 10px solid red;
        outline-offset: -10px;
    }
    li + li{
        margin-top: -10px;
    }
    li:hover{
        outline:10px solid gold;
    }
```

效果：

<img :src="$withBase('/cssImg/outline.png')" alt="foo">

## 单行和多行溢出处理

```html
<div class="container">
    <p class="single">
        <span>单行溢出：</span>测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据
    </p>
    <p class="multiple">
        <span>多行溢出：</span>测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据
    </p>
</div>
</ul>
```

```css
   .container {
        width: 300px;
        height: 200px;
        margin: 100px;
        padding: 20px;
        border: 1px solid #eee;
        font-size: 13px;
        color: #555;
    }

    .single {
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
    }

    .multiple {
        /*重点，不能用block等其他，将对象作为弹性伸缩盒子模型显示*/
        display: -webkit-box;
        /*从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）*/
        -webkit-box-orient: vertical;
        /*行数，超出三行隐藏且多余的用省略号表示...*/
        -webkit-line-clamp: 3; 
        line-clamp: 3;
        word-break: break-all;
        overflow: hidden;
        max-width: 100%;
    }
```

效果：

<img :src="$withBase('/cssImg/ellipsis.png')" alt="foo">

## 卡券效果制作
```html
<p class="coupon">
    <span>200</span>优惠券
</p>
```
```css
  .coupon {
        width: 300px;
        height: 100px;
        line-height: 100px;
        margin: 50px auto;
        text-align: center;
        position: relative;
        background: radial-gradient(circle at right bottom, transparent 10px, #ffffff 0) top right /50% 51px no-repeat,
        radial-gradient(circle at left bottom, transparent 10px, #ffffff 0) top left / 50% 51px no-repeat,
        radial-gradient(circle at right top, transparent 10px, #ffffff 0) bottom right / 50% 51px no-repeat,
        radial-gradient(circle at left top, transparent 10px, #ffffff 0) bottom left / 50% 51px no-repeat;
        filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, .2));
    }
    .coupon span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        color: red;
        font-size: 50px;
        font-weight: 400;
    }
```
效果:

<img :src="$withBase('/cssImg/coupon.png')">

## 相邻兄弟选择器之常用场景
```html
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
</ul>
```
```css
 ul{
        width: 300px;
        list-style: none;
        margin: auto;
        padding: 0;
        border: 1px solid red;
        text-align: center;
    }
    li + li{
        border-top:1px solid red ;
    }
```
效果：

<img :src="$withBase('/cssImg/brotherSelect.png')" >


## 纯CSS绘制三角形
```html
   <p class="box-model"></p>
    <p class="up-triangle"></p>
    <p class="down-triangle"></p>
```
```css
  *{
        margin: 0;
        padding: 0;
    }
    .box-model {
        height:0px;
        width:0px;
        border-color:#FF9600 #3366ff #12ad2a #f0eb7a;
        border-style:solid;
        border-width:20px;
    }
    .up-triangle{
        width: 0;
        height: 0;
        border-width:0 20px 40px 20px;
        border-style:dashed ;
        border-color: transparent transparent #00adb5  transparent;
    }
    /* 倒三角 */
    .down-triangle {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 40px 20px 0 20px;
        border-color:  #00adb5 transparent transparent transparent;
    }
    p:last-child {
        margin-top: 1rem;
    }
```
效果：

<img :src="$withBase('/cssImg/triangle.png')">

## 虚线框绘制技巧
```html
<p class="dotted-line">庭院深深，不知有多深？杨柳依依，飞扬起片片烟雾，一重重帘幕不知有多少层
```
```css
.dotted-line {
        width: 800px;
        margin: auto;
        padding: 20px;
        border: 1px dashed transparent;
        background: linear-gradient(white, white) padding-box, repeating-linear-gradient(-45deg, red 0, #ccc .25em, white 0, white .75em);
    }
```
效果：

<img :src="$withBase('/cssImg/dotted.png')">


## 设置input占位符样式
```html
<input type="text" placeholder="设置用户名">
```
```css
 input::-webkit-input-placeholder{  /* Chrome/Opera/Safari */
        color:red;
    }
    input::-moz-placeholder{  /* Firefox 19+ */
        color:red;
    }
    input:-moz-placeholder{ /* Firefox 18- */
        color:red
    }
    input::-ms-input-placeholder{ /* IE 10+ */
        color:red;
    }
    input:focus{
        background: red;
    }
    input{
        outline: none;
        border:none;
    }
```
效果：

<img :src="$withBase('/cssImg/inputPlaceholder.png')">

## 隐藏滚动条或更改滚动条样式
```html
<p class="scroll-container">
    庭院深深，不知有多深？杨柳依依，飞扬起片片烟雾，一重重帘幕不知有多少层。豪华的车马停在贵族公子寻欢作乐的地方，她登楼向远处望去，却看不见那通向章台的大路。春已至暮，三月的雨伴随着狂风大作，再是重门将黄昏景色掩闭，也无法留住春意。泪眼汪汪问落花可知道我的心意，落花默默不语，纷乱的，零零落落一点一点飞到秋千外。庭院深深，不知有多深？杨柳依依，飞扬起片片烟雾，一重重帘幕不知有多少层。豪华的车马停在贵族公子寻欢作乐的地方，她登楼向远处望去，却看不见那通向章台的大路。春已至暮，三月的雨伴随着狂风大作，再是重门将黄昏景色掩闭，也无法留住春意。泪眼汪汪问落花可知道我的心意，落花默默不语，纷乱的，零零落落一点一点飞到秋千外。庭院深深，不知有多深？杨柳依依，飞扬起片片烟雾，一重重帘幕不知有多少层。豪华的车马停在贵族公子寻欢作乐的地方，她登楼向远处望去，却看不见那通向章台的大路。春已至暮，三月的雨伴随着狂风大作，再是重门将黄昏景色掩闭，也无法留住春意。泪眼汪汪问落花可知道我的心意，落花默默不语，纷乱的，零零落落一点一点飞到秋千外。庭院深深，不知有多深？杨柳依依，飞扬起片片烟雾，一重重帘幕不知有多少层。豪华的车马停在贵族公子寻欢作乐的地方，她登楼向远处望去，却看不见那通向章台的大路。春已至暮，三月的雨伴随着狂风大作，再是重门将黄昏景色掩闭，也无法留住春意。泪眼汪汪问落花可知道我的心意，落花默默不语，纷乱的，零零落落一点一点飞到秋千外。
</p>
```
```css
 .scroll-container{
        width: 300px;
        height: 150px;
        border:1px solid gold;
        padding: 16px;
        overflow: auto;
    }
    .scroll-container::-webkit-scrollbar{
        width: 8px;
    }
    .scroll-container::-webkit-scrollbar-corner,
        /* 滚动条角落 */
    .scroll-container::-webkit-scrollbar-thumb,
    .scroll-container::-webkit-scrollbar-track{   /*滚动条的轨道*/
        border-radius: 4px;
    }
    .scroll-container::-webkit-scrollbar-corner,
    .scroll-container::-webkit-scrollbar-track {
        /* 滚动条轨道 */
        background-color: #eeeeee;
        box-shadow: inset 0 0 1px rgba(180, 160, 120, 0.5);
    }
    .scroll-container::-webkit-scrollbar-thumb {
        /* 滚动条手柄 */
        background-color: #00adb5;
    }
```
效果：

<img :src="$withBase('/cssImg/scroll.png')">
