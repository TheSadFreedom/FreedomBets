import axios from "axios";

export const httpClient = axios.create({
  baseURL: "/api",
});

/** @deprecated используйте httpClient */
export const api = httpClient;
