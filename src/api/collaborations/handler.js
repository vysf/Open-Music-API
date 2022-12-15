/* eslint-disable linebreak-style */
/**
 * menghendle kolaborasi
 */
class CollaborationsHandler {
  /**
   * inisialisasi
   * @param {class} collaborationsService servis kolaborasi
   * @param {class} playlistsService servis playlists
   * @param {class} usersService servis users
   * @param {object} validator validator kolaborasi
   */
  constructor(collaborationsService,
      playlistsService,
      usersService,
      validator) {
    this.__collaborationsService = collaborationsService;
    this.__playlistsService = playlistsService;
    this.__usersService = usersService;
    this.__validator = validator;
  }

  /**
   * menambahkan kolaborasi
   * @param {*} request
   * @param {*} h
   * @return {object} response sukses
   */
  async postCollaborationHandler(request, h) {
    this.__validator.validateCollaborationPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this.__usersService.getUserById(userId);
    await this.__playlistsService.getPlaylistById(playlistId);
    await this.__playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this.__collaborationsService
        .addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);

    return response;
  }

  /**
   * menghapus kolaborasi
   * @param {*} request
   * @param {*} h
   * @return {object} status sukses
   */
  async deleteCollaborationHandler(request, h) {
    this.__validator.validateCollaborationPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this.__playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this.__collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
