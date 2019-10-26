const { forwardTo } = require('prisma-binding');
const axios = require('axios');
const { buildURLConfig } = require('../utils/resolverHelpers');

const WOWZA_HOSTNAME = process.env.WOWZA_HOSTNAME;
const WOWZA_API_BASE_PATH = process.env.WOWZA_API_BASE_PATH;

const Query = {
  users: forwardTo('db'),
  async liveStreams(parent, args, ctx, info) {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
    const { headersObj: headers, path } = buildURLConfig(basePath);
    try {
      const {
        data: { live_streams },
      } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
      return live_streams;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  async liveStreamDetails(parent, args, ctx, info) {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${args.id}`
    );
    try {
      const {
        data: { live_stream },
      } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
      return live_stream;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  async liveStreamState(parent, args, ctx, info) {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${args.id}/state`
    );
    console.log('live state');
    try {
      const {
        data: { live_stream: status },
      } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
      status.id = args.id;
      return status;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  // async recordingsList(parent, args, ctx, info) {
  //   const basePath = `${WOWZA_API_BASE_PATH}/recordings`;
  //   const { headersObj: headers, path } = buildURLConfig(basePath);
  //   try {
  //     const {
  //       data: {recordings}
  //     } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
  //     console.log(recordings);
  //     return recordings;
  //   } catch (err) {
  //     return console.error(err.response ? err.response.data.meta : err);
  //   }
  // },
  // async recordingsByStream(parent, args, ctx, info) {
  //   const basePath = `${WOWZA_API_BASE_PATH}/recordings/${args.id}`;
  //   const { headersObj: headers, path } = buildURLConfig(basePath);
  //   console.log(Object.keys(this) );
  //   try {
  //     const {
  //       data: {recordings}
  //     } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
  //     return recordings;
  //   } catch (err) {
  //     return console.error(err.response ? err.response.data.meta : err);
  //   }
  // },
};

module.exports = Query;
