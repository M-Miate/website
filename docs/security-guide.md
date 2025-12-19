## 快速开始

### 1. 生成加密密钥

```bash
# 生成 32 字节的十六进制加密密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 示例输出（请使用你自己的密钥）:
# a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### 2. 设置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

- `CONFIG_ENCRYPTION_KEY`: 上一步生成的加密密钥

### 3. 加密配置文件

```bash
# 安装依赖
npm install crypto

# 加密配置文件
CONFIG_ENCRYPTION_KEY="your_encryption_key_here" \
node scripts/encrypt-config.js encrypt \
  config/setting-template.json \
  config/setting.json
```
## 详细配置步骤

### 本地开发环境

#### 步骤 1: 生成加密密钥

```bash
# 生成 32 字节的十六进制加密密钥（64个字符）
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 示例输出（请使用你自己的密钥）:
# 467b74e5919306329f631d80024dab10ca0f0828f53e19b9326bb9341a9d0609
```

#### 步骤 2: 设置环境变量

```bash
# 在 .env 文件中设置（推荐）
echo "CONFIG_ENCRYPTION_KEY=your_64_character_hex_key" > .env

# 或直接在终端设置
export CONFIG_ENCRYPTION_KEY=your_64_character_hex_key
```

#### 步骤 3: 准备配置模板

```bash
# 创建配置模板文件（包含明文密钥）
cp config/setting.json config/setting-template.json

# 确保 setting-template.json 包含真实的 API 密钥
# 这个文件不会被提交到仓库
```

#### 步骤 4: 加密本地配置

```bash
# 验证密钥格式
CONFIG_ENCRYPTION_KEY="your_key" node scripts/encrypt-config.js test

# 加密配置
CONFIG_ENCRYPTION_KEY="your_key" node scripts/encrypt-config.js encrypt \
  config/setting-template.json \
  config/setting.json

# 测试解密（验证）
CONFIG_ENCRYPTION_KEY="your_key" node scripts/encrypt-config.js decrypt config/setting.json
```

#### 步骤 5: 客户端测试

在浏览器开发者工具中临时设置解密密钥：

```javascript
// 在浏览器控制台中运行
sessionStorage.setItem('config_encryption_key', 'your_64_character_hex_key');

// 重新加载页面测试解密
location.reload();
```

### 生产环境部署

#### 步骤 1: 配置 GitHub Secrets

1. 进入 GitHub 仓库页面
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 添加 `CONFIG_ENCRYPTION_KEY` 和你的加密密钥

#### 步骤 2: 更新配置模板

编辑 `config/setting-template.json`，更新所有敏感信息：

```json
{
  "weather": {
    "app_id": "your_weather_app_id",
    "app_secret": "your_weather_app_secret"
  }
}
```

#### 步骤 3: 触发部署

```bash
# 提交配置模板和更改
git add config/setting-template.json .github/workflows/static.yml
git commit -m "启用安全配置加密"
git push origin main
```

GitHub Actions 将自动：
1. 使用环境变量中的加密密钥
2. 加密敏感配置字段
3. 部署到 GitHub Pages
