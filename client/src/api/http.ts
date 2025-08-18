import axios from 'axios';

const END_POINT_URL = import.meta.env.VITE_BASE_URL;

export const http = axios.create({
  baseURL: `${END_POINT_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
