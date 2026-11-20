import axios from "axios";
import { config } from "dotenv";
import https from "https";
config();

// SAP
const SAP_USERNAME = process.env.SAP_USERNAME;
const SAP_PWD = process.env.SAP_PWD;
const ODATA_URL = process.env.ODATA_BASE_URL;
const BASIC_AUTH = btoa(SAP_USERNAME + ":" + SAP_PWD);

const defaultHttpsAgent = new https.Agent({
  keepAlive: true,
});

const map = {
  SAP: {
    baseURL: ODATA_URL!,
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
      "Content-type": "application/json",
    },
    httpsAgent: process.env.CLIENT !== "388"
      ? defaultHttpsAgent
      : new https.Agent({
        rejectUnauthorized: false,
      })
  },
};

export const axiosService = (key: keyof typeof map) => {
  return axios.create({
    baseURL: map[key].baseURL as string,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      ...map[key].headers,
    },
    httpsAgent: map[key].httpsAgent,
    withCredentials: true,
  });
};
