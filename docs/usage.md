# 项目开发介绍

此介绍包含项目的文件结构、预置npm命令与各模块简介。

## scripts

### npm run dev:${type}

type: `browser` | `node`

此命令将会进入type模块的开发模式，自动构建生成对应版本的模块文件，并持续监听项目文件变化并自动构建。

### npm run build

此命令将会自动构建所有版本的代码并于dist目录中生成构建结果，包含开发和生产环境的模块文件。

### npm run test:${type}

type: `unit` | `e2e`

此命令将会进行type类型的测试。

## 项目结构

