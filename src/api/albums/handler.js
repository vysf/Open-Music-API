/* eslint-disable linebreak-style */

/**
 * handler album
 */
class AlbumsHandler {
  /**
   * inisialisasi
   * @param {class} service kelas servis album
   * @param {object} validator validator
   */
  constructor(service, validator) {
    this.__service = service;
    this.__validator = validator;
  }

  /**
   * menambah sebuah album
   * @param {*} request
   * @param {*} h
   * @return {object} response success dan sebuah id album
   */
  async postAlbumHandler(request, h) {
    this.__validator.validateAlbumPayload(request.payload);
    const {name, year} = request.payload;
    const albumId = await this.__service.addAlbum({name, year});

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    }).code(201);
    return response;
  }

  /**
   * mendapatkan album dengan id
   * @param {*} request
   * @param {*} h
   * @return {object} response success dan sebuah album
   */
  async getAlbumByIdHandler(request, h) {
    const {id} = request.params;
    const album = await this.__service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  /**
   * mengubah album
   * @param {*} request
   * @param {*} h
   * @return {object} response success
   */
  async putAlbumByIdHandler(request, h) {
    this.__validator.validateAlbumPayload(request.payload);
    const {id} = request.params;

    await this.__service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diubah',
    };
  }

  /**
   * menhapus sebuah album dengan id
   * @param {*} request
   * @param {*} h
   * @return {object} response success
   */
  async deleteAlbumByIdHandler(request, h) {
    const {id} = request.params;

    await this.__service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  /**
   * menambahkan like/dislike
   * @param {*} request
   * @param {*} h
   * @return {object} response success
   */
  async postLikeAlbumHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id: albumId} = request.params;

    await this.__service.getAlbumById(albumId);
    await this.__service.addAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Like/dislike berhasil',
    }).code(201);

    return response;
  }

  /**
   * mendapatkan like
   * @param {*} request
   * @param {*} h
   * @return {object} response success
   */
  async getLikeAlbumHandler(request, h) {
    const {id: albumId} = request.params;
    const {likeCount, isCache} = await this.__service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: likeCount,
      },
    }).code(200);

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumsHandler;
