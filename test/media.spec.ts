import 'dotenv/config';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: `http://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.BC_HOST}:${process.env.PORT}/`,
  timeout: 1000,
});

describe('Reading Media', () => {
  test('GET /media/ with media id', async () => {
    const event = (await axios.get('/events')).data.events[0];
    const res = await axios.get(`/media/${event.mediaId}`);
    expect(res.status).toBe(200);
    expect(
      Number(res.headers['content-duration'].replaceAll(':', ''))
    ).toBeGreaterThan(0);
  });
});
