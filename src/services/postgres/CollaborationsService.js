/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * servis kolaborasi: memasukan data ke database
 */
class CollaborationsService {
  /**
   * inisialisasi pooling
   */
  constructor() {
    this.__pool = new Pool();
  }

  /**
   * menambah kolaborasi
   * @param {string} playlistId id playlist
   * @param {string} userId id user
   * @return {string} id kolaborasi
   */
  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * menghapus kolaborasi
   * @param {string} playlistId id playlist
   * @param {string} userId id user
   */
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `DELETE FROM collaborations
      WHERE playlist_id = $1 AND user_id = $2
      RETURNING id`,
      values: [playlistId, userId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  /**
   * memverifikasi kolaborator
   * @param {string} playlistId id playlist
   * @param {string} userId id user
   */
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT * FROM collaborations
      WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
