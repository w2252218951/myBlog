---
title: 温和的padding属性
tags:
- CSS 
categories:
- CSS 
date: 2021-03-30
---

## padding与元素尺寸之间的关系

<mark>内联元素的`padding`在垂直方向同样会影响布局，影响视觉表现</mark>

垂直方向的行为受`line-height`和`vertical-align`影响。

**层叠现象分类**

1. **纯视觉层叠：**  不影响外部尺寸—`box-shadow以及outline`

2. **布局层叠：** 影响外部尺寸: `inline元素的padding`

## padding 的百分值

1. `padding`属性是不支持**负值的**；

2. `padding`支持**百分比**。但是无乱是水平还是垂直都是相对于**宽度**进行计算的

对于内联元素，其`padding`是会断行的。`padding`区域是跟着内联盒模型的**行框盒子**走的。

并且内联元素的垂直`padding`会让幽灵节点`strut`显现，可以通过`font-size:0`解决

### padding与图形绘制

<mark>通过`padding`与`background-clip`属性配合，实现`css`图形绘制效果</mark>

```css
.icon-menu{
  display: inline-block;
  height: 10px;
  width: 140px;
  padding: 35px 0;
  border-top:10px solid;
  border-bottom: 10px solid;
  background: black;
  background-clip: content-box; 
/*设置元素背景是否延伸到边框，内边距盒子，内容盒子下面*/
}
```

## 激进的margin属性

| 尺寸     |                                                         | DOM API                    | 别称     |
| ------ | ------------------------------------------------------- | -------------------------- | ------ |
| 元素尺寸   | 包含`padding、border`就是元素的`border-box`的尺寸                  | `offsetWidth、offsetHeight` | 元素偏移尺寸 |
| 元素内部尺寸 | 元素内部区域尺寸，包含`padding`但不包含`border`:也就是`paddingbox`的尺寸     | `clientWidth、clientHeight` | 元素可视尺寸 |
| 元素外部尺寸 | 表示元素的外部尺寸，包括`padding、border、还有margin` : `margib-box`的尺寸 | 无                          | 无      |

### margin与元素的内部尺寸

当元素设置了`widht`或者保持包裹性的时候，`margin`对尺寸没有影响。只有元素是**充分利用可用空间**状态的时候，`margin`才会改变元素的可视尺寸。

对于普通流体元素，`margin`只能改变元素水平方向的尺寸，对具有拉伸特性的绝对定位元素，则水平和垂直方法都可以。

<mark>通过`marign-left：-20px`可以基于`100% + 20px`</mark>

### margin与元素的外部尺寸

通过`writing-mode`改变方向为垂直流，则`margin`可改变**垂直**方向内部尺寸，无法更改**水平**方向

**通过padding-bottom:-9999px和margin-bottom:-9999px**达到等高的效果。

### margin的百分比值

<mark>`margin`的百分比值，无论是在垂直还是在水平上都是相对于宽度计算的</mark>

### CSS世界里的margin合并

#### 什么是margin合并？

**块级**元素的上边距`margin-top`和下边距`margin-bottom`有时会合并为**单个**外边距。产生条件

1. **块级元素**：不包括浮动和绝对定位元素；

2. **只发生在垂直方向**：严格来讲，只发生在和当前文本流方向的相垂直的方向上。

#### margin合并产生的场景

1. **相邻兄弟元素`margin`合并** ：最常见、最基本的场景—第一行的`margin-bottom`和第二行的`margin-top`合并在一起

2. **父级和第一个/最后一个子元素**：虽然在子元素上设置了`margin-top`，但实际上等同于在父元素上设置了`margin-top`,并且父子元素同时**设置**会发生合并。
   
   1. 阻止`margin-top`合并的操作：
      
      1. 父元素设置为块状格式化上下文元素—一般设置`overflow:hidden`
      
      2. 父元素设置`border-top`;
      
      3. 父元素设置`padding-top`值；
      
      4. 父元素和第一个子元素之间添加内联元素进行分割；
   
   2. 阻止`margin-bottom合并`的操作：
      
      1. 父元素设置块状格式化上下文元素；
      
      2. 父元素设置`border-bottom`；
      
      3. 父元素设置`padding-bottom`值；
      
      4. 父元素和最后一个子元素之间通过内联元素进行分割；
      
      5. 父元素设置`height、max-height、min-height`

3. **空块级元素的margin合并**：一个**空块级`div`** 的`margin-top`和`margin-bottom`会合并在一起。

#### margin合并的计算规则

1. **正正取最大值**；

2. **正负相加**；

3. **负负取最负值**

#### margin合并的意义

其意义在于：可以避免不小心遗落或者生成的空标签影响排版和布局；

同时因为`margin`合并的原因，在设置列表和模块时，可以保持上下`margin`设置，因为其兄弟元素之间的`margin`会发生合并

```css
.list{
    margin-top: 16px;
    margin-bottom: 16px;
}
```

### 深入理解CSS中的margin：auto

<mark>`margin:auto`的填充规则</mark>

1. 如果一侧为定值，另一侧为`auto`,则`auto`为剩余空间大小；

2. 如果两侧都为`auto`,则平分剩余空间；

**`margin`属性的`auto`计算就是为块级元素左中右对齐而设计的，和内联元素`text-align`属性控制左中右对齐一样**

**触发`margin:auto`的前置条件**：**`width或height`为`auto`，需要元素具有对应方向的自动填充特性**

<mark>垂直方向`margin`实现居中</mark>

1. `writing-mode`改变文档流的方向

2. 通过决对定位元素的`margin:auto`居中

### margin无效情形解析

p97

1. `display:inline`的**非替换元素**的**垂直**`margin`无效。但是，对于**内联替换元素**，**垂直**`margin`有效，并且没有`margin`合并问题。比如： 图片

2. 表格中的`tr、td`元素或者设置`display：table-cell/table-row`的`margin`是无效的
   
   如果计算值失`table-caption、table、inline-table`,是没问题的，并且可以通过`margin`控制外边距。

3. `margin`合并的时候，更改`margin`值可能没有效果

4. 绝对定位元素非定位方位的`margin`值无效

5. 定高容器的子元素的`margin-bottom`或者宽度定死的子元素的`margin-right`的定位失效
   
   若想使用`margin`属性改变自身的位置，必须是和当前元素**定位**的方向一样的`margin`属性才可以，否则`margin`只能影响到后面的元素或者父元素
   
   <mark>默认流下：定位方向是**左侧及上方**，可以通过`margin-left、margin-top`</mark>

6. 鞭长莫及导致的`margin`无效

7. 内联特性导致的`margin`无效
