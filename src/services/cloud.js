import axios from "axios";

const creatKey = () =>
  axios
    .post(`https://api.keyvalue.xyz/new/binance-table`)
    .then(({ data }) => new RegExp(`https://api.keyvalue.xyz/(.*)/binance-table`).exec(data)[1]);

const upload = (key, value) => axios.post(`https://api.keyvalue.xyz/${key}/binance-table`, value);

const fetch = (key) => axios.get(`https://api.keyvalue.xyz/${key}/binance-table`);

export const cloudService = {
  creatKey,
  upload,
  fetch,
};
