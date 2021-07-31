---
title: CSS趣谈
tags:
- CSS趣谈
categories:
- CSS
date: 2021-03-26
---

`border-style`默认为`none`

### 为什么`border`属性的默认宽度大小是`medium`3px？

因为：`border-style:double`想要完全展示必须宽度为`3px`,因为其双边框表现规则为**两边宽度永相等，中间宽度加减一**

<mark>三道杠小技巧</mark>

```css
.icon-menu{
    height:10px;
    width: 50px;
    border-top: 10px double;
    border-bottom: 10px solid;
}
```
