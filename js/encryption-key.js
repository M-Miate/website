/**
 * 加密密钥 - 本地开发使用
 * 注意：此文件在 GitHub Actions 部署时会被自动覆盖
 */

// 本地开发时，你可以在这里设置密钥，或者在浏览器控制台中设置：
// sessionStorage.setItem('config_encryption_key', 'your_encryption_key');
window.CONFIG_ENCRYPTION_KEY = null; // 本地开发默认为 null，需要在控制台中手动设置

console.log('🔧 本地开发模式：如需解密配置，请在控制台中设置加密密钥');
console.log('💡 示例：sessionStorage.setItem("config_encryption_key", "4d9e73d8266266dd02f2d1f80c3c8e37bd9cc84068e6b7ddc810ad51a52abfbf")');