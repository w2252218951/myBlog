## new Vue时其内部发生了什么？

当我们实例化`Vue`时，实际上派发了两个生命周期钩子`beforeCreated()`,`created()`

，而在派发这两个生命周期钩子之前，要对`Vue`的实例进行一个初始化`initMixin(Vue)`,

初始化相关属性或方法:

`initlifeCycce(vm)`: 初始化`$parent、$root`

`initEvent(vm)` 监听父级传入的事件

`initRender(vm)`初始化：`slots`

`callHook(vm, 'beforeCreated')`

`initInjections(vm)`

`initState(vm)`初始化`props>methods>data>computed>watch`进行响应式处理

`initProvide(vm)`

`callHook(vm, 'created')`

然后再扩展`Vue`实例

`stateMixin`添加状态有关的方法和属性：`$set、$delete、$watch`

`eventMixin`:添加事件有关的方法和属性：`$on、$emit、$once、$off`

`lifeCycleMixin`: 声明周期属性和方法`_update()、$forceUpdate()、$destroy()`

`renderMixin()`:和渲染有关的方法`$nextTick、_render()`

## 在源码中查找入口文件

1. 通过`package.json`中`dev`的配置文件中 构建脚本`scripts`中的`config`文件进行查找；`scripts/config.js`
2. `dev`配置 为`web-full-dev`，查找到对应打包配置文件
3. `resolve()`是封装的一个方法，会将传入的参数进行**别名** 解析，进行**返回**
4. 具体的别名解析配置存放在 `scripts/alias.js`
5. 再通过返回的解析数据，进行相应的配置

## 编译过程区分

在使用`webpack`进行开发时是不存在**编译器**的，因为使用了`vue-loader`内部通过编译器将我们写好的`template`进行了编译，也就是对`vue`进行了预编译

在**源码**中是直接通过编译器进行编译的，**运行时编译**

`src/platforms/web/entry-runtime-with-compiler.js`

对`$mount`进行扩展：处理可能存在的`template`或者`el`选项

`src/platforms/web/runtime/index.js`

- 实现一个`patch`方法

- 实现`$mount`

`src/core/index.js`

- 初始化全局的API： `component/filter/use/directive/extend/mixin/util/set`

`src/core/instance/index.js`

- 声明构造函数

- 创建实例属性、实例方法

`$mount()`：生成真实的`dom`

`render`：获取`vdom`

`patch`： 初始化/更新 将vdom 转换为 dom

<mark>一个组件一个`watcher`</mark>

`$mount > _render （获取虚拟dom） > _update （将虚拟dom转化为真实dom）`



## 整体流程

`new Vue() > this._init()（初始化） > $mount（执行挂载）> mountComponent （进行组件挂载） > new Watcher()  > updateComponent() > _render() （获取虚拟dom）> _update(将虚拟dom转换为真实dom) > __patch__`
