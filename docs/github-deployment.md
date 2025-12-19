# GitHub Pages 部署指南

本文档详细说明如何使用 GitHub Actions 自动部署项目到 GitHub Pages。

## 🚀 快速开始

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 选项卡
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 中选择 **GitHub Actions**

### 2. 配置 GitHub Secrets

在仓库中设置必要的加密密钥：

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加以下密钥：

```
CONFIG_ENCRYPTION_KEY: 4d9e73d8266266dd02f2d1f80c3c8e37bd9cc84068e6b7ddc810ad51a52abfbf
```

### 3. 准备配置模板

确保 `config/setting-template.json` 文件存在，其中包含未加密的敏感信息：

```json
{
  "weather": {
    "app_id": "your_weather_app_id",
    "app_secret": "your_weather_app_secret"
  },
  "其他配置": "..."
}
```

## 📋 工作流说明

### 可用的工作流

#### 1. `deploy-secure.yml`（推荐）

**功能：**
- 自动加密敏感配置
- 生成 JSON 和 JS 两种格式的配置文件
- 验证配置文件格式
- 部署到 GitHub Pages

**触发条件：**
- 推送到 `main` 分支
- 手动触发（workflow_dispatch）

**部署流程：**
1. 检出代码
2. 设置 Node.js 环境
3. 检查/生成加密密钥
4. 加密配置文件（JSON & JS）
5. 验证文件格式
6. 部署到 GitHub Pages

#### 2. `static.yml`

**功能：**
- 简单的静态文件部署
- 不处理配置加密

**适用于：**
- 不需要配置加密的项目
- 快速部署测试

## 🔧 配置管理

### 加密字段

当前自动加密的敏感字段：

- `weather.app_id` - 天气 API ID
- `weather.app_secret` - 天气 API 密钥

### 配置文件格式

部署后会生成两个配置文件：

1. **`config/setting.json`** - JSON 格式
2. **`config/setting.js`** - JavaScript 模块格式

### 前端使用

项目会自动尝试以下加载顺序：

1. 优先加载 `setting.js`
2. 失败后降级到 `setting.json`

## 🛠️ 本地开发

### 生成加密配置

```bash
# 生成加密密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 加密配置文件
CONFIG_ENCRYPTION_KEY="your_key" node scripts/encrypt-config.js encrypt config/setting-template.json config/setting.js
```

### 测试部署

```bash
# 提交到 main 分支触发自动部署
git add .
git commit -m "更新配置"
git push origin main

# 或手动触发部署
# 在 GitHub Actions 页面点击 "Deploy with encrypted config" -> "Run workflow"
```

## 🔒 安全最佳实践

### 1. 密钥管理

- ✅ 使用 GitHub Secrets 存储加密密钥
- ✅ 不要在代码中硬编码密钥
- ✅ 定期轮换加密密钥

### 2. 配置安全

- ✅ 敏感信息仅在模板文件中明文存储
- ✅ 生产环境使用加密后的配置
- ✅ 模板文件不要提交到生产分支

### 3. 部署安全

- ✅ 使用最小权限原则
- ✅ 启用分支保护规则
- ✅ 定期检查部署日志

## 📊 监控和调试

### 查看部署状态

1. 进入仓库的 **Actions** 选项卡
2. 查看工作流运行状态
3. 点击具体任务查看详细日志

### 常见问题

#### 1. 加密密钥错误

**错误：** `❌ 加密密钥验证失败`

**解决：**
- 检查 GitHub Secrets 中的 `CONFIG_ENCRYPTION_KEY`
- 确保密钥是 64 位十六进制字符串（32 字节）

#### 2. 配置文件格式错误

**错误：** `❌ 配置文件 JSON 格式错误`

**解决：**
- 检查 `setting-template.json` 语法
- 确保所有引号和括号匹配

#### 3. 权限问题

**错误：** `Permission denied`

**解决：**
- 检查仓库的 Actions 权限设置
- 确保 GitHub Pages 已启用

## 🔄 版本控制

### 分支策略

- `main` - 生产分支，自动部署
- `dev` - 开发分支，不触发部署

### 提交规范

```
feat: 添加新功能
fix: 修复问题
docs: 更新文档
chore: 配置更新
```

### 版本标记

```bash
git tag -a v1.0.0 -m "版本 1.0.0"
git push origin v1.0.0
```

## 📞 技术支持

如遇到部署问题，请：

1. 检查 Actions 日志
2. 验证配置文件格式
3. 确认 GitHub Secrets 设置
4. 查看本文档的常见问题部分

---

**最后更新：** 2025-12-19
**作者：** Miate