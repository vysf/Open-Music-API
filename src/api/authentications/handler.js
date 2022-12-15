/* eslint-disable linebreak-style */
/**
 * handle autentikasi
 */
class AuthenticationsHandler {
  /**
   * instance
   * @param {class} authenticationsService servis authentikasi
   * @param {class} usersService servis user
   * @param {object} validator validator autentikasi
   * @param {object} tokenManager token manager
   */
  constructor(authenticationsService, usersService, validator, tokenManager) {
    this.__authenticationsService = authenticationsService;
    this.__usersService = usersService;
    this.__validator = validator;
    this.__tokenManager = tokenManager;
  }

  /**
   * membuat access token dan refresh token / login
   * @param {object} request
   * @param {object} h
   * @return {object} accessToken, refreshToken
   */
  async postAuthenticationHandler(request, h) {
    // validasi username dan password
    this.__validator
        .validatePostAuthenticationPayload(request.payload);

    // periksa kredensial user dan dapatkan id
    const {username, password} = request.payload;
    const id = await this.__usersService.verifyUserCredential(
        username, password,
    );

    // buat access token dan refresh token berdasarkan id user
    const accessToken = this.__tokenManager.generateAccessToken({id});
    const refreshToken = this.__tokenManager.generateRefreshToken({id});

    // simpan refresh token ke database
    await this.__authenticationsService.addRefreshToken(refreshToken);

    // kirim response berupa access token dan refresh token
    const response = h.response({
      status: 'success',
      message: 'Authentication berhasi ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);

    return response;
  }

  /**
   * memperbarui access token dengan melampirkan refresh token
   * @param {object} request
   * @param {object} h
   * @return {object} accessToken
   */
  async putAuthenticationHandler(request, h) {
    // validasi refresh token
    this.__validator.validatePutAuthenticationPayload(request.payload);

    // verifikasi refresh token di database
    const {refreshToken} = request.payload;
    await this.__authenticationsService.verifyRefreshToken(refreshToken);

    // verifikasi signature refresh token
    const {id} = this.__tokenManager.verifyRefreshToken(refreshToken);

    // buat access token baru
    const accessToken = this.__tokenManager.generateAccessToken({id});

    // kirim response berupa access token baru
    return {
      status: 'success',
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  /**
   * menghapus refresh token pada database / logout
   * @param {object} request
   * @param {object} h
   * @return {object}
   */
  async deleteAuthenticationHandler(request, h) {
    // validasi refresh token
    this.__validator.validateDeleteAuthenticationPayload(request.payload);

    // cek ada atau tidak refresh token di database
    const {refreshToken} = request.payload;
    await this.__authenticationsService.verifyRefreshToken(refreshToken);

    // hapus refresh token di database
    await this.__authenticationsService.deleteRefreshToken(refreshToken);

    // kirim response sukses
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
