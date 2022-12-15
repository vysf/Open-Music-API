/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

/**
 * servis playlist
 * method yang disediakan adalah
 * ``addPlaylist({name, owner})``, ``getPlaylists(owner)``,
 * ``getPlaylistById(playlistId)``, ``deletePlaylistById(playlistId)``,
 * dan ``verifyPlaylistOwner({playlistId, owner})``
 */
class PlaylistsService {
  /**
   * inisialisasi
   * @param {class} collaborationsService servis kolaborasi
   */
  constructor(collaborationsService) {
    this.__pool = new Pool();
    this.__collaborationsService = collaborationsService;
  }

  /**
   * menambah playlist baru oleh user
   * @param {string} name nama playlist
   * @param {string} owner kridensial user
   * @return {string} id playlist
   */
  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.__pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * mendapatkan semua playlist milik user
   * @param {string} owner id user
   * @return {object} list playlist
   */
  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };
    const result = await this.__pool.query(query);
    return result.rows;
  }

  /**
   * mendapatkan sebuah playlis berdasarkan id
   * @param {string} playlistId id playlist
   * @return {object} playlist
   */
  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * menghapus playlist berdasarkan id
   * @param {string} playlistId id playlist
   */
  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * memverifikasi pemilik playlist
   * @param {string} playlistId id playlist
   * @param {string} owner id user
   */
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  /**
   * memverifikasi akses playlist
   * @param {string} playlistId id playlist
   * @param {string} userId id user
   */
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this.__collaborationsService
            .verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
