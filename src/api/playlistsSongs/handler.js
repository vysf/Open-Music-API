/* eslint-disable linebreak-style */
/**
 * handler playlist songs
 */
class PlaylistsSongsHandler {
  /**
   * inisialisasi
   * @param {class} service kelas playlistsSongsService
   * @param {object} validator object PlaylistSongValidator
   * @param {class} songsService kelas songsService
   * @param {class} playlistsService kelas playlistsService
   * @param {class} playlistSongActivitiesService kelas aktivitas servis
   */
  constructor(
      service,
      validator,
      songsService,
      playlistsService,
      playlistSongActivitiesService,
  ) {
    this.__service = service;
    this.__validator = validator;
    this.__songsService = songsService;
    this.__playlistsService = playlistsService;
    this.__playlistSongActivitiesService = playlistSongActivitiesService;
  }

  /**
   * menambah lagu ke dalam sebuah playlist
   * @param {*} request
   * @param {*} h
   * @return {object} response sukses
   */
  async postPlaylistSongsIdHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    const {songId} = request.payload;

    this.__validator.validatePlaylistSongsPayload({playlistId, songId});

    await this.__playlistsService
        .verifyPlaylistAccess(playlistId, credentialId);
    await this.__songsService.getSongById(songId);
    await this.__service.addSongToPlaylist(playlistId, songId);
    // tambah aktifitas disini
    await this.__playlistSongActivitiesService
        .addActivity(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasi ditambahkan ke playlist',
    }).code(201);
    return response;
  }

  /**
   * mendapatkan daftar lagu didalam playlist
   * @param {*} request
   * @param {*} h
   * @return {object} respons sukses dan data playlist beserta daftar lagu
   */
  async getPlaylistSongsIdHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;

    await this.__playlistsService
        .verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this.__playlistsService.getPlaylistById(playlistId);
    const songs = await this.__songsService.getSongsByPlaylistId(playlistId);

    playlist.songs = songs;

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  /**
   * menghapus sebuah lagu dari playlist
   * @param {*} request
   * @param {*} h
   * @return {object} response sukses
   */
  async deletePlaylistSongsIdHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    const {songId} = request.payload;

    this.__validator.validatePlaylistSongsPayload({playlistId, songId});

    // jika sudah ada kolaborator, verifyPlaylistOwner
    // ubah ke verifyPlaylistAccess
    await this.__playlistsService
        .verifyPlaylistAccess(playlistId, credentialId);
    await this.__service.deleteSongOnPlaylist(playlistId, songId);

    // tambah aktifitas disini
    await this.__playlistSongActivitiesService
        .addActivity(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasi dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsSongsHandler;
