exports.up = (pgm) => {
  pgm.sql('INSERT INTO users(id, username, password, fullname) values(\'old_users\', \'old_users\', \'old_users\', \'old_users\')');

  pgm.sql('UPDATE playlists SET owner = \'old_users\' WHERE owner IS NULL');

  pgm.addConstraint(
      'playlists',
      'fk_playlists.owner_user.id',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner_user.id');

  pgm.sql('UPDATE playlists SET owner = NULL WHERE owner = \'old_users\'');

  pgm.sql('DELETE FROM users WHERE id = \'old_users\'');
};
