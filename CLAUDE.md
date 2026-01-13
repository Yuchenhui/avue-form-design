# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 [Avue](https://avuejs.com/) 和 Element UI 的 Vue 2 表单设计器组件库，支持通过拖拽方式可视化构建表单。

**关键依赖（peerDependencies）：**
- Vue 2.6+
- element-ui 2.13.2+
- @smallwei/avue 2.6.16+

## 开发命令

```bash
# 开发模式 - 启动示例应用
yarn serve

# 构建组件库（UMD格式） - 输出到 lib/
yarn lib

# 构建示例应用 - 输出到 dist/
yarn build

# 代码检查
yarn lint

# 生成变更日志（基于 Conventional Commits）
yarn changelog
```

## 项目架构

### 核心设计模式

项目采用**三栏布局设计器**模式：
- **左侧面板**：可拖拽的字段组件列表（基于 `vuedraggable`）
- **中间画布**：表单预览和设计区域
- **右侧面板**：选中字段的属性配置面板

### 目录结构

```
packages/                    # 组件库源码（@别名指向此目录）
├── index.vue                # 主入口组件 <avue-form-design>
├── index.js                 # 插件入口
├── fieldsConfig.js          # 所有字段类型的默认配置（布局/输入/选择/日期等）
├── config/                  # 字段类型配置组件（右侧配置面板）
│   ├── index.js             # 配置组件注册
│   ├── input.vue            # 输入框配置
│   ├── select.vue           # 选择器配置（支持级联配置）
│   ├── dynamic.vue          # 子表单配置
│   ├── table/               # 表格选择器配置
│   └── ...                  # 其他字段配置
├── WidgetForm.vue           # 表单渲染组件（中间画布）
├── WidgetFormItem.vue       # 单个字段项渲染
├── WidgetFormGroup.vue      # 分组表单渲染
├── WidgetFormTable.vue      # 动态子表单渲染
├── WidgetConfig.vue         # 右侧配置面板容器
├── FormConfig.vue           # 表单全局配置（labelWidth、gutter等）
├── utils/
│   ├── index.js             # 工具函数（getAsVal、avueVersion检测等）
│   ├── monaco-editor.js     # Monaco Editor JSON编辑器集成
│   └── json-beautifier.js   # JSON格式化
├── mixins/
│   └── history.js           # 撤销/重做历史记录管理（最多20步）
└── styles/
    └── index.scss           # 组件样式

src/                         # 示例应用源码
├── main.js                  # 示例入口
└── App.vue                  # 示例应用

examples/                    # HTML直接引入示例
lib/                         # 构建输出（组件库）
public/                      # 静态资源
```

### 关键实现机制

**1. 字段系统**
- `fieldsConfig.js` 定义所有可用字段的默认配置，包括：
  - 布局字段（group、dynamic、title）
  - 输入字段（input、textarea、number等）
  - 选择字段（radio、checkbox、select、cascader、tree、table）
  - 上传字段（upload）
  - 日期时间字段（year、month、date、datetime等）
  - 插件字段（ueditor富文本）
  - 其他字段（icon、switch、rate、slider、color）
- 字段配置包含：type、label、icon、display、span、dicData、props等

**2. 级联字段配置**
- select、cascader、tree 字段支持 `cascaderItem` 属性用于级联配置
- 通过 `dicOption` 配置数据来源（'static' 或其他）

**3. 历史记录机制（撤销/重做）**
- `mixins/history.js` 实现最多20步的历史记录
- 支持本地存储（`storage` 属性）以防刷新丢失
- 提供 `handleUndo()`、`handleRedo()`、`handleHistoryChange()` 方法

**4. Monaco Editor 集成**
- `utils/monaco-editor.js` 集成 Monaco Editor 用于JSON编辑
- 支持语法高亮、自动格式化

**5. 组件库构建**
- 使用 `vue-cli-service build --target lib` 构建
- 外部化 vue 和 element-ui（通过 webpack externals）
- 单chunk输出（UMD格式）
- `libraryExport: 'default'` 导出默认对象

### webpack别名配置

```javascript
'@'          → packages/
'@components' → packages/components/
'@utils'     → packages/utils/
'@mixins'    → packages/mixins/
```

## 代码规范

- ESLint配置：extends plugin:vue/essential 和 eslint:recommended
- 允许 console 和 debugger（开发便利）
- 使用 babel-eslint 作为解析器

## 开发注意事项

**新增字段类型时：**
1. 在 `fieldsConfig.js` 中添加字段默认配置
2. 在 `packages/config/` 中创建对应的配置组件（如 `my-field.vue`）
3. 在 `packages/config/index.js` 中注册配置组件
4. 确保字段配置包含必需的 type、label、icon 等属性

**修改字段配置组件时：**
- 配置组件通过 props 接收 `data`（当前字段配置对象）
- 使用 `$emit('input', data)` 更新字段配置
- 注意 Avue 版本兼容性（通过 `avueVersion` 检测）

**兼容性检查：**
- 项目依赖 Avue 2.6.16+，某些功能依赖特定版本
- 使用 `utils/index.js` 中的 `avueVersion()` 检测当前版本
- 注意 dynamic 字段在 Avue 2.9.13+ 中 index option 必须为 true

**构建流程：**
- `yarn lib` 构建组件库时，vue 和 element-ui 不会被打包
- 确保用户环境已安装 vue、element-ui、@smallwei/avue
- 构建输出仅包含 lib/index.umd.min.js 和相关字体文件
