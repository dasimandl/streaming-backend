const axios = require('axios');
const { buildURLConfig } = require('../utils/resolverHelpers');
const hostname = process.env.WOWZA_HOSTNAME;
const basePath = process.env.WOWZA_LIVESTREAM_BASE_PATH;

const LiveStream = {
  details: async (parent, args, ctx, info) => {
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${parent.id}`
    );
    try {
      const {
        data: { live_stream },
      } = await axios.get(`${hostname + path}`, headers);
      return live_stream;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  thumbnail: async (parent, args, ctx, info) => {
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${parent.id}/thumbnail_url`
    );
    try {
      const {
        data: { live_stream: liveStreamThumbnail },
      } = await axios.get(`${hostname + path}`, headers);
      liveStreamThumbnail.id = parent.id;
      return liveStreamThumbnail;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
};

module.exports = LiveStream;
