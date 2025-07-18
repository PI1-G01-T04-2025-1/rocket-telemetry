import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${baseUrl}/api/v1`,
});
