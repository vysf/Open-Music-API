/* eslint-disable linebreak-style */
const fs = require('fs');

/**
 * servis storage
 */
class StorageService {
  /**
   * inisialisasi keberadaan folder
   * @param {string} folder folder
   */
  constructor(folder) {
    this.__folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {recursive: true});
    }
  }

  /**
   * menambah file gambar ke storage
   * @param {string} file file gambar
   * @param {object} meta meta data file
   * @return {string} filename
   */
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this.__folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
