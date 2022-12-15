/* eslint-disable linebreak-style */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./utils/config');

const ClientError = require('./exceptions/ClientError');

// songs
const SongValidator = require('./validator/songs');
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

// albums
const AlbumValidator = require('./validator/albums');
const albumsPlugin = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

// users
const UserValidator = require('./validator/users');
const usersPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');

// authetications
const AuthenticationValidator = require('./validator/authentications');
const authenticationsPlugin = require('./api/authentications');
const AuthenticationsService =
require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');

// playlists
const PlaylistValidator = require('./validator/playlists');
const playlistsPlugin = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');

// playlists_songs
const PlaylistSongValidator = require('./validator/playlistsSongs');
const playlistsSongsPlugin = require('./api/playlistsSongs');
const PlaylistsSongsService =
require('./services/postgres/PlaylistsSongsService');

// collaborations
const CollaborationsValidator = require('./validator/collaborations');
const collaborationsPlugin = require('./api/collaborations');
const CollaborationsService =
require('./services/postgres/CollaborationsService');

// activities
const PlaylistSongActivitiesPlugin =
require('./api/activities');
const PlaylistSongActivitiesService =
require('./services/postgres/PlaylistSongActivities');

// exports
const _exportsPlugin = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploadsPlugin = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistsSongsService = new PlaylistsSongsService();
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();
  const storageService = new StorageService(
      path.resolve(__dirname, 'api/uploads/file/images'),
  );

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefiniskan strategy autentikasi jwt
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: config.token.keyAccess,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.age,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        authenticationsService,
        usersService,
        validator: AuthenticationValidator,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: playlistsPlugin,
      options: {
        service: playlistsService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistsSongsPlugin,
      options: {
        service: playlistsSongsService,
        validator: PlaylistSongValidator,
        songsService,
        playlistsService,
        playlistSongActivitiesService,
      },
    },
    {
      plugin: collaborationsPlugin,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: PlaylistSongActivitiesPlugin,
      options: {
        activityService: playlistSongActivitiesService,
        playlistsService,
      },
    },
    {
      plugin: _exportsPlugin,
      options: {
        service: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploadsPlugin,
      options: {
        service: storageService,
        albumsService,
        validator: UploadsValidator,
      },
    },
  ]);

  // mendapatkan konteks response dari request
  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);

        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi
      // secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
        tambah: response,
      }).code(500);

      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response
    // sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
