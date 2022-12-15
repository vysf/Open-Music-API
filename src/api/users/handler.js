/* eslint-disable linebreak-style */

/**
 * handle user
 */
class UsersHandler {
  /**
   * instance
   * @param {class} service servis user
   * @param {object} validator validator user
   */
  constructor(service, validator) {
    this.__service = service;
    this.__validator = validator;
  }

  /**
   * post user
   * @param {*} request
   * @param {*} h
   * @return {object} response
   */
  async postUserHandler(request, h) {
    // validasi payload
    this.__validator.validateUserPayload(request.payload);
    const {username, password, fullname} = request.payload;

    // dapatkan id dari addUser servis
    const userId = await this.__service.addUser({username, password, fullname});

    // return response
    const response = h.response({
      status: 'success',
      message: 'user berhasil ditambahkan',
      data: {
        userId,
      },
    }).code(201);

    return response;
  }

  /**
   * get user by id
   * @param {*} request
   * @param {*} h
   * @return {object} response
   */
  async getUserByIdHandler(request, h) {
    // destructing id dari request params
    const {id} = request.params;

    // dapatkan user dari getUserById servis
    const user = await this.__service.getUserById(id);

    // return response
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  /**
   * get users by username
   * @param {*} request
   * @param {*} h
   * @return {array} response
   */
  async getUsersByUsernameHandler(request, h) {
    // destructing username dari request query
    const {username = ''} = request.query;

    // dapatkan users dari getUsersByUsername servis
    const users = await this.__service.getUsersByUsername(username);

    // return response
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }
}

module.exports = UsersHandler;
