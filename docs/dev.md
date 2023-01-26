# 项目开发介绍

此介绍包含项目的文件结构、预置npm命令与各模块简介。

## start

使用命令`npm install`安装项目开发依赖。

## scripts

### npm run dev:${type}

type: `browser` | `node`

此命令将会进入type模块的开发模式，自动构建生成对应版本的模块文件，并持续监听项目文件变化并自动构建。

### npm run build

此命令将会自动构建所有版本的代码并于dist目录中生成构建结果，包含开发和生产环境的模块文件。

### npm run test:${type}

type: `unit` | `e2e`

此命令将会进行type类型的测试。

### npm run coverage

此命令将进行完整的框架测试并生成测试覆盖率报告。本项目已集成codecov自动测试工作流，收到push请求即会自动执行测试任务并同步生成codecov测试覆盖率报告。

## 项目结构

- src 项目源码文件
  - compiler 编译器模块
    - directives 处理指令部分的模块
    - generator 代码生成器codegen
    - parser HTML解析器
    - transformer ast转换器
  - core 核心模块
    - watchEffect 实现了发布-观察者（订阅）模式
  - module 向外暴露的app模块
  - reactivity 响应式工具模块
  - renderer 虚拟dom渲染模块
  - types 开发时使用的类型定义
  - utils 工具模块
- dist 构建结果
- types 作为npm包的对外类型声明
- scripts 项目开发、构建、测试脚步配置
- test 测试
  - e2e
  - unit
    - features
    - modules

