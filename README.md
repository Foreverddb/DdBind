<h1 align="center">
  DdBind
</h1>

<p align="center">
  <a href="https://codecov.io/gh/Foreverddb/DdBind"><img src="https://codecov.io/gh/Foreverddb/DdBind/branch/master/graph/badge.svg?token=GXMXNM3HQL" alt="coverage"/></a>
  <a href="https://npmcharts.com/compare/ddbind?minimal=true"><img src="https://img.shields.io/npm/dm/ddbind.svg?sanitize=true" alt="NPM Downloads"></a>
  <a href="https://www.npmjs.com/package/ddbind"><img src="https://img.shields.io/npm/v/ddbind.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/ddbind"><img src="https://img.shields.io/npm/l/ddbind.svg?sanitize=true" alt="License"></a>
</p>

## 简介

**DdBind** 是一个简单的vue-like MVVM框架，实现完成了mvvm的主要功能。

语法上与vue3类似，便于快速上手使用。

适用于浏览器与node es module，旨在快速简单地构建用户交互界面。

本项目采用 **Typescript** 编写，**rollup** 完成打包，**vitest** 进行测试。

## 安装

### browser

查看[demo for browser](https://foreverddb.github.io/DdBind/docs/demo.html)

[Codepen在线编辑并预览](https://codepen.io/foreverddb/pen/yLqjdao)

```html
<script src="https://foreverddb.github.io/DdBind/dist/ddbind.browser.prod.js"></script>
```

或使用开发版本

```html
<script src="https://foreverddb.github.io/DdBind/dist/ddbind.browser.dev.js"></script>
```

### node

```shell
npm install --save ddbind
```

## 使用

### HTML:

```html
<div id="app">
    <div>
        <h1>{{ foo }}</h1>
    </div>
</div>
```

### javascript:

#### browser

```javascript
const app = DdBind.createApp({
    data() {
        return {
            foo: 'bar'
        }
    }
})
app.mount('#app')
```

#### as ES Module

```typescript
import {createApp, ref} from 'ddbind'

const app = createApp({
    setup() {
        return {
            foo: ref('bar')
        }
    }
})
app.mount('#app')
```

## Features

- 测试覆盖率达95%以上
- 包含类型声明，支持typescript
- 自带runtime编译器
- 面向esnext开发
- 集成自动化测试工作流

## 使用文档

[查看api文档](docs/api.md)

## 实现原理

[查看文档](docs/实现原理.md)

## 其他

[项目开发文档](docs/dev.md)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present, ForeverDdB (Wenjie Deng)