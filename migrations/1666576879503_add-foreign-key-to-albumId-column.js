exports.up = (pgm) => {
  pgm.sql('INSERT INTO albums(id, name, year) VALUES(\'old_albums\', \'old_albums\', \'1\')');

  pgm.sql('UPDATE songs SET album_id = \'old_albums\' WHERE album_id IS NULL');

  pgm.addConstraint(
      'songs',
      'fk_songs.albums.id',
      'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.albums.id');

  pgm.sql('UPDATE songs SET album_id = NULL WHERE album_id = \'old_albums\'');

  pgm.sql('DELETE FROM albums WHERE id = \'old_albums\'');
};
