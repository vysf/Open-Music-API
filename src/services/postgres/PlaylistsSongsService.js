/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * servis playlists_songs
 * method yang disediakan adalah
 * ``addSongToPlaylist({playlistId, songId})``,
 * ``getSongsByPlaylistId(playlistId)``, dan
 * ``deleteSongOnPlaylist({playlistId, songId})``
 */
class PlaylistsSongsService {
  /**
   * inisiasi pooling
   */
  constructor() {
    this.__pool = new Pool();
  }

  // playlists_songs
  /**
   * menambah lagu ke dalam playlist
   * @param {string} playlistId id playlist
   * @param {string} songId id lagu
   * @return {string} id playlist song
   */
  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }

    return result.rows[0].id;
  }

  /**
   * menghapus lagu dari playlist
   * @param {string} playlistId id playlist
   * @param {string} songId id lagu
   */
  async deleteSongOnPlaylist(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlists_songs
      WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
          'Gagal menghapus lagu didalam playlist. Id tidak ditemukan',
      );
    }
  }
}

module.exports = PlaylistsSongsService;
