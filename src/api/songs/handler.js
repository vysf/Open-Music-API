/* eslint-disable linebreak-style */

/**
 * handler song
 */
class SongsHandler {
  /**
   * inisialisasi
   * @param {class} service kelas servis song
   * @param {object} validator validator
   */
  constructor(service, validator) {
    this.__service = service;
    this.__validator = validator;
  }

  /**
   * menambah lagu
   * @param {*} param0
   * @param {*} h
   * @return {object} response success dan id lagu
   */
  async postSongHandler({payload}, h) {
    this.__validator.validateSongPayload(payload);

    const id = await this.__service.addSong(payload);

    const response = h.response({
      status: 'success',
      data: {
        songId: id,
      },
    }).code(201);
    return response;
  }

  /**
   * mendapatkan daftar lagu
   * @param {*} request
   * @param {*} h
   * @return {object} response success dan daftar lagu
   */
  async getSongsHandler(request, h) {
    const songs = await this.__service.getSongs(request.query);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /**
   * mendapatkan lagu dengan id
   * @param {*} request
   * @param {*} h
   * @return {object} response success dan sebuah lagu
   */
  async getSongByIdHandler(request, h) {
    const {id} = request.params;
    const song = await this.__service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  /**
   * mengubah sebuah lagu
   * @param {*} request
   * @param {*} h
   * @return {object} response success
   */
  async putSongByIdHandler(request, h) {
    this.__validator.validateSongPayload(request.payload);
    const {id} = request.params;

    await this.__service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'song berhasil diubah',
    };
  }

  /**
   * menghapus sebuah lagu
   * @param {*} request
   * @param {*} h
   * @return {object} response success
   */
  async deleteSongByIdHandler(request, h) {
    const {id} = request.params;

    await this.__service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;

