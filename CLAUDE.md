# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个个人网站展示项目（"Miateの主页"），是一个现代化的个人主页/博客网站，部署在 GitHub Pages 上，域名为 miate.top。

## 技术栈

- **前端**: HTML5 + CSS3 + 原生 JavaScript (ES6+) + Vue.js (轻量级)
- **UI框架**: Bootstrap 5 + Font Awesome 6
- **构建部署**: GitHub Pages + GitHub Actions 自动部署
- **后端(可选)**: Node.js + Express (位于 /node/ 目录)

## 项目结构

```
/config/setting.json     # 核心配置文件 - 驱动整个网站内容
/css/                    # 模块化样式文件
/js/                     # JavaScript 模块
/img/                    # 静态资源
/node/                   # Node.js 后端服务
```

## 核心架构特点

### 配置驱动架构
- `/config/setting.json` 是项目的心脏，控制网站所有动态内容
- 包含：基础信息、卡片内容、功能配置、用户偏好等
- 修改配置即可更新网站内容，无需修改代码

### 模块化设计
- **main.js**: 核心业务逻辑和页面初始化
- **music.js**: 音乐播放器模块（集成网易云、QQ音乐等）
- **set.js**: 设置管理和用户偏好
- **time.js**: 时间显示功能
- **sw.js**: PWA Service Worker

### 响应式架构
- **style.css**: 主样式文件
- **mobile.css**: 移动端适配
- **loading.css**: 加载动画
- **animation.css**: 动画效果
- **lantern.css**: 节日灯笼特效

## 开发工作流程

### 本地开发
```bash
# 直接打开 index.html 即可预览
# 如需后端 API 服务：
cd node && npm install && node main.js
```

### 部署
- 推送到 `main` 分支触发自动部署
- GitHub Actions 自动构建并部署到 GitHub Pages
- 自动配置域名 miate.top

## 修改指南

### 更新网站内容
1. 编辑 `/config/setting.json` 文件
2. 修改相关配置项（如：标题、描述、链接、卡片内容等）
3. 刷新页面即可看到变化

### 添加新功能
1. 在 `setting.json` 中添加配置项
2. 在对应的 JS 模块中实现功能
3. 在 CSS 中添加样式支持
4. 更新 HTML 模板绑定

### 修改样式主题
1. 主要样式在 `/css/style.css`
2. 移动端适配在 `/css/mobile.css`
3. 背景图片在 `/img/` 目录
4. 配置主题选项在 `setting.json` 中

## 重要文件说明

- **index.html**: 主页面模板，使用数据绑定
- **config/setting.json**: 网站所有配置的"数据库"
- **js/main.js**: 页面初始化和配置数据绑定
- **js/music.js**: 音乐播放功能，支持多个音乐平台
- **.github/workflows/deploy.yml**: 自动部署配置

## 扩展集成

项目支持多种第三方服务集成：
- 音乐平台：网易云音乐、QQ音乐、酷狗音乐
- 天气API：和风天气或其他服务
- 一言API：动态励志语句
- 自定义API：可在配置中添加新的接口

## 注意事项

- 所有外部资源使用CDN加速
- 图片使用WebP格式优化性能
- 支持PWA离线访问
- 完全响应式设计，移动端优先
- 配置文件需保持有效的JSON格式