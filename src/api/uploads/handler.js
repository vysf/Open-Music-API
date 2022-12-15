/* eslint-disable linebreak-style */
/**
 * handler storage
 */
class UploadsHandler {
  /**
   * inisialisasi
   * @param {class} service servis storage
   * @param {class} albumsService servis album
   * @param {object} validator validator
   */
  constructor(service, albumsService, validator) {
    this.__service = service;
    this.__albumsService = albumsService;
    this.__validator = validator;
  }

  /**
   * upload cover
   * @param {*} request
   * @param {*} h
   * @return {object} response success
   */
  async postUploadImageHandler(request, h) {
    const {id: albumId} = request.params;
    const {cover} = request.payload;

    this.__validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this.__service.writeFile(cover, cover.hapi);
    const fileLocation =
        `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this.__albumsService.addAlbumCover(albumId, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
    return response;
  }
}

module.exports = UploadsHandler;
