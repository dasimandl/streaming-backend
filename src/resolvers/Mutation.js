const axios = require('axios');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { buildURLConfig } = require('../utils/resolverHelpers');

const hostname = process.env.WOWZA_HOSTNAME;
const basePath = process.env.WOWZA_LIVESTREAM_BASE_PATH;

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
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${args.id}/start`
    );
    try {
      const {
        data: { live_stream: status },
      } = await axios.put(`${hostname + path}`, null, headers);
      status.id = args.id;
      return status;
    } catch (err) {
      console.log('START ERROR');
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
  async liveStreamStop(parent, args, cxt, info) {
    const { headersObj: headers, path } = buildURLConfig(
      `${basePath}/${args.id}/stop`
      );
      try {
        const {
          data: { live_stream: status },
        } = await axios.put(`${hostname + path}`, null, headers);
        status.id = args.id;
        return status;
      } catch (err) {
        console.log('STOP ERRO');
      return console.error(err.response ? err.response.data.meta : err);
    }
  },
};

module.exports = Mutation;
