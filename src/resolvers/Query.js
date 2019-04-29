const { forwardTo } = require('prisma-binding');
const axios = require('axios');
const crypto = require('crypto');
const { buildURLConfig } = require('../utils/resolverHelpers');

const hostname = process.env.WOWZA_HOSTNAME;
const basePath = process.env.WOWZA_LIVESTREAM_BASE_PATH;

const Query = {
  users: forwardTo('db'),
  async liveStreams(parent, args, ctx, info) {
    const { headersObj: headers, path } = buildURLConfig(basePath);
    const {
      data: { live_streams },
    } = await axios.get(`${hostname + path}`, headers);

    return live_streams;
  },
  async liveStream(parent, args, ctx, info) {
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${args.id}`
    );
    const {
      data: { live_stream },
    } = await axios.get(`${hostname + path}`, headers);
    return live_stream;
  },
};

module.exports = Query;
