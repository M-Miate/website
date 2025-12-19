#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 配置文件加解密工具
 * 使用 AES-256-GCM 加密算法保护敏感配置信息
 * 兼容 Web Crypto API 标准
 */

class ConfigEncryptor {
  constructor() {
    // 从环境变量获取加密密钥，如果没有则生成提示
    this.encryptionKey = process.env.CONFIG_ENCRYPTION_KEY;

    if (!this.encryptionKey) {
      console.error('错误: 未设置 CONFIG_ENCRYPTION_KEY 环境变量');
      console.log('提示: 生成加密密钥命令:');
      console.log('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
      process.exit(1);
    }

    // 确保密钥是 32 字节的 Buffer
    this.key = Buffer.from(this.encryptionKey, 'hex');
    if (this.key.length !== 32) {
      console.error('错误: 加密密钥必须是 64 位十六进制字符串（32 字节）');
      console.error(`当前密钥长度: ${this.key.length} 字节`);
      process.exit(1);
    }
  }

  /**
   * 生成 JS 配置文件
   */
  generateJSConfig(config, outputPath) {
    try {
      console.log('📝 生成 JS 配置文件...');

      // 生成 JS 文件内容
      const jsContent = `/**
 * 网站配置文件 - 自动生成
 * 包含网站基本信息、功能配置、UI设置等
 *
 * generated: ${new Date().toISOString()}
 * author: Miate
 */

// 网站配置数据
const settingConfig = ${JSON.stringify(config, null, 2)};

// 兼容多种导出方式
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = settingConfig;
} else if (typeof window !== 'undefined') {
  // 浏览器环境
  window.SETTING_CONFIG = settingConfig;
  // 也支持 CommonJS 风格
  if (typeof exports !== 'undefined') {
    exports.settingConfig = settingConfig;
  }
} else {
  // 其他环境
  this.SETTING_CONFIG = settingConfig;
}

// 默认导出
export default settingConfig;
`;

      fs.writeFileSync(outputPath, jsContent, 'utf8');
      console.log(`✅ JS 配置文件已生成: ${outputPath}`);

    } catch (error) {
      console.error('❌ JS 配置文件生成失败:', error.message);
      throw error;
    }
  }

  /**
   * 加密配置文件中的敏感字段
   */
  encryptConfig(inputPath, outputPath) {
    try {
      const config = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
      const encryptedConfig = JSON.parse(JSON.stringify(config));

      // 需要加密的敏感字段路径
      const sensitiveFields = [
        'weather.app_id',
        'weather.app_secret'
      ];

      // 加密指定字段
      sensitiveFields.forEach(fieldPath => {
        const keys = fieldPath.split('.');
        let current = encryptedConfig;

        // 导航到目标字段
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            console.log(`跳过字段 ${fieldPath}: 路径不存在`);
            return;
          }
          current = current[keys[i]];
        }

        const lastKey = keys[keys.length - 1];
        if (current[lastKey]) {
          try {
            const iv = crypto.randomBytes(12); // 使用 12 字节 IV 以匹配 Web Crypto API

            // 创建加密器 - 使用 createCipheriv 替代废弃的 createCipher
            const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

            // 设置 AAD (Additional Authenticated Data)
            // AAD 包含字段路径，确保数据完整性和防篡改
            const aadString = fieldPath; // 使用完整字段路径作为 AAD
            cipher.setAAD(Buffer.from(aadString, 'utf8'));

            let encrypted = cipher.update(current[lastKey], 'utf8', 'hex');
            encrypted += cipher.final('hex');

            const authTag = cipher.getAuthTag();

            // 替换为加密数据
            current[lastKey] = {
              encrypted: true,
              data: encrypted,
              iv: iv.toString('hex'),
              authTag: authTag.toString('hex'),
              fieldName: fieldPath, // 添加字段名用于 AAD 验证
              algorithm: 'AES-GCM',
              keyLength: 256
            };

            console.log(`已加密字段: ${fieldPath}`);
          } catch (fieldError) {
            console.error(`加密字段 ${fieldPath} 失败:`, fieldError.message);
          }
        } else {
          console.log(`跳过字段 ${fieldPath}: 值为空或不存在`);
        }
      });

      // 根据输出文件扩展名选择写入方式
      if (outputPath.endsWith('.js') || outputPath.endsWith('.mjs')) {
        this.generateJSConfig(encryptedConfig, outputPath);
      } else {
        // 写入 JSON 文件
        fs.writeFileSync(outputPath, JSON.stringify(encryptedConfig, null, 2));
        console.log(`加密配置已保存到: ${outputPath}`);
      }

    } catch (error) {
      console.error('加密失败:', error.message);
      console.error('堆栈:', error.stack);
      process.exit(1);
    }
  }

  /**
   * 解密配置文件（测试用）
   */
  decryptConfig(inputPath) {
    try {
      const config = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
      const decryptedConfig = JSON.parse(JSON.stringify(config));

      const decryptField = (obj, fieldPath) => {
        const keys = fieldPath.split('.');
        let current = obj;

        // 导航到目标字段
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) return;
          current = current[keys[i]];
        }

        const lastKey = keys[keys.length - 1];
        const field = current[lastKey];

        if (field && field.encrypted) {
          try {
            const iv = Buffer.from(field.iv, 'hex');
            const authTag = Buffer.from(field.authTag, 'hex');

            const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);

            // 设置 AAD (必须与加密时一致)
            const aadString = field.fieldName || fieldPath;
            decipher.setAAD(Buffer.from(aadString, 'utf8'));

            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(field.data, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            current[lastKey] = decrypted;
            console.log(`✅ 已解密字段: ${fieldPath}`);
          } catch (decryptError) {
            console.error(`❌ 解密字段 ${fieldPath} 失败:`, decryptError.message);
          }
        }
      };

      // 解密所有敏感字段
      ['weather.app_id', 'weather.app_secret'].forEach(fieldPath => {
        decryptField(decryptedConfig, fieldPath);
      });

      return decryptedConfig;

    } catch (error) {
      console.error('解密失败:', error.message);
      return null;
    }
  }

  /**
   * 验证加密密钥
   */
  validateKey() {
    try {
      // 尝试简单的加密/解密测试
      const testData = 'test-encryption';
      const testFieldPath = 'test.field'; // 测试用字段路径
      const iv = crypto.randomBytes(12); // 与实际加密保持一致

      const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

      // 设置测试 AAD
      cipher.setAAD(Buffer.from(testFieldPath, 'utf8'));

      let encrypted = cipher.update(testData, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);

      // 设置相同的 AAD 进行验证
      decipher.setAAD(Buffer.from(testFieldPath, 'utf8'));
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted === testData;
    } catch (error) {
      console.error('❌ 密钥验证失败:', error.message);
      return false;
    }
  }
}

