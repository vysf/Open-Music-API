/* eslint-disable linebreak-style */
const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getActivitiesByPlaylistId(request, h),
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
