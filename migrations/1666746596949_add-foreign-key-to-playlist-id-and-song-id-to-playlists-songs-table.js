exports.up = (pgm) => {
  // playlists
  pgm.addConstraint(
      'playlists_songs',
      'fk_playlists_songs.playlists.id',
      'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );

  // songs
  pgm.addConstraint(
      'playlists_songs',
      'fk_playlists_songs.songs.id',
      'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  // playlists
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.playlists.id');

  // songs
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.songs.id');
};