// 命令行接口
if (require.main === module) {
  const [,, command, inputPath, outputPath] = process.argv;
  const encryptor = new ConfigEncryptor();

  // 验证密钥
  if (!encryptor.validateKey()) {
    console.error('❌ 加密密钥验证失败，请检查密钥格式');
    process.exit(1);
  }

  switch (command) {
    case 'encrypt':
      if (!inputPath || !outputPath) {
        console.error('用法: node encrypt-config.js encrypt <输入文件> <输出文件>');
        process.exit(1);
      }
      encryptor.encryptConfig(inputPath, outputPath);
      break;

    case 'decrypt':
      if (!inputPath) {
        console.error('用法: node encrypt-config.js decrypt <输入文件>');
        process.exit(1);
      }
      const decrypted = encryptor.decryptConfig(inputPath);
      if (decrypted) {
        console.log('\n解密结果:');
        console.log(JSON.stringify(decrypted, null, 2));
      }
      break;

    case 'test':
      console.log('✅ 加密密钥验证通过');
      console.log('密钥长度:', encryptor.key.length, '字节');
      break;

    default:
      console.log('配置文件加密工具');
      console.log('');
      console.log('命令:');
      console.log('  encrypt <输入> <输出>  加密配置文件');
      console.log('  decrypt <输入>        解密配置文件（测试用）');
      console.log('  test                  测试加密密钥');
      console.log('');
      console.log('环境变量:');
      console.log('  CONFIG_ENCRYPTION_KEY  64位十六进制加密密钥（32字节）');
      console.log('');
      console.log('示例:');
      console.log('  # 生成密钥');
      console.log('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
      console.log('');
      console.log('  # 加密配置');
      console.log('  CONFIG_ENCRYPTION_KEY=your_key node scripts/encrypt-config.js encrypt config/setting-template.json config/setting.json');
      console.log('  CONFIG_ENCRYPTION_KEY=your_key node scripts/encrypt-config.js encrypt config/setting-template.json config/setting.js');
      break;
  }
}

module.exports = ConfigEncryptor;
