/* eslint-disable linebreak-style */

const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * servis song
 * memasukan data ke database
 */
class SongsService {
  /**
   * inisialisasi
   */
  constructor() {
    this.__pool = new Pool();
  }

  /**
   * menambahkan lagu
   * @param {object} param0 payload
   * @return {string} id
   */
  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * mendapatkan daftar lagu dengan
   * pencarian atau tanpa pencarian
   * @param {*} param0 payload
   * @return {array} daftar lagu
   */
  async getSongs({title = '', performer = ''}) {
    /* [Opsional] Kriteria 2: Query Parameter untuk Pencarian Lagu */
    const query = {
      text: `SELECT id, title, performer FROM songs
      WHERE title ILIKE $1 AND performer ILIKE $2`,
      values: [`%${title}%`, `%${performer}%`],
    };

    const {rows} = await this.__pool.query(query);

    return rows;
  }

  /**
   * mendapatkan sebuah lagu
   * @param {string} id id lagu
   * @return {object} objek sebuah lagu
   */
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * mengubah sebuah lagu
   * @param {string} id id lagu
   * @param {object} param1 payload
   */
  async editSongById(id, {title, year, genre, performer, duration, albumId}) {
    const query = {
      text: `UPDATE songs SET
      title = $1, year = $2,
      genre = $3, performer = $4,
      duration = $5, album_id = $6
      WHERE id = $7 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  /**
   * menghapus sebuah lagu
   * @param {string} id id lagu
   */
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * melihat daftar lagu di dalam playlist
   * @param {string} playlistId id playlist
   * @return {array} lagu-lagu
   */
  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      LEFT JOIN playlists_songs ON playlists_songs.song_id = songs.id
      WHERE playlists_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = SongsService;
