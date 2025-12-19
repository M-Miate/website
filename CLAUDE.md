# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个个人网站展示项目（"Miateの主页"），是一个现代化的个人主页/博客网站，部署在 GitHub Pages 上，域名为 miate.top。

## 技术栈

- **前端**: HTML5 + CSS3 + 原生 JavaScript (ES6+) + Vue.js (轻量级)
- **UI框架**: Bootstrap 5 + Font Awesome 6
- **构建部署**: GitHub Pages + GitHub Actions 自动部署
- **后端(可选)**: Node.js + Express (位于 /node/ 目录)

## 常用命令

### 本地开发
```bash
# 前端开发 - 直接打开浏览器即可
open index.html

# 或使用 Python 启动本地服务器（推荐）
python3 -m http.server 8000
# 然后访问 http://localhost:8000

# 使用 Node.js 启动本地服务器
npx serve .
# 然后访问 http://localhost:3000
```

### 部署
```bash
# 推送到 main 分支触发自动部署
git add .
git commit -m "更新配置或内容"
git push origin main

# 手动触发 GitHub Actions 部署
# 在 GitHub 仓库的 Actions 页面点击 "Deploy static content to Pages" 运行
# 或使用 git commit 触发自动部署
```

## 核心架构特点

### 配置驱动架构（关键理解）
项目采用双重配置加载机制：
1. **首次加载**: Vue.js 直接从 `./config/setting.json` 读取配置
2. **缓存机制**: 自动将配置存储到 localStorage，提高后续访问速度
3. **自动同步**: 每次页面加载时会检查配置文件与本地缓存是否一致

```javascript
// index.html:425 - 配置加载核心逻辑
let url = './config/setting.json'
$.getJSON(url, (data) => {
  this.Config = data
  localStorage.setItem('config', JSON.stringify(this.Config))
})
```

### 模块化 JavaScript 架构
- **main.js**: 页面初始化、事件绑定、天气API、一言API、时间显示、问候语逻辑
- **music.js**: 音乐播放器，支持网易云、QQ音乐、酷狗等多平台
- **set.js**: 用户设置管理和偏好存储，处理设置界面交互
- **time.js**: 实时时间显示和格式化
- **js/lib/sw.js**: PWA Service Worker，支持离线缓存，使用 Workbox 库
- **js/lib/**: 第三方库文件（jQuery、APlayer、iziToast 等）

### 响应式 CSS 架构
- **style.css**: 主样式文件，包含完整的视觉设计和布局
- **mobile.css**: 移动端专用适配样式，响应式布局
- **loading.css**: 页面加载动画和过渡效果
- **animation.css**: CSS 动画和交互效果
- **lantern.css**: 节日主题装饰（春节灯笼等，可按需启用）
- **css/lib/**: 第三方 CSS 库（Bootstrap、FontAwesome、APlayer、iziToast 等）

## 配置系统详解

### setting.json 结构层次
```json
{
  "基础信息": "网站元数据（标题、描述、作者等）",
  "第一屏内容": "logo、标语、社交链接、主卡片",
  "第二屏内容": "次级功能和卡片",
  "功能配置": "天气API、音乐服务、壁纸设置",
  "用户界面": "壁纸选项、更新日志"
}
```

### 配置修改工作流
1. **修改配置文件**: 编辑 `/config/setting.json`
2. **清除本地缓存**: 浏览器开发者工具 → Application → localStorage → 清除 config
3. **刷新页面**: 获取最新配置并自动缓存
4. **推送到仓库**: 触发自动部署更新线上版本

## 第三方服务集成

### 必需的 API 密钥
- **天气服务**: 和风天气 API（需申请 app_id 和 app_secret，当前配置中使用）
- **音乐服务**: 各平台播放列表 ID（网易云、QQ音乐、酷狗等）
- **一言服务**: 命中引用 API（当前使用 https://v1.hitokoto.cn/）

注意：当前配置文件中包含了真实的 API 密钥，在生产环境中应考虑环境变量或加密存储。

### 集成模式
所有第三方服务都通过配置文件统一管理，无需修改核心代码：
```json
"weather": {
  "app_id": "your_app_id",
  "app_secret": "your_app_secret"
},
"music": {
  "musicServer": "netease|tencent|kugou",
  "musicType": "song|playlist|album",
  "musicPlaylist": "playlist_id"
}
```

## 部署架构

### GitHub Actions 工作流
- **配置文件**: `.github/workflows/static.yml`
- **触发条件**:
  - 推送到 `main` 分支（自动）
  - 手动 workflow_dispatch 触发
- **部署流程**:
  1. 检出代码 (actions/checkout@v4)
  2. 配置 GitHub Pages (actions/configure-pages@v5)
  3. 上传整个仓库作为构建产物
  4. 自动部署并配置域名 miate.top
- **域名配置**: 在 Actions 中通过 `cname: miate.top` 参数设置
- **权限设置**: 需要 contents: read, pages: write, id-token: write

### 分支管理
- **主分支**: `main` - 生产环境，触发自动部署
- **开发分支**: `dev` - 开发环境，不触发部署
- 建议功能开发在 `dev` 分支完成后再合并到 `main`

### 性能优化特性
- **本地资源部署**: 所有第三方库文件本地化存储，减少外部依赖
- **图片优化**: 使用 WebP 格式和多种分辨率适配
- **PWA 支持**: Service Worker (Workbox) 实现多层缓存策略
- **响应式设计**: 移动端优先，完美适配各种屏幕尺寸
- **缓存策略**:
  - HTML/JS/CSS: networkFirst 策略
  - 静态资源: staleWhileRevalidate 策略
  - 图片资源: cacheFirst 策略，最长缓存 12 小时

## 开发注意事项

### 代码组织原则
- 每个功能模块独立封装，避免全局污染
- 配置与逻辑分离，所有可变内容通过 JSON 配置
- 优先使用 CDN 资源，减少项目体积
- 移动端优先的响应式设计

### 配置文件维护
- 保持 JSON 格式有效性，避免语法错误
- API 密钥等敏感信息建议使用环境变量（目前配置在文件中）
- 修改配置后记得清除浏览器 localStorage 缓存测试
- 配置修改工作流：编辑 → 清除缓存 → 刷新页面 → 部署

### 扩展开发模式
1. 在 `config/setting.json` 中定义新功能的配置项
2. 在 `js/` 目录对应模块中实现功能逻辑
3. 在 `index.html` 模板中使用 Vue 数据绑定
4. 在 `css/` 目录添加相应的样式支持
5. 更新 `js/lib/sw.js` 缓存策略（如需要）

### 调试和测试
- 使用浏览器开发者工具监控 localStorage 配置加载
- 检查 Service Worker 缓存状态（Application → Service Workers）
- 移动端测试使用 Chrome DevTools 设备模拟
- PWA 功能测试：断网状态下验证离线可用性