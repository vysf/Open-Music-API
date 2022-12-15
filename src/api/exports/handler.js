/* eslint-disable linebreak-style */
/**
 * handler ekspor
 */
class ExportsHandler {
  /**
   * inisialisasi
   * @param {object} service service Producer
   * @param {class} playlistsService service Playlists
   * @param {object} validator validator ekspor
   */
  constructor(service, playlistsService, validator) {
    this.__service = service;
    this.__playlistsService = playlistsService;
    this.__validator = validator;
  }

  /**
   * mengirim export lagu ke message broker
   * @param {*} request
   * @param {*} h
   * @return {object} response sukses
   */
  async postExportSongsHandler(request, h) {
    this.__validator.validateExportSongsPayload(request.payload);

    const {id: userId} = request.auth.credentials;
    const {playlistId} = request.params;

    await this.__playlistsService.verifyPlaylistAccess(playlistId, userId);

    const {targetEmail} = request.payload;

    const message = {
      playlistId,
      targetEmail,
    };

    await this.__service.sendMessage(
        'export:songsOnPlaylist', JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);

    return response;
  }
}

module.exports = ExportsHandler;
