import axios from "axios";

const _axiosInstance = axios.create({
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

export const axiosInstance = _axiosInstance;
