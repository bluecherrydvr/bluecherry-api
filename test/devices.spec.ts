import 'dotenv/config';
import Axios from 'axios';

const axios = Axios.create({
    baseURL: `http://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.BC_HOST}:${process.env.PORT}/devices`,
    timeout: 1000,
});

describe("Reading Devices", () => {
    test("GET /devices/", async () => {
        const res = await axios.get("/json");
        expect(res.status).toBe(200);
    });
});
