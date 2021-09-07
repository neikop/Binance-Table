import axios from "axios";

const fetchPrice = ({ coin, market }) =>
  axios.get(`https://api.binance.com/api/v3/ticker/price`, {
    params: { symbol: coin + market }
  });

export const binanceService = {
  fetchPrice
};
