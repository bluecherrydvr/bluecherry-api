import 'dotenv/config';
import Axios from 'axios';

const axios = Axios.create({
    baseURL: `http://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.BC_HOST}:${process.env.PORT}/events`,
    timeout: 1000,
});

describe("Reading Events", () => {
    test("GET /events/", async () => {
        const res = await axios.get("/");
        expect(res.status).toBe(200);
    });
    test("GET /events/ with a limit of 1", async () => {
        const res = await axios.get("/?limit=1");
        expect(res.data.events.length).toBe(1);
    });
    test("GET /events/ with a limit of 5", async () => {
        const res = await axios.get("/?limit=5");
        expect(res.data.events.length).toBe(5);
    });
    test("GET /events/ with a start date", async () => {
        const events = (await axios.get("/?limit=10")).data.events; //TODO: Add expection for if the server does not have minimum 10 events

        let startDate = Date.parse(events[3].date) / 1000;

        const res = await axios.get(`/?start=${startDate}&limit=15`);
        expect(res.data.events.length).toBeGreaterThanOrEqual(7);
    });
    test("GET /events/ with a end date", async () => {
        const events = (await axios.get("/?limit=10")).data.events; //TODO: Add expection for if the server does not have minimum 10 events

        let endDate = Date.parse(events[3].date) / 1000;

        const res = await axios.get(`/?end=${endDate}&limit=15`);
        expect(res.data.events.length).toBe(4);
    });
    test("GET /events/ with a start and end date", async () => {
        const events = (await axios.get("/?limit=10")).data.events; //TODO: Add expection for if the server does not have minimum 10 events

        let startDate = Date.parse(events[2].date) / 1000;
        let endDate = Date.parse(events[3].date) / 1000;

        const res = await axios.get(`/?start=${startDate}&end=${endDate}&limit=15`);
        expect(res.data.events.length).toBe(2);
    });
});
