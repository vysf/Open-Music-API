/* eslint-disable linebreak-style */
const redis = require('redis');
const config = require('../../utils/config');
/**
 * servis cache
 */
class CacheService {
  /**
   * inisialisasi
   * membuat client
   */
  constructor() {
    this.__client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this.__client.on('error', (error) => {
      console.log(error);
    });

    this.__client.connect();
  }

  /**
   * menambah cache
   * @param {string} key key
   * @param {string} value value
   * @param {number} expirationInSecond waktu ekpire
   */
  async set(key, value, expirationInSecond = 30*60) {
    await this.__client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * mendapatkan cache
   * @param {string} key key
   * @return {string} cache
   */
  async get(key) {
    const result = await this.__client.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  /**
   * menghapus cache
   * @param {string} key key
   * @return {number} 0 atau 1
   */
  async delete(key) {
    return this.__client.del(key);
  }
}

module.exports = CacheService;
