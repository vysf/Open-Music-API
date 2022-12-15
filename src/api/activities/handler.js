/* eslint-disable linebreak-style */
/**
 * handler
 */
class PlaylistSongActivitiesHandler {
  /**
   * inisialisasi
   * @param {class} activityService kelas actifitas servis
   * @param {class} playlistsService kelas playlistsService
   */
  constructor(activityService, playlistsService) {
    this.__service = activityService;
    this.__playlistsService = playlistsService;
  }

  /**
   * mendapatkan aktifitas
   * @param {*} request
   * @param {*} h
   * @return {object} response sukses
   */
  async getActivitiesByPlaylistId(request, h) {
    const {id: playlistId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this.__playlistsService
        .verifyPlaylistAccess(playlistId, credentialId);

    const activities = await this.__service
        .getActivitiesByPlaylistId(playlistId, credentialId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
