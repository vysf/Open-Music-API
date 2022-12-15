/* eslint-disable linebreak-style */
/**
 * handle keluar masuk data ke playlist
 */
class PlaylistsHandler {
  /**
   * instance
   * @param {class} service kelas PlaylistsService
   * @param {object} validator validator playlist
   */
  constructor(service, validator) {
    this.__service = service;
    this.__validator = validator;
  }

  /**
   * post playlist
   * @param {*} request
   * @param {*} h
   * @return {object} response sukses dan id playlist
   */
  async postPlaylistHandler(request, h) {
    this.__validator.validatePlaylistPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;

    const {name} = request.payload;

    const playlistId = await this.__service.addPlaylist(name, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
    return response;
  }

  /**
   * get playlists
   * @param {*} request
   * @param {*} h
   * @return {object} respons sukses dan list playlist
   */
  async getPlaylistsHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;

    const playlists = await this.__service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  /**
   * delete playlist
   * @param {*} request
   * @param {*} h
   * @return {object} response status sukses
   */
  async deletePlaylistHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    await this.__service.verifyPlaylistOwner(id, credentialId);
    await this.__service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
