/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * servis aktifitas
 */
class PlaylistSongActivitiesService {
  /**
   * inisialisasi
   */
  constructor() {
    this.__pool = new Pool();
  }

  /**
   * menambah aktifitas playlist
   * @param {string} playlistId id playlist
   * @param {string} songId id lagu
   * @param {string} userId id user
   * @param {string} action aksi (add dan delete)
   * @return {string} id aktifitas
   */
  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;
    // const time = Math.floor(Date.now()/1000);
    const time = new Date().toISOString();

    const query = {
      text: `INSERT INTO playlist_song_activities
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this.__pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * mengambil aktifitas berdasarkan pemilik playlist dan id playlist
   * @param {string} playlistId id playlist
   * @param {string} owner id user
   */
  async getActivitiesByPlaylistId(playlistId, owner) {
    const query = {
      text: `SELECT users.username, songs.title,
      playlist_song_activities.action,
      playlist_song_activities.time
      FROM playlist_song_activities 
        JOIN playlists 
          ON playlists.id = playlist_song_activities.playlist_id
              JOIN songs 
                ON songs.id = playlist_song_activities.song_id
                  JOIN users 
                    ON users.id = playlist_song_activities.user_id
        LEFT JOIN collaborations
          ON collaborations.playlist_id = playlist_song_activities.id
        WHERE playlists.id = $1 AND playlists.owner = $2
        OR collaborations.user_id = $2
        ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId, owner],
    };

    // ORDER BY playlist_song_activities.time DESC

    const result = await this.__pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('aktivitas tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
