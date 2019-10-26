const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

const WSC_API_KEY = process.env.WSC_API_KEY;
const WSC_ACCESS_KEY = process.env.WSC_ACCESS_KEY;
const LOCAL_API_URL = process.env.REACT_APP_DEV_API_BASE_URL;
const WOWZA_API_BASE_PATH = process.env.WOWZA_API_BASE_PATH;
const WOWZA_HOSTNAME = process.env.WOWZA_HOSTNAME;

const buildURLConfig = path => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const hmacData = timestamp + ':' + path + ':' + WSC_API_KEY;
  const signature = crypto
    .createHmac('sha256', WSC_API_KEY)
    .update(hmacData)
    .digest('hex');
  return {
    path,
    headersObj: {
      headers: {
        'wsc-access-key': WSC_ACCESS_KEY,
        'wsc-timestamp': timestamp,
        'wsc-signature': signature,
        'Content-Type': 'application/json',
      },
    },
  };
};

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'API' });
});
/* GET live streams. */
router.get('/live-streams', async (req, res, next) => {
  const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
  const { headersObj: headers, path } = buildURLConfig(basePath);
  try {
    const {
      data: { live_streams: availableStreams },
    } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
    const allStreamDetails = await Promise.all(
      availableStreams.map(async ({ id }) => {
        try {
          const { data: liveStreamDetails } = await axios.get(
            `${LOCAL_API_URL}/live-streams/${id}`
          );
          return liveStreamDetails;
        } catch (err) {
          console.error(err.response ? err.response.data.meta : err);
        }
      })
    );
    res.json(allStreamDetails);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});

// GET single live stream details
router.get(`/live-streams/:id`, async (req, res, next) => {
  const { id } = req.params;
  const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
  const { headersObj: headers, path } = buildURLConfig(`${basePath}/${id}`);
  try {
    const {
      data: { live_stream: liveStreamDetail },
    } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
    res.json(liveStreamDetail);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});
// GET single live stream thumbnail image
router.get(`/live-streams/:id/thumbnail`, async (req, res, next) => {
  const { id } = req.params;
  const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
  const { headersObj: headers, path } = buildURLConfig(
    `${basePath}/${id}/thumbnail_url`
  );

  try {
    const {
      data: { live_stream: liveStreamThumbnail },
    } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
    res.json(liveStreamThumbnail);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});

// PUT start live stream
router.put(`/live-streams/:id/start`, async (req, res, next) => {
  const { id } = req.params;
  const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
  const { headersObj: headers, path } = buildURLConfig(
    `${basePath}/${id}/start`
  );
  try {
    const {
      data: { live_stream: status },
    } = await axios.put(`${WOWZA_HOSTNAME + path}`, null, headers);
    res.json(status);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});

// PUT stop live stream
router.put(`/live-streams/:id/stop`, async (req, res, next) => {
  const { id } = req.params;
  const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
  const { headersObj: headers, path } = buildURLConfig(
    `${basePath}/${id}/stop`
  );
  try {
    const {
      data: { live_stream: status },
    } = await axios.put(`${WOWZA_HOSTNAME + path}`, null, headers);
    res.json(status);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});

// GET live stream state
router.get(`/live-streams/:id/state`, async (req, res, next) => {
  const { id } = req.params;
  const basePath = `${WOWZA_API_BASE_PATH}/live_streams`;
  const { headersObj: headers, path } = buildURLConfig(
    `${basePath}/${id}/state`
  );
  try {
    const {
      data: { live_stream: status },
    } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
    res.json(status);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});

// GET recordings
router.get(`/recordings`, async (req, res, next) => {
  const basePath = `${WOWZA_API_BASE_PATH}/recordings`;
  const { headersObj: headers, path } = buildURLConfig(`${basePath}`);
  try {
    const { data } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
    res.json(data);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});

// GET all recordings by stream ID
router.get(`/recordings/:id`, async (req, res, next) => {
  const { id } = req.params;
  const basePath = `${WOWZA_API_BASE_PATH}/recordings`;
  try {
    const {
      data: { recordings },
    } = await axios.get(`${LOCAL_API_URL}/recordings`);
    const filteredRecordings = recordings.filter(
      recording => recording.transcoder_id === id
    );
    const filteredRecordingsDetails = await Promise.all(
      filteredRecordings.map(async ({ id }) => {
        console.log('ID', id);
        try {
          const { headersObj: headers, path } = buildURLConfig(
            `${basePath}/${id}`
          );
          const {
            data: { recording },
          } = await axios.get(`${WOWZA_HOSTNAME + path}`, headers);
          return recording;
        } catch (err) {
          console.error(err.response ? err.response.data.meta : err);
        }
      })
    );
    res.json(filteredRecordingsDetails);
  } catch (err) {
    console.error(err.response ? err.response.data.meta : err);
    next(err);
  }
});

module.exports = router;
