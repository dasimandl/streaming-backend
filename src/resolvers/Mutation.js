const axios = require('axios');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { buildURLConfig } = require('../utils/resolverHelpers');

const WOWZA_HOSTNAME = process.env.WOWZA_HOSTNAME;
const WOWZA_API_BASE_PATH = process.env.WOWZA_API_BASE_PATH;

const Mutation = {
  async signup(parent, args, cxt, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await cxt.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    cxt.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    return user;
  },
  async liveStreamStart(parent, args, cxt, info) {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams/${args.id}/start`;
    console.log(basePath);
    const { headersObj: headers, path } = buildURLConfig(basePath);
    console.log(`${WOWZA_HOSTNAME + path}`);
    try {
      const {
        data: { live_stream: status },
      } = await axios.put(`${WOWZA_HOSTNAME + path}`, null, headers);
      status.id = args.id;
      return status;
    } catch (err) {
      console.log('START ERROR');
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  async liveStreamStop(parent, args, cxt, info) {
    const basePath = `${WOWZA_API_BASE_PATH}/live_streams/${args.id}/stop`;
    const { headersObj: headers, path } = buildURLConfig(basePath);
    try {
      const {
        data: { live_stream: status },
      } = await axios.put(`${WOWZA_HOSTNAME + path}`, null, headers);
      status.id = args.id;
      return status;
    } catch (err) {
      console.log('STOP ERRO');
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
};

module.exports = Mutation;
