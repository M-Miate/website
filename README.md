# Miateの主页

> 一个现代化的个人主页/博客网站，部署在 GitHub Pages

![GitHub Repo stars](https://img.shields.io/github/stars/M-Miate/website)
![GitHub forks](https://img.shields.io/github/forks/M-Miate/website)
![GitHub issues](https://img.shields.io/github/issues/M-Miate/website)
![GitHub license](https://img.shields.io/github/license/M-Miate/website)

## ✨ 特性

- 🎨 **现代化设计** - 采用 Bootstrap 5 + 响应式布局
- 🎵 **音乐播放器** - 支持网易云、QQ音乐、酷狗等多平台
- 🌤️ **实时天气** - 显示当前位置天气信息
- 💬 **一言功能** - 随机显示优美的语句
- 🌙 **暗色模式** - 支持明暗主题切换
- 📱 **移动端适配** - 完美适配各种屏幕尺寸
- ⚡ **PWA 支持** - 离线缓存，快速加载
- 🔒 **配置加密** - 敏感信息加密存储

## 🚀 快速开始

### 在线预览

👉 [https://miate.top](https://miate.top)

### 本地运行

```bash
# 克隆项目
git clone https://github.com/M-Miate/website.git
cd website

# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000
```

## 📁 项目结构

```
website/
├── 📄 index.html              # 主页面
├── 🎨 css/                    # 样式文件
│   ├── style.css             # 主样式
│   ├── mobile.css            # 移动端适配
│   └── animation.css         # 动画效果
├── 📜 js/                     # JavaScript 文件
│   ├── main.js               # 主要功能
│   ├── music.js              # 音乐播放器
│   ├── config-loader.js      # 配置加载器
│   └── time.js               # 时间显示
├── ⚙️ config/                 # 配置文件
│   ├── setting.json          # 主配置（JSON格式）
│   └── setting-template.json # 配置模板
└── 📜 docs/                   # 文档
    ├── github-deployment.md  # 部署指南
    └── security-guide.md     # 安全指南
```

## ⚙️ 配置说明

### 基础配置

配置文件位于 `config/setting.json`，包含以下主要配置：

```javascript
{
  "title": "Miateの主页",
  "description": "一个展示项目的主页",
  "author": "Miate",
  "weather": {
    "app_id": "天气API_ID",
    "app_secret": "天气API密钥"
  },
  "music": {
    "musicServer": "netease",
    "musicType": "playlist",
    "musicPlaylist": "963905505"
  }
}
```

### 敏感信息安全

项目支持配置文件加密，确保敏感信息安全：

- ✅ 天气 API 密钥自动加密
- ✅ 支持自定义加密密钥
- ✅ 前端运行时动态解密

详细配置方法请查看：[配置加密指南](docs/security-guide.md)

## 🎨 主要功能

### 🎵 音乐播放器
- 支持网易云、QQ音乐、酷狗音乐
- 歌单、单曲、专辑多种播放模式
- 歌词显示和播放控制

### 🌤️ 天气功能
- 基于地理位置的实时天气
- 显示温度、天气状况、风向风力
- 自动更新机制

### 💬 一言功能
- 随机显示优美语句
- 支持多种语句类型
- 点击刷新获取新语句

### 🎨 界面特性
- 响应式设计，移动端友好
- 流畅的动画过渡效果
- 支持壁纸切换
- 优雅的加载动画

## 🚀 部署到 GitHub Pages

### 自动部署（推荐）

1. **Fork 项目** 到你的 GitHub 账号
2. **启用 GitHub Pages**：
   - Settings → Pages → Source: GitHub Actions
3. **设置加密密钥**：
   - Settings → Secrets → Actions
   - 添加 `CONFIG_ENCRYPTION_KEY`
4. **推送代码** 到 main 分支即可自动部署

详细部署指南请查看：[GitHub 部署文档](docs/github-deployment.md)

### 手动部署

```bash
# 克隆项目
git clone https://github.com/M-Miate/website.git

# 修改配置文件
cp config/setting-template.json config/setting.json
# 编辑 config/setting.json 添加你的配置

# 推送到你的仓库
git add .
git commit -m "自定义配置"
git push origin main
```

## 🔧 技术栈

- **前端框架**：HTML5 + CSS3 + JavaScript (ES6+)
- **UI 框架**：Bootstrap 5 + Font Awesome 6
- **JavaScript 库**：Vue.js (轻量级) + jQuery
- **音乐播放**：APlayer
- **通知提示**：iziToast
- **构建工具**：GitHub Actions
- **部署平台**：GitHub Pages

## 🛠️ 开发指南

### 添加新功能

1. 在 `config/setting-template.json` 中定义配置项
2. 在对应的 JS 文件中实现功能逻辑
3. 在 `index.html` 中添加 UI 元素
4. 更新 CSS 样式文件

### 自定义样式

主要样式文件：
- `css/style.css` - 整体样式
- `css/mobile.css` - 移动端适配
- `css/animation.css` - 动画效果

### 调试技巧

- 使用浏览器开发者工具监控配置加载
- 检查 Service Worker 缓存状态
- 使用 Chrome DevTools 进行移动端测试

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📞 联系我

- **GitHub**: [@M-Miate](https://github.com/M-Miate)
- **邮箱**: 1251876172@qq.com
- **网站**: [https://miate.top](https://miate.top)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
