/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToModel} = require('../../utils');

/**
 * servis album
 */
class AlbumsService {
  /**
   * inisialisasi
   * @param {class} cacheService servis cache
   */
  constructor(cacheService) {
    this.__pool = new Pool();
    this.__cacheService = cacheService;
  }

  /**
   * menambah sebuah album
   * @param {object} param0 payload
   * @return {string} id album
   */
  async addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this.__pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    await this.__cacheService.delete('albums');

    return result.rows[0].id;
  }

  /**
   * mengubah cover
   * @param {string} id id album
   * @param {string} coverUrl url cover
   */
  async addAlbumCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memeperbarui album. Id tidak ditemukan');
    }
  }

  /**
   * mendapatkan sebuah album dengan atau tanpa lagu didalamnya
   * @param {string} id id album
   * @return {object} objek album
   */
  async getAlbumById(id) {
    const query = {
      text: `SELECT id, name, year, cover_url as "coverUrl"
      FROM albums WHERE id = $1`,
      values: [id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // [Opsional] Kriteria 1: Memunculkan daftar lagu di dalam detail album
    const songs = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };
    const songsResult = await this.__pool.query(songs);
    if (songsResult.rows.length > 1) {
      const res = result.rows[0];
      res.songs = songsResult.rows.map(mapDBToModel);
      return res;
    }

    await this.__cacheService.set(
        `albums:${id}`, JSON.stringify(result.rows[0]),
    );

    return result.rows[0];
  }

  /**
   * mengubah album
   * @param {strign} id id album
   * @param {object} param1 payload
   */
  async editAlbumById(id, {name, year}) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memeperbarui album. Id tidak ditemukan');
    }

    await this.__cacheService.delete(`albums:${id}`);
  }

  /**
   * menghapus sebuah album
   * @param {string} id id album
   */
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    await this.__cacheService.delete(`albums:${id}`);
  }

  /**
   * like/unlike
   * @param {string} userId id user
   * @param {string} albumId id album
   */
  async addAlbumLike(userId, albumId) {
    const query = {
      text: `SELECT * FROM user_album_likes
      WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    const isLiked = await this.__pool.query(query);

    if (!isLiked.rowCount) {
      // tambah like
      await this.like(userId, albumId);
    } else {
      // hapus like
      await this.dislike(userId, albumId);
    }

    await this.__cacheService.delete(`likes:${albumId}`);
  }

  /**
   * like
   * @param {string} userId id user
   * @param {string} albumId id album
   */
  async like(userId, albumId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }
  }

  /**
   * dislike
   * @param {string} userId id user
   * @param {string} albumId id album
   */
  async dislike(userId, albumId) {
    const query = {
      text: `DELETE FROM user_album_likes
      WHERE user_id = $1 AND album_id = $2
      RETURNING id`,
      values: [userId, albumId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal dihapus');
    }
  }

  /**
   * mengambil like album
   * @param {string} albumId id album
   * @return {object} jumlah like dan isCache
   */
  async getAlbumLikes(albumId) {
    try {
      const result = await this.__cacheService.get(`likes:${albumId}`);

      return {likeCount: JSON.parse(result), isCache: true};
    } catch (error) {
      const query = {
        text: `SELECT * FROM user_album_likes WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this.__pool.query(query);

      await this.__cacheService
          .set(`likes:${albumId}`, JSON.stringify(result.rowCount));
      return {likeCount: result.rowCount, isCache: false};
    }
  }
}

module.exports = AlbumsService;
