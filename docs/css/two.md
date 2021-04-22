---
title: 块级元素
tags:
- CSS 
categories:
- CSS 
date: 2021-03-30
---

## 流、元素与基本尺寸

### 1、块级元素:

:::tip

块级元素基本特征：在一个水平流上只能单独显示一个元素，多个块级元素则换行。（换行特性）

:::

**清除浮动**

```css
.clear:after{
    content: '';
    display: block;
    clear: both;
}
```

:::tip

`list-item`(附加盒子)生成了一个专门用来存放圆点、数字这些项目的'标记盒子'(mark box)。

iE下不支持用伪元素创建这个盒子

:::
