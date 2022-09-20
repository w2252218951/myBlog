## 什么是wabpack?

`webpack`就是就是一个编译和打包的工具，它能够**递归**的构建一个**依赖关系图**，其中包含应用程序**需要**的每个模块，将这些模块打包到一个或多个`bundle`，并且能够将模块中`scss、jsx、less`等浏览器不能识别的文件，转换为浏览器识别的`js、css`等文件。

## 通过命令行自定义webpack配置

通过添加`--config`指明使用配置文件

`"dev": "webpack --config ./webpack.xx.js"`

`Chunk`: **代码片段**

`Chunks`：**代码片段组**

`Chunk(块)`可以由一个或者多个模块构成；**对应`bundle`文件中的某个片段**

`Bundle(包)`: 资源通过`webpack`解析流程编译后的输出的成果文件 **特制文件**。

<mark>一个`bundle`对应一个`chunk`，对应一个或多个`module`</mark>

### loader相关

**webpack只支持`.js、.json`的模块**

<mark>**官方约定**：</mark>一个`loader`只处理一件事情
