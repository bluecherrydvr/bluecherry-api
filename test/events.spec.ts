import 'dotenv/config';
import Axios from 'axios';
import { log, error } from "console";

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

        let startDate = Date.parse(events[3].date);

        const res = await axios.get(`/?start=${startDate}&limit=15`);
        expect(res.data.events.length).toBeGreaterThanOrEqual(7);
    });
});
