#!/usr/bin/env node

/**
 * GitHub 部署快速设置脚本
 * 帮助快速设置 GitHub Pages 部署环境
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class DeploymentSetup {
  constructor() {
    this.configTemplatePath = 'config/setting-template.json';
    this.configPath = 'config/setting.json';
    this.jsConfigPath = 'config/setting.js';
  }

  /**
   * 生成加密密钥
   */
  generateEncryptionKey() {
    const key = crypto.randomBytes(32).toString('hex');
    console.log('🔑 生成的加密密钥:');
    console.log(key);
    console.log('\n📋 请将此密钥添加到 GitHub Secrets:');
    console.log('1. 进入仓库 Settings → Secrets and variables → Actions');
    console.log('2. 点击 "New repository secret"');
    console.log('3. Name: CONFIG_ENCRYPTION_KEY');
    console.log(`4. Secret: ${key}`);
    return key;
  }

  /**
   * 检查必要文件
   */
  checkFiles() {
    console.log('📁 检查必要文件...');

    const requiredFiles = [
      '.github/workflows/deploy-secure.yml',
      'scripts/encrypt-config.js',
      'js/config-loader.js'
    ];

    let allFilesExist = true;

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
      } else {
        console.log(`❌ ${file} - 文件不存在`);
        allFilesExist = false;
      }
    }

    return allFilesExist;
  }

  /**
   * 检查配置模板
   */
  checkConfigTemplate() {
    console.log('\n📄 检查配置模板...');

    if (fs.existsSync(this.configTemplatePath)) {
      console.log(`✅ 找到配置模板: ${this.configTemplatePath}`);

      try {
        const config = JSON.parse(fs.readFileSync(this.configTemplatePath, 'utf8'));

        // 检查必要字段
        const requiredFields = ['weather'];
        let hasRequiredFields = true;

        for (const field of requiredFields) {
          if (config[field]) {
            console.log(`✅ 配置包含字段: ${field}`);
          } else {
            console.log(`⚠️  配置缺少字段: ${field}`);
            hasRequiredFields = false;
          }
        }

        return hasRequiredFields;
      } catch (error) {
        console.log(`❌ 配置模板格式错误: ${error.message}`);
        return false;
      }
    } else {
      console.log(`❌ 未找到配置模板: ${this.configTemplatePath}`);
      console.log('💡 请创建配置模板文件，包含敏感信息的明文版本');
      return false;
    }
  }

  /**
   * 创建示例配置模板
   */
  createConfigTemplate() {
    console.log('\n📝 创建示例配置模板...');

    const exampleConfig = {
      "title": "Miateの主页",
      "description": "一个展示项目的主页",
      "keywords": "Miate,金玉白菜,个人博客,个人主页",
      "author": "Miate",
      "weather": {
        "app_id": "YOUR_WEATHER_APP_ID",
        "app_secret": "YOUR_WEATHER_APP_SECRET"
      },
      "music": {
        "musicServer": "netease",
        "musicType": "playlist",
        "musicPlaylist": "963905505",
        "musicAutoplay": "false",
        "musicLoop": "all"
      },
      "version": "1.3"
    };

    fs.writeFileSync(this.configTemplatePath, JSON.stringify(exampleConfig, null, 2));
    console.log(`✅ 示例配置模板已创建: ${this.configTemplatePath}`);
    console.log('⚠️  请编辑此文件，填入真实的配置信息');
  }

  /**
   * 测试加密配置
   */
  async testEncryption(key) {
    console.log('\n🔐 测试配置加密...');

    try {
      if (!fs.existsSync(this.configTemplatePath)) {
        console.log('❌ 配置模板不存在，无法测试加密');
        return false;
      }

      // 设置环境变量
      process.env.CONFIG_ENCRYPTION_KEY = key;

      // 动态导入加密脚本
      const ConfigEncryptor = require('./encrypt-config.js');
      const encryptor = new ConfigEncryptor();

      // 测试加密到 JSON
      if (encryptor.validateKey()) {
        console.log('✅ 加密密钥验证通过');

        // 创建临时输出文件进行测试
        const tempJsonPath = 'config/temp-setting.json';
        const tempJsPath = 'config/temp-setting.js';

        try {
          encryptor.encryptConfig(this.configTemplatePath, tempJsonPath);
          console.log('✅ JSON 加密测试成功');

          encryptor.encryptConfig(this.configTemplatePath, tempJsPath);
          console.log('✅ JS 加密测试成功');

          // 清理临时文件
          fs.unlinkSync(tempJsonPath);
          fs.unlinkSync(tempJsPath);

          return true;
        } catch (error) {
          console.log(`❌ 加密测试失败: ${error.message}`);
          return false;
        }
      } else {
        console.log('❌ 加密密钥验证失败');
        return false;
      }
    } catch (error) {
      console.log(`❌ 加密测试异常: ${error.message}`);
      return false;
    }
  }

  /**
   * 显示部署说明
   */
  showDeploymentInstructions() {
    console.log('\n🚀 部署说明:');
    console.log('1. 确保已启用 GitHub Pages');
    console.log('   - 进入 Settings → Pages');
    console.log('   - Source 选择 "GitHub Actions"');
    console.log('\n2. 设置加密密钥');
    console.log('   - 进入 Settings → Secrets and variables → Actions');
    console.log('   - 添加 CONFIG_ENCRYPTION_KEY');
    console.log('\n3. 推送代码到 main 分支');
    console.log('   git add .');
    console.log('   git commit -m "配置部署环境"');
    console.log('   git push origin main');
    console.log('\n4. 查看 Actions 运行状态');
    console.log('   - 进入 Actions 选项卡');
    console.log('   - 查看 "Deploy with encrypted config" 工作流');
  }

  /**
   * 运行完整设置流程
   */
  async run() {
    console.log('🔧 GitHub Pages 部署环境设置');
    console.log('=====================================');

    // 检查必要文件
    if (!this.checkFiles()) {
      console.log('\n❌ 缺少必要文件，请确保项目完整');
      return;
    }

    // 检查配置模板
    let hasConfig = this.checkConfigTemplate();
    if (!hasConfig) {
      console.log('\n❓ 是否要创建示例配置模板? (y/n)');

      // 由于是脚本，自动创建示例
      this.createConfigTemplate();
      console.log('⚠️  请编辑配置模板后重新运行此脚本');
      return;
    }

    // 生成加密密钥
    const key = this.generateEncryptionKey();

    // 测试加密
    const encryptionWorks = await this.testEncryption(key);
    if (encryptionWorks) {
      console.log('\n✅ 环境设置完成！');
      this.showDeploymentInstructions();
    } else {
      console.log('\n❌ 环境设置失败，请检查错误信息');
    }
  }
}

// 运行设置脚本
if (require.main === module) {
  const setup = new DeploymentSetup();
  setup.run().catch(error => {
    console.error('❌ 设置失败:', error.message);
    process.exit(1);
  });
}

module.exports = DeploymentSetup;