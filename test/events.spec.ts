import 'dotenv/config';
import Axios from 'axios';
import DemoData from './testdata.json';

const axios = Axios.create({
  baseURL: `http://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.BC_HOST}:${process.env.PORT}`,
  timeout: 1000,
});

let testEvents: any;

describe('Reading Events', () => {
  test('Creating test data...', async () => {
    const res = await axios.post('/test/events', DemoData);
    if (res.status == 500) {
      fail('Could not create test data!');
    }
    testEvents = res.data.data;
    expect(res.data.data.length).toBeGreaterThan(0);
  });

  test('GET /events/', async () => {
    const res = await axios.get('/events/');
    expect(res.status).toBe(200);
  });
  test('GET /events/ with a limit of 1', async () => {
    const res = await axios.get('/events/?limit=1');
    expect(res.data.events.length).toBe(1);
  });
  test('GET /events/ with a limit of 5', async () => {
    const res = await axios.get('/events/?limit=5');
    expect(res.data.events.length).toBe(5);
  });
  test('GET /events/ with a start date', async () => {
    let startDate = testEvents[3].time;

    const res = await axios.get(`/events/?start=${startDate}&limit=15`);
    expect(res.data.events.length).toBeGreaterThanOrEqual(7);
    expect(res.data.events[0].id).toBe(testEvents[3].id);
  });
  test('GET /events/ with a end date', async () => {
    let endDate = testEvents[3].time;

    const res = await axios.get(`/events/?end=${endDate}&limit=15`);
    expect(res.data.events.length).toBe(4);
    expect(res.data.events[3].id).toBe(testEvents[3].id);
  });
  test('GET /events/ with a start and end date', async () => {
    let startDate = testEvents[2].time;
    let endDate = testEvents[3].time;

    const res = await axios.get(
      `/events/?start=${startDate}&end=${endDate}&limit=15`
    );
    expect(res.data.events.length).toBe(2);
  });

  test('Cleaning up...', async () => {
    await axios.delete('/test/events');

    let startDate = Date.parse(testEvents[0].date);
    let endDate = Date.parse(testEvents[14].date);

    const res = await axios.get(
      `/events/?start=${startDate}&end=${endDate}&limit=15`
    );
    expect(res.data.events.length).toBe(0);
  });
});
