const axios = require('axios');
const { buildURLConfig } = require('../utils/resolverHelpers');
const hostname = process.env.WOWZA_HOSTNAME;
const basePath = process.env.WOWZA_LIVESTREAM_BASE_PATH;


const LiveStreams = {
  details: async (parent, args, ctx, info) => {
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${parent.id}`
    );
    const {
      data: { live_stream },
    } = await axios.get(`${hostname + path}`, headers);
    return live_stream;
  },
};

module.exports = LiveStreams;
