/* eslint-disable linebreak-style */
const routes = require('./routes');
const PlaylistsSongsHandler = require('./handler');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    service,
    validator,
    songsService,
    playlistsService,
    playlistSongActivitiesService,
  }) => {
    const playlistsSongsHandler = new PlaylistsSongsHandler(
        service,
        validator,
        songsService,
        playlistsService,
        playlistSongActivitiesService,
    );
    server.route(routes(playlistsSongsHandler));
  },
};
