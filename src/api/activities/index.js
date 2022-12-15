/* eslint-disable linebreak-style */
const routes = require('./routes');
const PlaylistSongActivitiesHandler = require('./handler');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, {activityService, playlistsService}) => {
    const playlistSongActivitiesHandler =
    new PlaylistSongActivitiesHandler(activityService, playlistsService);
    server.route(routes(playlistSongActivitiesHandler));
  },
};
