/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * servis user
 */
class UsersService {
  /**
   * instance pooling
   */
  constructor() {
    this.__pool = new Pool();
  }

  /**
    * menambahkan user
    * @param {object} payload berisi username, password, dan fullname
    * @return {string} id user
   */
  async addUser({username, password, fullname}) {
    // verefikasi username yang belum terdaftar
    await this.verifyNewUsername(username);

    // buat id dan hashing password
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // query untuk simpan user ke database
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this.__pool.query(query);

    // handle error
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    // return id
    return result.rows[0].id;
  }

  /**
   * mendapatkan user dengan id yang spesifik
   * @param {string} id id user
   * @return {object} data user
   */
  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * tidak bole daftar dengan username yang telah didaftarkan
   * @param {string} username
   */
  async verifyNewUsername(username) {
    // query username berdasarkan username yang diberikan
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.__pool.query(query);

    // handle error
    if (result.rows.length > 0) {
      throw new
      InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  /**
   * verifikasi kredensial
   * @param {string} username username
   * @param {string} password password
   * @return {string} id
   */
  async verifyUserCredential(username, password) {
    // query ambil username
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.__pool.query(query);

    // handle error bila username tidak ditemukan
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }

    // pencocokan password dengan hashed password
    const {id, password: hashedPassword} = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    // handle error bila tidak cocok
    if (!match) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }

    // kembalikan id user
    return id;
  }
}

module.exports = UsersService;
