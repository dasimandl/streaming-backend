const { forwardTo } = require('prisma-binding');
const axios = require('axios');
const { buildURLConfig } = require('../utils/resolverHelpers');

const hostname = process.env.WOWZA_HOSTNAME;
const basePath = process.env.WOWZA_LIVESTREAM_BASE_PATH;

const Query = {
  users: forwardTo('db'),
  async liveStreams(parent, args, ctx, info) {
    const { headersObj: headers, path } = buildURLConfig(basePath);
    try {
      const {
        data: { live_streams },
      } = await axios.get(`${hostname + path}`, headers);
      return live_streams;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  async liveStreamDetails(parent, args, ctx, info) {
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${args.id}`
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
  async liveStreamState(parent, args, ctx, info) {
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${args.id}/state`
    );
    console.log('live state');
    try {
      const {
        data: { live_stream: status },
      } = await axios.get(`${hostname + path}`, headers);
      status.id = args.id;
      return status;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
};

module.exports = Query;
