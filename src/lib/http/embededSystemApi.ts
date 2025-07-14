import axios from 'axios';

const baseUrl =
  process.env.NEXT_PUBLIC_EMBEDDED_SYSTEM_API_URL || 'http://192.168.4.1';

export const embededSystemApi = axios.create({
  baseURL: `${baseUrl}`,
});
