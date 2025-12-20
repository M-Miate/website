/**
 * 安全配置加载器
 * 支持加密配置文件解密和环境变量注入
 */

class SecureConfigLoader {
  constructor() {
    this.cacheKey = 'config';
    this.sessionCacheKey = 'config_session';
    this.versionCacheKey = 'config_version';
    this.encryptionKey = null;
  }

  /**
   * 从多个源获取加密密钥
   */
  getEncryptionKey() {
    // 1. 优先使用 GitHub Actions 注入的全局密钥
    if (typeof window !== 'undefined' && window.CONFIG_ENCRYPTION_KEY) {
      return window.CONFIG_ENCRYPTION_KEY;
    }

    // 2. 尝试从环境变量获取（仅服务端）
    if (typeof process !== 'undefined' && process.env.CONFIG_ENCRYPTION_KEY) {
      return process.env.CONFIG_ENCRYPTION_KEY;
    }

    // 3. 从 sessionStorage 获取（用户手动设置）
    if (typeof sessionStorage !== 'undefined') {
      const sessionKey = sessionStorage.getItem('config_encryption_key');
      if (sessionKey) {
        return sessionKey;
      }
    }

    console.warn('⚠️ 未找到加密密钥，将使用降级模式');
    return null;
  }

  /**
   * 计算配置文件的版本哈希
   */
  async calculateConfigHash(config) {
    // 创建一个简化的配置对象用于哈希计算，排除动态变化的部分
    const configForHash = {
      基础信息: config.基础信息,
      第一屏内容: config.第一屏内容,
      第二屏内容: config.第二屏内容,
      功能配置: {
        weather: {
          app_id: config.功能配置?.weather?.app_id,
          app_secret: config.功能配置?.weather?.app_secret
        }
      }
    };

    const configString = JSON.stringify(configForHash);
    const encoder = new TextEncoder();
    const data = encoder.encode(configString);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 解密配置字段
   */
  decryptField(encryptedData, encryptionKey) {
    try {
      if (!encryptedData || !encryptedData.encrypted) {
        return encryptedData;
      }

      // 使用 Web Crypto API 进行解密
      return this.cryptoDecrypt(encryptedData, encryptionKey);
    } catch (error) {
      console.error('解密失败:', error);
      return null;
    }
  }

  /**
   * Web Crypto API 解密实现（使用 AAD）
   */
  async cryptoDecrypt(encryptedData, keyHex) {
    try {
      // 验证输入数据
      if (!encryptedData || !encryptedData.encrypted) {
        return encryptedData;
      }

      if (!keyHex || typeof keyHex !== 'string') {
        throw new Error('无效的加密密钥');
      }

      // 将十六进制密钥转换为 ArrayBuffer
      const keyHexClean = keyHex.replace(/[^0-9a-fA-F]/g, '');
      if (keyHexClean.length !== 64) {
        throw new Error(`密钥长度错误: 期望64字符，实际${keyHexClean.length}字符`);
      }

      const keyData = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        keyData[i] = parseInt(keyHexClean.substr(i * 2, 2), 16);
      }

      // 导入密钥
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // 准备 IV (12 字节 = 24 个十六进制字符)
      if (!encryptedData.iv) {
        throw new Error('缺少 IV 数据');
      }

      const ivHex = encryptedData.iv.replace(/[^0-9a-fA-F]/g, '');
      if (ivHex.length !== 24) {
        throw new Error(`IV 长度错误: 期望24字符，实际${ivHex.length}字符`);
      }

      const iv = new Uint8Array(12);
      for (let i = 0; i < 12; i++) {
        iv[i] = parseInt(ivHex.substr(i * 2, 2), 16);
      }

      // 准备认证标签
      if (!encryptedData.authTag) {
        throw new Error('缺少认证标签数据');
      }

      const authTagHex = encryptedData.authTag.replace(/[^0-9a-fA-F]/g, '');
      if (authTagHex.length !== 32) { // 16字节 = 32个十六进制字符
        throw new Error(`认证标签长度错误: 期望32字符，实际${authTagHex.length}字符`);
      }

      const authTag = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        authTag[i] = parseInt(authTagHex.substr(i * 2, 2), 16);
      }

      // 准备加密数据
      if (!encryptedData.data) {
        throw new Error('缺少加密数据');
      }

      const encryptedHex = encryptedData.data.replace(/[^0-9a-fA-F]/g, '');
      const encrypted = new Uint8Array(encryptedHex.length / 2);
      for (let i = 0; i < encrypted.length; i++) {
        encrypted[i] = parseInt(encryptedHex.substr(i * 2, 2), 16);
      }

      // 将认证标签附加到加密数据末尾
      const encryptedWithTag = new Uint8Array(encrypted.length + authTag.length);
      encryptedWithTag.set(encrypted);
      encryptedWithTag.set(authTag, encrypted.length);

      // 准备 AAD (Additional Authenticated Data)
      // AAD 包含字段名和算法信息，确保数据完整性
      const aadString = encryptedData.fieldName || 'weather-field';
      const aad = new TextEncoder().encode(aadString);

      // 解密 - 使用 AAD 进行额外认证
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          additionalData: aad
        },
        key,
        encryptedWithTag
      );

      const result = new TextDecoder().decode(decrypted);
      return result;

    } catch (error) {
      console.error('❌ Web Crypto 解密失败:', error.message);

      // 详细的错误信息
      if (error.name === 'OperationError') {
        console.error('可能原因:');
        console.error('- 加密密钥不正确');
        console.error('- 加密数据已损坏');
        console.error('- IV 或认证标签格式错误');
        console.error('- AAD 数据不匹配（字段名或算法信息）');
      }

      throw error;
    }
  }

  /**
   * 递归解密配置对象中的敏感字段
   */
  async decryptConfigRecursive(config, encryptionKey) {
    const decrypted = JSON.parse(JSON.stringify(config));

    const decryptObject = async (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key].encrypted) {
            // 解密加密字段
            try {
              obj[key] = await this.decryptField(obj[key], encryptionKey);
            } catch (error) {
              console.warn(`解密字段 ${key} 失败:`, error);
              // 保留原始加密数据，解密失败时不会暴露密钥
            }
          } else {
            // 递归处理嵌套对象
            await decryptObject(obj[key]);
          }
        }
      }
    };

    await decryptObject(decrypted);
    return decrypted;
  }

  /**
   * 加载并解密配置（支持版本检查和sessionStorage）
   */
  async loadConfig(configUrl = './config/setting.json') {
    try {
      // 首先检查 sessionStorage 中是否有有效的会话缓存
      const sessionConfig = sessionStorage.getItem(this.sessionCacheKey);
      const sessionTimestamp = sessionStorage.getItem('config_session_timestamp');
      const now = Date.now();

      if (sessionConfig && sessionTimestamp && (now - parseInt(sessionTimestamp)) < 1800000) { // 30分钟会话缓存
        const config = JSON.parse(sessionConfig);
        return config;
      }

      // 从服务器加载最新配置
      const response = await fetch(configUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawConfig = await response.json();

      // 计算当前配置的版本哈希
      const currentVersion = await this.calculateConfigHash(rawConfig);
      const lastVersion = sessionStorage.getItem(this.versionCacheKey);

      // 检查配置是否有更新
      if (lastVersion && lastVersion === currentVersion) {
        // 配置未更新，检查是否有有效的长期缓存
        const cachedConfig = sessionStorage.getItem(this.cacheKey);
        const cacheTimestamp = sessionStorage.getItem('config_timestamp');

        if (cachedConfig && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 3600000) { // 1小时长期缓存
          const config = JSON.parse(cachedConfig);

          // 同时更新 sessionStorage
          sessionStorage.setItem(this.sessionCacheKey, JSON.stringify(config));
          sessionStorage.setItem('config_session_timestamp', now.toString());

          return config;
        }
      } else {
        // 更新版本号
        sessionStorage.setItem(this.versionCacheKey, currentVersion);
      }

      // 处理新加载的配置
      const encryptionKey = this.getEncryptionKey();
      let finalConfig;

      if (encryptionKey) {
        // 解密配置
        finalConfig = await this.decryptConfigRecursive(rawConfig, encryptionKey);
      } else {
        // 保留原始配置（包含加密字段）
        finalConfig = rawConfig;
      }

      // 更新所有缓存
      sessionStorage.setItem(this.cacheKey, JSON.stringify(finalConfig));
      sessionStorage.setItem('config_timestamp', now.toString());
      sessionStorage.setItem(this.sessionCacheKey, JSON.stringify(finalConfig));
      sessionStorage.setItem('config_session_timestamp', now.toString());

      return finalConfig;

    } catch (error) {
      console.error('❌ 配置加载失败:', error);

      // 尝试按优先级使用缓存
      let fallbackConfig = null;

      // 优先使用 sessionStorage 缓存（最新）
      const sessionConfig = sessionStorage.getItem(this.sessionCacheKey);
      if (sessionConfig) {
        fallbackConfig = JSON.parse(sessionConfig);
      } else {
        // 其次使用 sessionStorage 缓存
        const localConfig = sessionStorage.getItem(this.cacheKey);
        if (localConfig) {
          fallbackConfig = JSON.parse(localConfig);
        }
      }

      if (fallbackConfig) {
        return fallbackConfig;
      }

      throw new Error('配置加载完全失败，请检查网络连接');
    }
  }

  /**
   * 检查配置是否已完全解密
   */
  isConfigFullyDecrypted(config) {
    const checkObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key].encrypted) {
            return false; // 发现未解密的字段
          }
          if (!checkObject(obj[key])) {
            return false;
          }
        }
      }
      return true;
    };

    return checkObject(config);
  }

  /**
   * 获取解密状态信息
   */
  getDecryptionStatus(config) {
    const encryptedFields = [];
    const totalFields = 0;

    const scanObject = (obj, path = '') => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const currentPath = path ? `${path}.${key}` : key;

          if (obj[key].encrypted) {
            encryptedFields.push(currentPath);
          } else {
            scanObject(obj[key], currentPath);
          }
        }
      }
    };

    scanObject(config);

    return {
      isFullyDecrypted: encryptedFields.length === 0,
      encryptedFields,
      encryptedFieldCount: encryptedFields.length
    };
  }
}

// 导出到全局
window.SecureConfigLoader = SecureConfigLoader;
