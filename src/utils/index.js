/* eslint-disable linebreak-style */
const mapDBToModel = ({
  year,
  genre,
  duration,
  album_id: albumId,
  ...rest
}) => ({
  ...rest,
});

module.exports = {mapDBToModel};
