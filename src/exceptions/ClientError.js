/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */

class ClientError extends Error {
  // Custom error yang mengindikasikan eror karena masalah yang
  // terjadi pada client. ClientError ini bersifat abstrak karena
  // client error bisa lebih spesifik. Sehingga, sebaiknya Anda
  // tidak membangkitkan error dengan menggunakan class ini secara
  // langsung, tetapi gunakanlah turunannya.
  constructor(message, statusCode = 404) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
