const axios = require('axios');
const { buildURLConfig } = require('../utils/resolverHelpers');

const WOWZA_HOSTNAME = process.env.WOWZA_HOSTNAME;
const WOWZA_API_BASE_PATH = process.env.WOWZA_API_BASE_PATH;
const LOCAL_API_URL = process.env.REACT_APP_DEV_API_BASE_URL;

const LiveStream = {
  details: async (parent, args, ctx, info) => {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${parent.id}`
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
  thumbnail: async (parent, args, ctx, info) => {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${parent.id}/thumbnail_url`
    );
    try {
      const {
        data: { live_stream: liveStreamThumbnail },
      } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
      liveStreamThumbnail.id = parent.id;
      return liveStreamThumbnail;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  state: async (parent, args, ctx, info) => {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${parent.id}/state`
    );
    try {
      const {
        data: { live_stream: state },
      } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
      state.id = parent.id;
      return state;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  recordings: async (parent, args, ctx, info) => {
    const basePath = `${LOCAL_API_URL}/recordings/${parent.id}`;
    try {
      const { data } = await axios.get(basePath);
      console.log(data);
      return data;
    } catch (err) {
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
};

module.exports = LiveStream;
